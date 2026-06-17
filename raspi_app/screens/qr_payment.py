from __future__ import annotations

from datetime import datetime, timezone
import qrcode
from io import BytesIO
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.formatters import format_currency

# Poll the backend every 5 seconds as a fallback when the MQTT signal is
# missed (e.g. broker offline, network blip, or race with the webhook).
_POLL_INTERVAL_MS = 5000


class QRPaymentController(BaseController):
    route = "/qr-payment"

    def __init__(self, app):
        super().__init__(app, self.route, "QRPayment.ui")
        self.countdown_label = self.child("lblPaymentCountdown", QLabel)
        self.amount_label = self.child("lblAmountValue", QLabel)
        self.qr_label = self.child("lblQrImage", QLabel)
        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/payment"))

        # Countdown timer (1-second ticks)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.remaining = 299

        # Polling fallback timer
        self.poll_timer = QTimer(self.widget)
        self.poll_timer.timeout.connect(self._poll_payment_status)

    def on_enter(self, data: dict | None = None) -> None:
        print(f"[QRPayment] on_enter — orderCode={self.state.payment_order_code!r} "
              f"qrString={'set' if self.state.payment_qr_string else 'MISSING'} "
              f"expiresAt={self.state.payment_expires_at!r}")
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
        """Called from MQTT signal (already on Qt main thread)."""
        if order_code == self.state.payment_order_code:
            print(f"[QRPayment] MQTT payment confirmed: orderCode={order_code}")
            self._confirm_paid()

    def _poll_payment_status(self) -> None:
        """Fallback: poll GET /api/payments/payment-status every 5 s."""
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
            # Silently ignore poll errors — MQTT is the primary channel
            print(f"[QRPayment] Poll error (ignored): {exc}")

    def _confirm_paid(self) -> None:
        """Stop all timers and navigate to success screen."""
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
