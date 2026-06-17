from __future__ import annotations

from datetime import datetime, timezone
import qrcode
from io import BytesIO
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.formatters import format_currency


class QRPaymentController(BaseController):
    route = "/qr-payment"

    def __init__(self, app):
        super().__init__(app, self.route, "QRPayment.ui")
        self.countdown_label = self.child("lblPaymentCountdown", QLabel)
        self.amount_label = self.child("lblAmountValue", QLabel)
        self.qr_label = self.child("lblQrImage", QLabel)
        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/payment"))
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.remaining = 299

    def on_enter(self, data: dict | None = None) -> None:
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

    def on_exit(self) -> None:
        self.timer.stop()

    def on_payment_paid(self, order_code, payload) -> None:
        if order_code == self.state.payment_order_code:
            self.timer.stop()
            self.navigate("/rent-success", replace=True)

    def _tick(self) -> None:
        self.remaining -= 1
        self._render()
        if self.remaining <= 0:
            self.timer.stop()
            self.show_error_dialog(
                message="Thời gian thanh toán đã hết hạn. Vui lòng thử lại.",
                title="GIAO DỊCH HẾT HẠN",
                on_retry=lambda: self.navigate("/payment", replace=True),
            )

    def _render(self) -> None:
        minutes = max(self.remaining, 0) // 60
        seconds = max(self.remaining, 0) % 60
        self.countdown_label.setText(f"{minutes:02d}:{seconds:02d}")

    def _render_qr(self) -> None:
        qr_string = self.state.payment_qr_string
        if not qr_string:
            return
        
        img = qrcode.make(qr_string)
        buf = BytesIO()
        img.save(buf, format="PNG")
        pixmap = QPixmap()
        pixmap.loadFromData(buf.getvalue(), "PNG")
        self.qr_label.setPixmap(pixmap.scaled(
            self.qr_label.width(), self.qr_label.height(),
            Qt.KeepAspectRatio, Qt.SmoothTransformation,
        ))
