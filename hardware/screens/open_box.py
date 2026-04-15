from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base_screen import BaseScreen


class OpenBoxScreen(BaseScreen):
    def __init__(self, app) -> None:
        super().__init__(app, "OpenBox.ui", title="Mở tủ", show_back=False)
        self.btn_complete = self.find("btnComplete", QPushButton)
        self.label_box_name = self.find("labelBoxName", QLabel)
        self.label_box_state = self.find("labelBoxState", QLabel)
        self.label_instruction = self.find("labelInstruction", QLabel)
        self.label_timer_value = self.find("labelTimerValue", QLabel)
        self._timer = QTimer()
        self._timer.timeout.connect(self._tick)
        self._opened_compartment = None

        if self.btn_complete is not None:
            self._reg(self.btn_complete, self.app.complete_open_box)

    def on_enter(self, **kwargs) -> None:
        super().on_enter(**kwargs)
        compartment_id = kwargs.get("compartment_id") or self.app.state.active_compartment
        if not compartment_id:
            self.app.show_error("Khong xac dinh duoc ngan tu can mo.")
            self.app.go_home()
            return

        self._opened_compartment = compartment_id
        self.app.state.prepare_open_box(compartment_id)

        if self.label_box_name is not None:
            self.label_box_name.setText(f"Tu {compartment_id}")
        if self.label_box_state is not None:
            self.label_box_state.setText("Dang mo")
        if self.label_instruction is not None:
            self.label_instruction.setText("Vui long bo do vao tu va dong cua that ky.")

        self._update_timer()
        self._timer.start(1000)
        self.app.trigger_locker_open(compartment_id)

    def on_exit(self) -> None:
        self._timer.stop()
        self._opened_compartment = None
        super().on_exit()

    def _tick(self) -> None:
        self.app.state.remaining -= 1
        self._update_timer()
        if self.app.state.remaining <= 0:
            self.app.complete_open_box()

    def _update_timer(self) -> None:
        if self.label_timer_value is not None:
            self.label_timer_value.setText(str(max(self.app.state.remaining, 0)))

    def handle_door_closed(self, compartment_id: str) -> None:
        if compartment_id != self._opened_compartment:
            return
        if self.label_box_state is not None:
            self.label_box_state.setText("Da dong cua")
        if self.label_instruction is not None:
            self.label_instruction.setText("Cua tu da dong. Den se tat khi het 60 giay hoac khi ban nhan Hoan tat.")
