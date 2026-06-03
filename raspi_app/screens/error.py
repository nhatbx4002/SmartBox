from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.config_loader import get_config_value


class ErrorController(BaseController):
    """Full-page error screen representing the /error route."""

    route = "/error"

    def __init__(self, app):
        super().__init__(app, self.route, "ErrorScreen.ui")
        self.title_label = self.child("lblTitle", QLabel)
        self.message_label = self.child("lblMessage", QLabel)
        self.hotline_label = self.child("lblHotline", QLabel)
        self.countdown_label = self.child("lblCountdown", QLabel)
        self.retry_button = self.child("btnRetry", QPushButton)

        self.retry_button.clicked.connect(self._retry)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)

        self.retry_route = "/"
        self.retry_data = {}
        self.countdown = 30

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        message = data.get("message", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.")
        title = data.get("title", "ĐÃ XẢY RA LỖI")
        if self.network_status == "OFFLINE" and "OFFLINE" not in message.upper():
            message = f"{message}\nTrạng thái mạng: {self.network_status}"

        self.title_label.setText(title.upper())
        self.message_label.setText(message)

        # Load hotline from configuration
        hotline = get_config_value(self.config, "support.hotline", "1900 1234")
        self.hotline_label.setText(f"Hotline: {hotline} • {self.network_status}")

        # Configure retry target
        self.retry_route = data.get("retry_route", "/")
        self.retry_data = data.get("retry_data", {})

        # Setup countdown timer
        self.countdown = 30
        self.countdown_label.setText("Tự động thử lại sau 30 giây...")
        self.timer.start(1000)

    def on_exit(self) -> None:
        self.timer.stop()

    def _tick(self) -> None:
        self.countdown -= 1
        if self.countdown <= 0:
            self._retry()
        else:
            self.countdown_label.setText(f"Tự động thử lại sau {self.countdown} giây...")

    def _retry(self) -> None:
        self.timer.stop()
        self.navigate(self.retry_route, self.retry_data, replace=True)
