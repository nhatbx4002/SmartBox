from __future__ import annotations

from typing import Any, Dict, Optional

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QDialog, QGridLayout, QPushButton, QVBoxLayout

from .base import HardwareBase
from .keypad_4x4 import Keypad4x4


class _KeypadDialog(QDialog):
    def __init__(self, owner: "GPIOSimulator", parent: Optional[object] = None) -> None:
        super().__init__(parent)
        self.owner = owner
        self.setWindowTitle("SmartBox Keypad")
        self.setModal(False)
        self.setWindowFlag(Qt.WindowStaysOnTopHint, True)
        self.setFixedSize(280, 360)

        outer = QVBoxLayout(self)
        grid = QGridLayout()
        grid.setSpacing(8)
        outer.addLayout(grid)

        for row_index, row in enumerate(Keypad4x4.KEY_LAYOUT):
            for col_index, key in enumerate(row):
                button = QPushButton(key)
                button.setFixedSize(56, 56)
                button.clicked.connect(lambda _checked=False, value=key: self.owner.emit_keypad(value))
                grid.addWidget(button, row_index, col_index)


class GPIOSimulator(HardwareBase):
    def __init__(self, config: Optional[Dict[str, Any]] = None, parent: Optional[object] = None) -> None:
        super().__init__()
        self.config = config or {}
        self.parent = parent
        self._door_states: Dict[str, bool] = {}
        self._keypad_dialog: Optional[_KeypadDialog] = None

    def open_locker(self, locker_id: str) -> None:
        print(f"[GPIO SIM] LED ON  → locker {locker_id} open")
        self._door_states[locker_id] = False

        def _auto_close() -> None:
            self._door_states[locker_id] = True
            self.emit_door_closed(locker_id)

        QTimer.singleShot(2000, _auto_close)

    def close_locker(self, locker_id: str) -> None:
        print(f"[GPIO SIM] LED OFF → locker {locker_id} closed")
        self._door_states[locker_id] = True

    def is_door_closed(self, locker_id: str) -> bool:
        return self._door_states.get(locker_id, True)

    def show_keypad(self, parent: Optional[object] = None) -> None:
        dialog_parent = parent if parent is not None else self.parent
        if self._keypad_dialog is None:
            self._keypad_dialog = _KeypadDialog(self, dialog_parent)
        self._keypad_dialog.show()
        self._keypad_dialog.raise_()
        self._keypad_dialog.activateWindow()

    def hide_keypad(self) -> None:
        if self._keypad_dialog is not None:
            self._keypad_dialog.hide()

    @staticmethod
    def is_pi_environment() -> bool:
        return False
