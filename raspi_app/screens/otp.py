from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QGridLayout, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController


class OtpController(BaseController):
    route = "/otp"

    def __init__(self, app):
        widget = self._build_ui("NHẬP MÃ OTP")
        super().__init__(app, self.route, widget=widget)

        self.code = ""
        self.code_label = self.child("lblCode", QLabel)

        self.child("btnBack", QPushButton).clicked.connect(self.go_back)
        self.child("btnClear", QPushButton).clicked.connect(self._clear)
        self.child("btnBackspace", QPushButton).clicked.connect(self._backspace)
        self.child("btnConfirm", QPushButton).clicked.connect(self._confirm)

        for digit in range(10):
            self.child(f"btnKey{digit}", QPushButton).clicked.connect(
                lambda _checked=False, value=str(digit): self._append_digit(value)
            )

    def _build_ui(self, title_text: str) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setFixedHeight(80)
        header.setStyleSheet(
            "background-color: #0A0A0A; border: none; border-bottom: 1px solid #222;"
        )

        h = QHBoxLayout(header)
        h.setContentsMargins(16, 0, 16, 0)

        btn_back = QPushButton("←", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet(
            "QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; }"
            "QPushButton:pressed { color: #FF6600; }"
        )

        title = QLabel(title_text, header)
        title.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;"
        )

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(40, 120, 40, 0)
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

        keypad = QGridLayout()
        keypad.setHorizontalSpacing(18)
        keypad.setVerticalSpacing(16)

        keys = [
            ("btnKey1", "1"), ("btnKey2", "2"), ("btnKey3", "3"),
            ("btnKey4", "4"), ("btnKey5", "5"), ("btnKey6", "6"),
            ("btnKey7", "7"), ("btnKey8", "8"), ("btnKey9", "9"),
            ("btnClear", "C"), ("btnKey0", "0"), ("btnBackspace", "⌫"),
        ]

        for idx, (name, text) in enumerate(keys):
            btn = QPushButton(text)
            btn.setObjectName(name)
            btn.setFixedSize(200, 96)
            btn.setCursor(Qt.PointingHandCursor)
            btn.setStyleSheet(
                "QPushButton { background-color: #1C1B1B; color: #E8E8E8;"
                " border: 2px solid #333; border-radius: 20px;"
                " font-size: 34px; font-weight: 800;"
                " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                "QPushButton:pressed { background-color: #2A2A2A; border-color: #FF6600; }"
            )
            keypad.addWidget(btn, idx // 3, idx % 3)

        body.addLayout(keypad)
        body.addSpacing(20)

        btn_confirm = QPushButton("XÁC NHẬN", root)
        btn_confirm.setObjectName("btnConfirm")
        btn_confirm.setFixedHeight(96)
        btn_confirm.setCursor(Qt.PointingHandCursor)
        btn_confirm.setStyleSheet(
            "QPushButton { background-color: #FF6600; color: white; border: none;"
            " border-radius: 24px; font-size: 26px; font-weight: 900;"
            " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:pressed { background-color: #E65C00; }"
        )
        body.addWidget(btn_confirm)

        layout.addLayout(body)
        layout.addStretch()
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