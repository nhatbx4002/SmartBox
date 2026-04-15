from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLineEdit, QPushButton

from screens.base_screen import BaseScreen


class PhoneInputScreen(BaseScreen):
    uses_keypad = True

    def __init__(self, app) -> None:
        super().__init__(app, "PhoneInput.ui", title="", show_back=True)
        self.input_phone = self.find("input", QLineEdit)
        self.btn_confirm = self.find("btnConfirm", QPushButton)

        if self.input_phone is not None:
            self.input_phone.setPlaceholderText("Nhập số điện thoại")
            self.input_phone.setMaxLength(11)
            self.input_phone.setAlignment(Qt.AlignLeft | Qt.AlignVCenter)

        if self.btn_confirm is not None:
            self._reg(self.btn_confirm, self._submit)

    def on_enter(self, **kwargs) -> None:
        super().on_enter(**kwargs)
        if self.input_phone is not None:
            self.input_phone.setText(self.app.state.phone_number)
            self.input_phone.setFocus()

    def _submit(self) -> None:
        phone = self.input_phone.text().strip() if self.input_phone is not None else ""
        if not phone.isdigit() or len(phone) < 9:
            self.app.show_error("So dien thoai khong hop le.")
            return
        self.app.state.phone_number = phone
        self.app.create_rental(phone)

    def handle_keypad_input(self, key: str) -> bool:
        if self.input_phone is None:
            return False
        current = self.input_phone.text()
        if key.isdigit() and len(current) < self.input_phone.maxLength():
            self.input_phone.setText(current + key)
            return True
        if key == "A":
            self._submit()
            return True
        if key == "B":
            self.input_phone.clear()
            return True
        if key == "C":
            self.input_phone.setText(current[:-1])
            return True
        if key == "D":
            self.app.go_back()
            return True
        return False
