from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QVBoxLayout, QWidget
from screens.components.buttons import PrimaryButton
from screens.components.numeric_keypad import NumericKeypad
from screens.components.bottom_action_bar import BottomActionBar
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar

from screens.base import BaseController


class OtpController(BaseController):
    route = "/otp"

    def __init__(self, app):
        widget = self._build_ui("NHẬP MÃ OTP")
        super().__init__(app, self.route, widget=widget)

        self.code = ""
        self.code_label = self.child("lblCode", QLabel)

        keypad = self.child("numericKeypad", NumericKeypad)
        keypad.digit_pressed.connect(self._append_digit)
        keypad.clear_pressed.connect(self._clear)
        keypad.backspace_pressed.connect(self._backspace)

        self.child("btnConfirm", QPushButton).clicked.connect(self._confirm)

    def _build_ui(self, title_text: str) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = HeaderBar(
            "Nhập mẫ PIN",
            on_back=lambda: self.go_back(),
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(40, 120, 40, 32)
        body.setSpacing(28)

        instruction = QLabel("Vui lòng nhập mã xác thực", root)
        instruction.setAlignment(Qt.AlignCenter)
        instruction.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 600;"
        )
        body.addWidget(instruction)

        code_card = QFrame(root)
        code_card.setFixedHeight(120)
        code_card.setStyleSheet(
            "QFrame { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 24px; }"
            "QLabel { background: transparent; border: none; }"
        )

        code_layout = QVBoxLayout(code_card)
        code_layout.setAlignment(Qt.AlignCenter)

        lbl_code = QLabel("------", code_card)
        lbl_code.setObjectName("lblCode")
        lbl_code.setAlignment(Qt.AlignCenter)
        lbl_code.setStyleSheet(
            "color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 52px; font-weight: 900; letter-spacing: 8px;"
        )
        code_layout.addWidget(lbl_code)
        body.addWidget(code_card)

        keypad = NumericKeypad(parent=root)
        body.addWidget(keypad)
        body.addStretch(1)

        btn_confirm = PrimaryButton("XÁC NHẬN", object_name="btnConfirm", parent=root, color="orange")
        body.addWidget(BottomActionBar(btn_confirm))

        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self.code = ""
        self._render_code()

    def _append_digit(self, digit: str) -> None:
        if len(self.code) < 6:
            self.code += digit
            self._render_code()

    def _backspace(self) -> None:
        self.code = self.code[:-1]
        self._render_code()

    def _clear(self) -> None:
        self.code = ""
        self._render_code()

    def _render_code(self) -> None:
        visible = self.code + "-" * (6 - len(self.code))
        self.code_label.setText(visible)

    def _confirm(self) -> None:

        if len(self.code) < 4:
            return
        self.navigate("/payment")


class OtpPickupController(OtpController):
    route = "/otp-pickup"

    def _confirm(self) -> None:
        # TODO: nối lại API verify OTP pickup nếu đang dùng.
        if len(self.code) < 4:
            return
        self.navigate("/locker-open")