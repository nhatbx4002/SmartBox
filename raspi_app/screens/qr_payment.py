from __future__ import annotations

from datetime import datetime, timezone
from io import BytesIO

import qrcode
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget,
)
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.base import BaseController
from services.formatters import format_currency

_POLL_INTERVAL_MS = 5000
_QR_SIZE = 560   # inner QLabel fixed size
_FRAME_PAD = 20  # padding inside white frame on each side


class QRPaymentController(BaseController):
    route = "/qr-payment"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.countdown_label = self.child("lblPaymentCountdown", QLabel)
        self.amount_label = self.child("lblAmountValue", QLabel)
        self.qr_label = self.child("lblQrImage", QLabel)
        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/payment"))

        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.remaining = 299

        self.poll_timer = QTimer(self.widget)
        self.poll_timer.timeout.connect(self._poll_payment_status)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet(
            "QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }"
        )
        h = QHBoxLayout(header)
        h.setContentsMargins(16, 0, 16, 0)

        btn_back = QPushButton("←", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet(
            "QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; }"
            "QPushButton:pressed { color: #FF6600; }"
        )

        title = QLabel("QUÉT MÃ THANH TOÁN", header)
        title.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 900;"
        )

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(20, 24, 20, 0)
        body.setSpacing(16)
        body.setAlignment(Qt.AlignTop)

        # Countdown — trên QR
        self.lbl_countdown = QLabel("05:00", root)
        self.lbl_countdown.setObjectName("lblPaymentCountdown")
        self.lbl_countdown.setAlignment(Qt.AlignCenter)
        self.lbl_countdown.setStyleSheet(
            "background: transparent; border: none; color: #FFB596;"
            "font-size: 48px; font-weight: 900; font-family: 'Be Vietnam Pro', Arial, sans-serif;"
        )
        body.addWidget(self.lbl_countdown)

        # QR frame — trắng, bo góc
        frame_size = _QR_SIZE + _FRAME_PAD * 2
        qr_frame = QFrame(root)
        qr_frame.setFixedSize(frame_size, frame_size)
        qr_frame.setStyleSheet("QFrame { background-color: white; border: none; border-radius: 24px; }")

        qr_frame_layout = QVBoxLayout(qr_frame)
        qr_frame_layout.setContentsMargins(_FRAME_PAD, _FRAME_PAD, _FRAME_PAD, _FRAME_PAD)
        qr_frame_layout.setSpacing(0)
        qr_frame_layout.setAlignment(Qt.AlignCenter)

        self.lbl_qr = QLabel(qr_frame)
        self.lbl_qr.setObjectName("lblQrImage")
        self.lbl_qr.setFixedSize(_QR_SIZE, _QR_SIZE)
        self.lbl_qr.setAlignment(Qt.AlignCenter)
        self.lbl_qr.setStyleSheet("background: transparent; border: none;")
        self.lbl_qr.setScaledContents(False)
        qr_frame_layout.addWidget(self.lbl_qr, alignment=Qt.AlignCenter)

        body.addWidget(qr_frame, alignment=Qt.AlignCenter)

        # Amount — dưới QR
        self.lbl_amount = QLabel("0₫", root)
        self.lbl_amount.setObjectName("lblAmountValue")
        self.lbl_amount.setAlignment(Qt.AlignCenter)
        self.lbl_amount.setStyleSheet(
            "background: transparent; border: none; color: #FF6600;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 44px; font-weight: 900;"
        )
        body.addWidget(self.lbl_amount)

        # Hướng dẫn
        note = QLabel("Quét mã trên ứng dụng ngân hàng để thanh toán", root)
        note.setAlignment(Qt.AlignCenter)
        note.setWordWrap(True)
        note.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 500;"
        )
        body.addWidget(note)

        body.addStretch()
        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        print(
            f"[QRPayment] on_enter — orderCode={self.state.payment_order_code!r} "
            f"qrString={'set' if self.state.payment_qr_string else 'MISSING'} "
            f"expiresAt={self.state.payment_expires_at!r}"
        )
        if self.state.payment_expires_at:
            try:
                dt_str = self.state.payment_expires_at.replace("Z", "+00:00")
                expiry = datetime.fromisoformat(dt_str)
                now = datetime.now(timezone.utc)
                self.remaining = max(0, int((expiry - now).total_seconds()))
            except Exception:
                self.remaining = 299
        else:
            self.remaining = 299

        self._render()
        self._render_qr()

        amount = self.state.payment_amount or (self.state.selected_plan.price if self.state.selected_plan else 0)
        self.amount_label.setText(format_currency(amount))

        self.timer.start(1000)
        self.poll_timer.start(_POLL_INTERVAL_MS)

    def on_exit(self) -> None:
        self.timer.stop()
        self.poll_timer.stop()

    def on_payment_paid(self, order_code, payload) -> None:
        if order_code == self.state.payment_order_code:
            print(f"[QRPayment] MQTT payment confirmed: orderCode={order_code}")
            self._confirm_paid()

    def _poll_payment_status(self) -> None:
        order_code = self.state.payment_order_code
        if not isinstance(order_code, int) or order_code <= 0:
            print(f"[QRPayment] Poll skipped — invalid orderCode: {order_code!r}")
            return
        try:
            result = self.api_client.get_payment_status(order_code)
            if result.get("status") == "PAID":
                print(f"[QRPayment] Poll confirmed PAID: orderCode={order_code}")
                self._confirm_paid()
        except Exception as exc:
            print(f"[QRPayment] Poll error (ignored): {exc}")

    def _confirm_paid(self) -> None:
        self.timer.stop()
        self.poll_timer.stop()
        self.navigate("/rent-success", replace=True)

    def _tick(self) -> None:
        self.remaining -= 1
        self._render()
        if self.remaining <= 0:
            self.timer.stop()
            self.poll_timer.stop()
            self.show_error_dialog(
                message="Phiên thanh toán đã hết hạn. Vui lòng thử lại.",
                title="PHIÊN THANH TOÁN HẾT HẠN",
                on_retry=lambda: self.navigate("/payment", replace=True),
            )

    def _render(self) -> None:
        minutes = max(self.remaining, 0) // 60
        seconds = max(self.remaining, 0) % 60
        self.countdown_label.setText(f"{minutes:02d}:{seconds:02d}")

    def _render_qr(self) -> None:
        qr_string = self.state.payment_qr_string
        if not qr_string:
            print("[QRPayment] QR render skipped — missing qr_string")
            self.qr_label.clear()
            return

        try:
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=12,
                border=2,
            )
            qr.add_data(qr_string)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

            buf = BytesIO()
            img.save(buf, format="PNG")

            pixmap = QPixmap()
            ok = pixmap.loadFromData(buf.getvalue(), "PNG")

            if not ok or pixmap.isNull():
                print("[QRPayment] QR pixmap load failed")
                return

            self.qr_label.setPixmap(
                pixmap.scaled(
                    self.qr_label.size(),
                    Qt.KeepAspectRatio,
                    Qt.SmoothTransformation,
                )
            )
            print(f"[QRPayment] QR rendered — {_QR_SIZE}×{_QR_SIZE}")

        except Exception as exc:
            print(f"[QRPayment] QR render error: {exc}")
            self.qr_label.clear()
