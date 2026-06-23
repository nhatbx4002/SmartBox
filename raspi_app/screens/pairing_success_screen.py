from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel

from screens.base import BaseController


class PairingSuccessController(BaseController):
    route = "/pairing-success"

    def __init__(self, app):
        super().__init__(app, self.route, "PairingSuccess.ui")
        self.title_label = self.child("lblTitle", QLabel)
        self.cabinet_label = self.child("lblCabinetId", QLabel)
        self.message_label = self.child("lblMessage", QLabel)
        self.countdown_label = self.child("lblCountdown", QLabel)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.seconds_left = 5
        self._navigated = False

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        cabinet_id = data.get("cabinetId") or getattr(self.app, "cabinet_id", "")
        self.title_label.setText("GHÉP TỦ THÀNH CÔNG")
        self.cabinet_label.setText(f"Cabinet: {cabinet_id}")
        self.message_label.setText("Đang kiểm tra kết nối MQTT...")
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
            self.message_label.setText("Đã kết nối MQTT.")
            self.countdown_label.setText("")
            self._navigated = True
            self.timer.stop()
            self.navigate("/", replace=True)
            return

        self.seconds_left -= 1
        if self.seconds_left <= 0:
            self._navigated = True
            self.timer.stop()
            self.message_label.setText("Sẽ dùng HTTP tạm thời.")
            self.navigate("/", replace=True)
            return

        self.countdown_label.setText(
            f"Tự động vào màn hình chính sau {self.seconds_left} giây"
        )
