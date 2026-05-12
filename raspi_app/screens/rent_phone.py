from __future__ import annotations

from PySide6.QtWidgets import QLineEdit, QPushButton

from screens.base import BaseController
from services.formatters import is_valid_local_phone, normalize_vn_phone


class RentPhoneController(BaseController):
    route = "/rent-phone"

    def __init__(self, app):
        super().__init__(app, self.route, "PhoneNumberInput.ui")
        self.input = self.child("lineEdit", QLineEdit)
        self.confirm_button = self.child("btnConfirm", QPushButton)

        self.child("btnBackMain", QPushButton).clicked.connect(lambda: self.navigate("/rent-plan"))
        self.child("btnBackspace", QPushButton).clicked.connect(self._backspace)
        self.child("btnClear", QPushButton).clicked.connect(self._clear)
        self.confirm_button.clicked.connect(self._confirm)
        self.input.textChanged.connect(self._sync_confirm_state)

        digit_buttons = {"btnNum1": "1", "btnKey0": "0"}
        digit_buttons.update({f"btnKey{digit}": str(digit) for digit in range(2, 10)})
        for name, digit in digit_buttons.items():
            self.child(name, QPushButton).clicked.connect(
                lambda _checked=False, value=digit: self._append_digit(value)
            )

    def on_enter(self, data: dict | None = None) -> None:
        self.input.setText("")
        self._sync_confirm_state()
        self.input.setFocus()

    def _append_digit(self, digit: str) -> None:
        text = self.input.text()
        if len(text) < 9:
            self.input.setText(text + digit)

    def _backspace(self) -> None:
        self.input.setText(self.input.text()[:-1])

    def _clear(self) -> None:
        self.input.clear()

    def _sync_confirm_state(self) -> None:
        self.confirm_button.setEnabled(is_valid_local_phone(self.input.text()))

    def _confirm(self) -> None:
        text = self.input.text()
        if not is_valid_local_phone(text):
            self.confirm_button.setEnabled(False)
            return
        self.state.phone = normalize_vn_phone(text)
        self.navigate("/payment")
