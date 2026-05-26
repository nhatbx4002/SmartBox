from __future__ import annotations

from pathlib import Path

from PySide6.QtCore import QTimer
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
        self.remaining = 299
        self._render()
        if self.state.selected_plan:
            self.amount_label.setText(format_currency(self.state.selected_plan.price))
        qr_path = Path(__file__).resolve().parents[1] / "assets" / "qrcode.png"
        if qr_path.exists():
            self.qr_label.setPixmap(QPixmap(str(qr_path)))
        self.timer.start(1000)

    def on_exit(self) -> None:
        self.timer.stop()

    def _tick(self) -> None:
        self.remaining -= 1
        self._render()
        if self.remaining <= 0:
            self.navigate("/payment", replace=True)

    def _render(self) -> None:
        minutes = max(self.remaining, 0) // 60
        seconds = max(self.remaining, 0) % 60
        self.countdown_label.setText(f"{minutes:02d}:{seconds:02d}")
