from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController, process_events


class LockerOpenController(BaseController):
    route = "/locker-open"

    def __init__(self, app):
        super().__init__(app, self.route, "OpenSuccess.ui")
        self.status_label = self.child("lblOpenStatus", QLabel)
        self.locker_name_label = self.child("lblLockerName", QLabel)
        self.locker_size_label = self.child("lblLockerSize", QLabel)
        self.instruction_label = self.child("lblInstruction", QLabel)
        self.door_status_label = self.child("lblDoorStatusText", QLabel)
        self.finish_button = self.child("btnFinish", QPushButton)
        self.finish_button.clicked.connect(self._finish)
        self.finish_button.setEnabled(False)
        self.door_poll_timer = QTimer(self.widget)
        self.door_poll_timer.timeout.connect(self._poll_door_status)
        self.compartment_id = ""
        self.finished = False

    def on_enter(self, data: dict | None = None) -> None:
        compartment = self.state.compartment_data
        if compartment is None:
            self.go_home()
            return

        self.compartment_id = self._compartment_key()
        self.finished = False
        self.finish_button.setEnabled(False)
        self.finish_button.setText("HOÀN THÀNH")

        size_text = "Size 1 (Nhỏ)" if compartment.size == "SMALL" else "Size 2 (Lớn)"

        self.status_label.setText("MỞ TỦ THÀNH CÔNG")
        self.locker_name_label.setText(self._locker_text())
        self.locker_size_label.setText(size_text)

        is_pickup = self.state.mode == "pickup"
        self.instruction_label.setText(
            "Vui lòng lấy đồ và đóng cửa thật kỹ" if is_pickup else "Vui lòng bỏ đồ vào tủ rồi đóng cửa thật kỹ"
        )

        self._update_door_status("CỬA ĐANG MỞ", "#FF6600")
        self.door_poll_timer.start(1000)

        self._attempt_unlock()

    def on_exit(self) -> None:
        self.door_poll_timer.stop()

    def _attempt_unlock(self) -> None:
        self.unlock_attempts = getattr(self, "unlock_attempts", 0) + 1
        print(f"[locker_open] opening compartment key={self.compartment_id} (attempt {self.unlock_attempts})")
        opened = self.gpio_controller.unlock(self.compartment_id, duration=3)
        print(f"[locker_open] gpio unlock result={opened}")

        if opened:
            self.hide_error_dialog()
            self.mqtt_client.publish_unlock(self.compartment_id, duration=3)
            rental_id = self.state.rental_data.id if self.state.rental_data else None
            if rental_id:
                self.mqtt_client.publish_door_opened(self.compartment_id, rental_id)
        else:
            if self.unlock_attempts < 3:
                self.show_error_dialog(
                    message=f"Không thể kích hoạt mở khóa tủ (Lần thử {self.unlock_attempts}/3). Vui lòng kiểm tra lại thiết bị.",
                    title="LỖI PHẦN CỨNG",
                    on_retry=self._attempt_unlock,
                )
            else:
                self.door_poll_timer.stop()
                self.navigate("/error", {
                    "title": "Lỗi phần cứng nghiêm trọng",
                    "message": f"Kích hoạt mở khóa khoang tủ {self.compartment_id} thất bại sau 3 lần thử liên tiếp. GPIO không hoạt động.",
                    "retry_route": "/",
                }, replace=True)

    def _poll_door_status(self) -> None:
        if self.finished:
            self.door_poll_timer.stop()
            return

        door_status = self.gpio_controller.get_door_status(self.compartment_id)
        print(f"[locker_open] door status={door_status}")

        if door_status == "CLOSED":
            self._update_door_status("CỬA ĐÃ ĐÓNG", "#00C853")
            self.finish_button.setEnabled(True)
            self.door_poll_timer.stop()
        elif door_status == "OPEN":
            self._update_door_status("CỬA ĐANG MỞ", "#FF6600")
            self.finish_button.setEnabled(False)
        else:
            self._update_door_status("ĐANG KIỂM TRA...", "#888888")
            self.finish_button.setEnabled(False)

    def _update_door_status(self, text: str, color: str) -> None:
        self.door_status_label.setText(text)
        self.door_status_label.setStyleSheet(f"color: {color}; font-size: 24px; font-weight: 900; background-color: transparent;")

    def _finish(self) -> None:
        if self.finished:
            return

        self.door_poll_timer.stop()
        self.finish_button.setEnabled(False)
        self.finish_button.setText("ĐANG HOÀN THÀNH...")
        process_events()

        if self.compartment_id:
            self.gpio_controller.lock(self.compartment_id)
            self.mqtt_client.publish_lock(self.compartment_id)

        self._complete_rental_action()

    def _complete_rental_action(self) -> None:
        # ponytail: rental completion is driven by the backend, not the kiosk.
        # handleUnlock auto-completes + releases the compartment once
        # openCount reaches maxOpens; the expiry job handles time-outs. Forcing
        # complete here killed multi-open plans after the first pickup.
        self.finished = True
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
