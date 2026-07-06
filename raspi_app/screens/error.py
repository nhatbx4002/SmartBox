from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
from services.config_loader import get_config_value


class ErrorController(BaseController):
    route = "/error"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

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

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(32, 0, 32, 48)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setSpacing(16)
        body.setAlignment(Qt.AlignCenter)

        icon_label = QLabel("⚠️", root)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setFixedHeight(100)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 80px;")
        body.addWidget(icon_label)

        self.title = QLabel("", root)
        self.title.setObjectName("lblTitle")
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet("background: transparent; border: none; color: #EF4444; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 28px; font-weight: 900;")
        body.addWidget(self.title)

        self.message = QLabel("", root)
        self.message.setObjectName("lblMessage")
        self.message.setAlignment(Qt.AlignCenter)
        self.message.setWordWrap(True)
        self.message.setStyleSheet("background: transparent; border: none; color: #B0B0B0; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500;")
        body.addWidget(self.message)

        self.hotline = QLabel("", root)
        self.hotline.setObjectName("lblHotline")
        self.hotline.setAlignment(Qt.AlignCenter)
        self.hotline.setStyleSheet("background: transparent; border: none; color: #FFFFFF; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 16px; font-weight: 700;")
        body.addWidget(self.hotline)

        self.countdown = QLabel("", root)
        self.countdown.setObjectName("lblCountdown")
        self.countdown.setAlignment(Qt.AlignCenter)
        self.countdown.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 16px; font-weight: 500;")
        body.addWidget(self.countdown)

        body.addSpacing(32)

        btn_retry = QPushButton("THỬ LẠI")
        btn_retry.setObjectName("btnRetry")
        btn_retry.setFixedHeight(80)
        btn_retry.setCursor(Qt.PointingHandCursor)
        btn_retry.setStyleSheet("QPushButton { background-color: #FF6600; color: white; border: none; border-radius: 18px; font-size: 22px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }")
        body.addWidget(btn_retry)

        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        message = data.get("message", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.")
        title = data.get("title", "ĐÃ XẢY RA LỖI")
        if self.network_status == "OFFLINE" and "OFFLINE" not in message.upper():
            message = f"{message}\nTrạng thái mạng: {self.network_status}"

        self.title_label.setText(title.upper())
        self.message_label.setText(message)

        hotline = get_config_value(self.config, "support.hotline", "1900 1234")
        self.hotline_label.setText(f"Hỗ trợ: {hotline} • {self.network_status}")

        self.retry_route = data.get("retry_route", "/")
        self.retry_data = data.get("retry_data", {})

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
