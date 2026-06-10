from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController, process_events
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
        self.door_status_timer = QTimer(self.widget)
        self.door_status_timer.timeout.connect(self._refresh_door_status)
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
        self.unlock_attempts = 0
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
        self.finish_button.setText("HOÀN THÀNH")
        self.timer_label.setStyleSheet("")
        self._render_timer()
        self._refresh_door_status()

        self._attempt_unlock()

    def _attempt_unlock(self) -> None:
        self.unlock_attempts += 1
        print(f"[locker_open] opening compartment key={self.compartment_id} (attempt {self.unlock_attempts})")
        opened = self.gpio_controller.unlock(self.compartment_id, duration=3)
        print(f"[locker_open] gpio unlock result={opened}")

        if opened:
            self.hide_error_dialog()
            self.mqtt_client.publish_unlock(self.compartment_id, duration=3)
            rental_id = self.state.rental_data.id if self.state.rental_data else None
            if rental_id:
                self.mqtt_client.publish_door_opened(self.compartment_id, rental_id)
            self.timer.start(1000)
            self.door_status_timer.start(1000)
        else:
            if self.unlock_attempts < 3:
                self.show_error_dialog(
                    message=f"Không thể kích hoạt mở khóa tủ (Lần thử {self.unlock_attempts}/3). Vui lòng kiểm tra lại thiết bị.",
                    title="LỖI PHẦN CỨNG",
                    on_retry=self._attempt_unlock,
                )
            else:
                self.timer.stop()
                self.navigate("/error", {
                    "title": "Lỗi phần cứng nghiêm trọng",
                    "message": f"Kích hoạt mở khóa khoang tủ {self.compartment_id} thất bại sau 3 lần thử liên tiếp. GPIO không hoạt động.",
                    "retry_route": "/",
                }, replace=True)

    def on_exit(self) -> None:
        self.timer.stop()
        self.door_status_timer.stop()

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
        if not self._door_is_closed():
            self._show_close_door_required()
            return
        self.timer.stop()
        self.door_status_timer.stop()
        if self.compartment_id:
            self.gpio_controller.lock(self.compartment_id)
            self.mqtt_client.publish_lock(self.compartment_id)

        self._complete_rental_action()

    def _complete_rental_action(self) -> None:
        if self.state.mode == "pickup" and self.state.rental_data:
            self.finish_button.setEnabled(False)
            self.finish_button.setText("ĐANG HOÀN THÀNH...")
            process_events()
            try:
                self.api_client.complete_rental(self.state.rental_data.id)
                self.hide_error_dialog()
            except Exception as e:
                print(f"[locker_open] complete_rental failed: {e}")
                self.finish_button.setEnabled(True)
                self.finish_button.setText("HOÀN THÀNH")
                self.show_error_dialog(
                    message=str(e) or "Không thể đồng bộ trạng thái hoàn thành lên máy chủ.",
                    title="LỖI ĐỒNG BỘ",
                    on_retry=self._complete_rental_action,
                )
                return

        self.finished = True
        self.state.reset_all()
        self.go_home()

    def _refresh_door_status(self) -> None:
        if not self.compartment_id or self.finished:
            return

        status = self._door_status()
        if status == "CLOSED":
            self.finish_button.setEnabled(True)
            self.finish_button.setText("HOÀN THÀNH")
            is_pickup = self.state.mode == "pickup"
            self.instruction_label.setText(
                "Vui lòng lấy đồ và đóng cửa thật kỹ" if is_pickup else "Vui lòng bỏ đồ vào tủ rồi đóng cửa thật kỹ"
            )
        else:
            self.finish_button.setEnabled(False)
            self.finish_button.setText("CHƯA ĐÓNG CỬA")
            self.instruction_label.setText("Vui lòng đóng cửa tủ thật kỹ trước khi hoàn thành")

    def _door_status(self) -> str:
        try:
            return str(self.gpio_controller.get_door_status(self.compartment_id)).upper()
        except Exception as error:
            print(f"[locker_open] door status read failed: {error}")
            return "UNKNOWN"

    def _door_is_closed(self) -> bool:
        return self._door_status() == "CLOSED"

    def _show_close_door_required(self) -> None:
        self.timer.stop()
        self.door_status_timer.start(1000)
        self._refresh_door_status()
        self.show_error_dialog(
            message="Cửa tủ chưa đóng. Vui lòng đóng cửa thật kỹ rồi bấm Hoàn thành.",
            title="CHƯA ĐÓNG CỬA TỦ",
            on_retry=self._finish,
        )

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
