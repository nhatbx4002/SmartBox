from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget
from screens.components.buttons import PrimaryButton
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style

from screens.base import BaseController, process_events


class LockerOpenController(BaseController):
    route = "/locker-open"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

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

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet("QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }")
        h = _HLayout(header, 16, 0, 16, 0)

        title = QLabel("Mở Tủ", header)
        title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(32, 40, 32, 0)
        body.setSpacing(16)
        body.setAlignment(Qt.AlignTop)

        icon_label = QLabel("\U0001f513", root)
        icon_label.setObjectName("lblOpenIcon")
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setFixedHeight(140)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 100px;")
        body.addWidget(icon_label)

        self.status = QLabel("Mở Cửa Thành Công", root)
        self.status.setObjectName("lblOpenStatus")
        self.status.setAlignment(Qt.AlignCenter)
        self.status.setStyleSheet("background: transparent; border: none; color: #2E7D32; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 36px; font-weight: 900;")
        body.addWidget(self.status)

        self.locker_name = QLabel("", root)
        self.locker_name.setObjectName("lblLockerName")
        self.locker_name.setAlignment(Qt.AlignCenter)
        self.locker_name.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 700;")
        body.addWidget(self.locker_name)

        self.locker_size = QLabel("", root)
        self.locker_size.setObjectName("lblLockerSize")
        self.locker_size.setAlignment(Qt.AlignCenter)
        self.locker_size.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 500;")
        body.addWidget(self.locker_size)

        door_card = QFrame(root)
        door_card.setFixedHeight(120)
        door_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 20px; } QLabel { background: transparent; }")
        d_layout = QVBoxLayout(door_card)
        d_layout.setAlignment(Qt.AlignCenter)

        door_label = QLabel("Trạng thái cửa", door_card)
        door_label.setAlignment(Qt.AlignCenter)
        door_label.setStyleSheet("border: none; color: #888; font-size: 18px; font-weight: 500;")

        self.door_status = QLabel("Đang Kiểm Tra", door_card)
        self.door_status.setObjectName("lblDoorStatusText")
        self.door_status.setAlignment(Qt.AlignCenter)
        self.door_status.setStyleSheet("border: none; color: #888; font-size: 24px; font-weight: 900;")

        d_layout.addWidget(door_label)
        d_layout.addWidget(self.door_status)
        body.addWidget(door_card)

        self.instruction = QLabel("", root)
        self.instruction.setObjectName("lblInstruction")
        self.instruction.setAlignment(Qt.AlignCenter)
        self.instruction.setWordWrap(True)
        self.instruction.setStyleSheet("background: transparent; border: none; color: #999; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500; padding: 8px 0;")
        body.addWidget(self.instruction)

        body.addStretch()

        self.finish = PrimaryButton("HOÀN THÀNH", object_name="btnFinish", parent=root, color="green", height=88, radius=18)
        self.finish.setEnabled(False)
        body.addWidget(self.finish)

        layout.addLayout(body)
        return root

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

        self._update_door_status("Cửa Đang Mở", "#FF6600")
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
                    message=(
                        f"Không thể kích hoạt mở khóa tủ "
                        f"(Lần thử {self.unlock_attempts}/3). "
                        "Vui lòng kiểm tra lại thiết bị."
                    ),
                    title="LỖI PHẦN CỨNG",
                    on_retry=self._attempt_unlock,
                )
            else:
                self.door_poll_timer.stop()
                self.navigate("/error", {
                    "title": "Không thể mở tủ",
                    "message": f"Không thể mở khoang tủ {self.compartment_id} sau nhiều lần thử. Vui lòng liên hệ nhân viên hỗ trợ.",
                    "retry_route": "/",
                }, replace=True)

    def _poll_door_status(self) -> None:
        if self.finished:
            self.door_poll_timer.stop()
            return

        door_status = self.gpio_controller.get_door_status(self.compartment_id)
        print(f"[locker_open] door status={door_status}")

        if door_status == "CLOSED":
            self._update_door_status("Cửa Đang Đóng", "#00C853")
            self.finish_button.setEnabled(True)
            self.door_poll_timer.stop()
        elif door_status == "OPEN":
            self._update_door_status("Cửa Đang Mở", "#FF6600")
            self.finish_button.setEnabled(False)
        else:
            self._update_door_status("Đang kiểm tra....", "#888888")
            self.finish_button.setEnabled(False)

    def _update_door_status(self, text: str, color: str) -> None:
        self.door_status_label.setText(text)
        self.door_status_label.setStyleSheet(f"color: {color}; font-size: 24px; font-weight: 900; background: transparent;")

    def _finish(self) -> None:
        if self.finished:
            return

        self.door_poll_timer.stop()
        self.finish_button.setEnabled(False)
        self.finish_button.setText("Đang Hoàn Thành....")
        process_events()

        if self.compartment_id:
            self.gpio_controller.lock(self.compartment_id)
            self.mqtt_client.publish_lock(self.compartment_id)

        self._complete_rental_action()

    def _complete_rental_action(self) -> None:
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


def _HLayout(parent, left, top, right, bottom):
    from PySide6.QtWidgets import QHBoxLayout
    l = QHBoxLayout(parent)
    l.setContentsMargins(left, top, right, bottom)
    return l
