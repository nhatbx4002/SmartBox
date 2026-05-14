from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.api_client import ApiError
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
        self.finished = False

    def on_enter(self, data: dict | None = None) -> None:
        compartment = self.state.compartment_data
        if compartment is None:
            self.go_home()
            return

        self.compartment_id = self._compartment_key()
        self.finished = False
        self.remaining = int(get_config_value(self.config, "app.countdown_open", 60))
        size_text = "Size 1 (Nhỏ)" if compartment.size == "SMALL" else "Size 2 (Lớn)"

        self.status_label.setText("MỞ TỦ THÀNH CÔNG")
        self.locker_name_label.setText(self._locker_text())
        self.locker_size_label.setText(size_text)

        is_pickup = self.state.mode == "pickup"
        self.instruction_label.setText(
            "Vui lòng lấy đồ và đóng cửa thật kỹ" if is_pickup else "Vui lòng bỏ đồ vào tủ rồi đóng cửa thật kỹ"
        )
        self.finish_button.setEnabled(True)
        self.timer_label.setStyleSheet("")
        self._render_timer()

        print(f"[locker_open] opening compartment key={self.compartment_id}")
        opened = self.gpio_controller.unlock(self.compartment_id, duration=3)
        print(f"[locker_open] gpio unlock result={opened}")
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
        if self.finished:
            return
        self.finished = True
        self.finish_button.setEnabled(False)
        self.timer.stop()
        if self.compartment_id:
            self.gpio_controller.lock(self.compartment_id)
            self.mqtt_client.publish_lock(self.compartment_id)

        # Pickup mode: mark rental as complete so compartment becomes AVAILABLE
        if self.state.mode == "pickup" and self.state.rental_data:
            try:
                self.api_client.complete_rental(self.state.rental_data.id)
            except ApiError as e:
                print(f"[locker_open] complete_rental failed: {e}")

        self.state.reset_all()
        self.go_home()

    def _locker_text(self) -> str:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if compartment is None:
            return ""

        compartment_name = rental.compartment_name if rental and rental.compartment_name else compartment.name
        if "Ngăn" in compartment_name or compartment.locker_name in compartment_name:
            return compartment_name
        return f"{compartment.locker_name} - Ngăn {compartment_name}"

    def _compartment_key(self) -> str:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if rental and rental.compartment_name:
            return rental.compartment_name
        if compartment is None:
            return ""
        return compartment.id
