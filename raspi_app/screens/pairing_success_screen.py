from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style

from screens.base import BaseController


class PairingSuccessController(BaseController):
    route = "/pairing-success"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.title_label = self.child("lblTitle", QLabel)
        self.cabinet_label = self.child("lblCabinetId", QLabel)
        self.message_label = self.child("lblMessage", QLabel)
        self.countdown_label = self.child("lblCountdown", QLabel)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.seconds_left = 5
        self._navigated = False

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setContentsMargins(40, 80, 40, 0)
        body.setSpacing(16)
        body.setAlignment(Qt.AlignTop)

        icon_label = QLabel("\u2705", root)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setFixedHeight(120)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 100px;")
        body.addWidget(icon_label)

        self.title = QLabel("GH\xc9P T\u1ee6 TH\xc0NH C\xd4NG", root)
        self.title.setObjectName("lblTitle")
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet("background: transparent; border: none; color: #2E7D32; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 32px; font-weight: 900;")
        body.addWidget(self.title)

        info_card = QFrame(root)
        info_card.setFixedHeight(120)
        info_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #2E7D32; border-radius: 24px; } QLabel { background: transparent; }")
        i_layout = QVBoxLayout(info_card)
        i_layout.setAlignment(Qt.AlignCenter)

        self.cabinet = QLabel("", info_card)
        self.cabinet.setObjectName("lblCabinetId")
        self.cabinet.setAlignment(Qt.AlignCenter)
        self.cabinet.setStyleSheet("border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 28px; font-weight: 900;")

        i_layout.addWidget(self.cabinet)
        body.addWidget(info_card)

        self.message = QLabel("\u0110ang ki\u1ec3m tra k\u1ebft n\u1ed1i MQTT...", root)
        self.message.setObjectName("lblMessage")
        self.message.setAlignment(Qt.AlignCenter)
        self.message.setStyleSheet("background: transparent; border: none; color: #B0B0B0; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 600;")
        body.addWidget(self.message)

        self.countdown = QLabel("", root)
        self.countdown.setObjectName("lblCountdown")
        self.countdown.setAlignment(Qt.AlignCenter)
        self.countdown.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 16px; font-weight: 500;")
        body.addWidget(self.countdown)

        body.addStretch()
        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        cabinet_id = data.get("cabinetId") or getattr(self.app, "cabinet_id", "")
        self.title_label.setText("GHÉP NỐI THÀNH CÔNG")
        self.cabinet_label.setText(f"Cabinet: {cabinet_id}")
        self.message_label.setText("Đang kiểm tra kết nối hệ thống...")
        self.seconds_left = 5
        self._navigated = False
        self.countdown_label.setText("")
        self.timer.start(1000)

    def on_exit(self) -> None:
        self.timer.stop()

    def _tick(self) -> None:
        if self._navigated:
            return

        if getattr(self.app, "mqtt_client", None) and self.app.mqtt_client.connected:
            self.message_label.setText("Đã kết nối với hệ thống.")
            self.countdown_label.setText("")
            self._navigated = True
            self.timer.stop()
            self.navigate("/", replace=True)
            return

        self.seconds_left -= 1
        if self.seconds_left <= 0:
            self._navigated = True
            self.timer.stop()
            self.message_label.setText("Tạm thời sử dụng HTTP.")
            self.navigate("/", replace=True)
            return

        self.countdown_label.setText(
            f"Tự động quay về màn hình chính sau {self.seconds_left} giây"
        )
