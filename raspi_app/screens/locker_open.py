from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.config_loader import get_config_value


class LockerOpenController(BaseController):
    route = "/locker-open"

    def __init__(self, app):
        super().__init__(app, self.route, "OpenSuccess.ui")
        self.status_label = self.child("lblOpenStatus", QLabel)
        self.locker_name_label = self.child("lblLockerName", QLabel)
        self.locker_size_label = self.child("lblLockerSize", QLabel)
        self.instruction_label = self.child("lblInstruction", QLabel)
        self.timer_label = self.child("lblTimerNumber", QLabel)
        self.finish_button = self.child("btnFinish", QPushButton)
        self.finish_button.clicked.connect(self._finish)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.remaining = 0
        self.compartment_id = ""

    def on_enter(self, data: dict | None = None) -> None:
        compartment = self.state.compartment_data
        if compartment is None:
            self.go_home()
            return

        self.compartment_id = compartment.id
        self.remaining = int(get_config_value(self.config, "app.countdown_open", 60))
        size_text = "Size 1 (Nhỏ)" if compartment.size == "SMALL" else "Size 2 (Lớn)"

        self.status_label.setText("MỞ TỦ THÀNH CÔNG")
        self.locker_name_label.setText(compartment.name)
        self.locker_size_label.setText(size_text)
        self.instruction_label.setText("Vui lòng bỏ đồ vào tủ rồi đóng cửa thật kỹ")
        self.timer_label.setStyleSheet("")
        self._render_timer()

        self.gpio_controller.unlock(self.compartment_id, duration=3)
        self.mqtt_client.publish_unlock(self.compartment_id, duration=3)
        rental_id = self.state.rental_data.id if self.state.rental_data else None
        if rental_id:
            self.mqtt_client.publish_door_opened(self.compartment_id, rental_id)
        self.timer.start(1000)

    def on_exit(self) -> None:
        self.timer.stop()

    def _tick(self) -> None:
        self.remaining -= 1
        self._render_timer()
        if self.remaining <= 0:
            self._finish()

    def _render_timer(self) -> None:
        self.timer_label.setText(str(max(self.remaining, 0)))
        if self.remaining <= 10:
            self.timer_label.setStyleSheet("color: #EF4444;")

    def _finish(self) -> None:
        self.timer.stop()
        if self.compartment_id:
            self.gpio_controller.lock(self.compartment_id)
            self.mqtt_client.publish_lock(self.compartment_id)
        self.go_home()
