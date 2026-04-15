from __future__ import annotations

from typing import List

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLineEdit, QPushButton

from screens.base_screen import BaseScreen


class OtpInputScreen(BaseScreen):
    uses_keypad = True

    def __init__(self, app, *, flow_type: str) -> None:
        title = "Gửi hàng" if flow_type == "send" else "Nhận hàng"
        super().__init__(app, "OTPInput.ui", title=title, show_back=True)
        self.flow_type = flow_type
        self.digits = self._collect_digits()
        self.btn_confirm = self.find("btnConfirm", QPushButton)

        for digit in self.digits:
            digit.clear()
            digit.setMaxLength(1)
            digit.setAlignment(Qt.AlignCenter)

        if self.btn_confirm is not None:
            self._reg(self.btn_confirm, self._submit)

    def _collect_digits(self) -> List[QLineEdit]:
        digits = []
        for index in range(1, 7):
            digit = self.find(f"digit{index}", QLineEdit)
            if digit is not None:
                digits.append(digit)
        return digits

    def on_enter(self, **kwargs) -> None:
        super().on_enter(**kwargs)
        for digit in self.digits:
            digit.clear()
        if self.digits:
            self.digits[0].setFocus()

    def pin_value(self) -> str:
        return "".join(digit.text().strip() for digit in self.digits)

    def _submit(self) -> None:
        pin = self.pin_value()
        if len(pin) != 6 or not pin.isdigit():
            self.app.show_error("Ma mo tu phai gom 6 chu so.")
            return
        self.app.verify_otp(pin, self.flow_type)

    def handle_keypad_input(self, key: str) -> bool:
        if key.isdigit():
            for digit in self.digits:
                if not digit.text():
                    digit.setText(key)
                    return True
            return True
        if key == "A":
            self._submit()
            return True
        if key == "B":
            for digit in self.digits:
                digit.clear()
            if self.digits:
                self.digits[0].setFocus()
            return True
        if key == "C":
            for digit in reversed(self.digits):
                if digit.text():
                    digit.clear()
                    digit.setFocus()
                    break
            return True
        if key == "D":
            self.app.go_back()
            return True
        return False
