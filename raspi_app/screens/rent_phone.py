from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QGridLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
from screens.inline_error import InlineError
from services.formatters import is_valid_local_phone, normalize_vn_phone


class RentPhoneController(BaseController):
    route = "/rent-phone"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.input = self.child("lineEdit", QLineEdit)
        self.input.setAlignment(Qt.AlignCenter)
        self.confirm_button = self.child("btnConfirm", QPushButton)

        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(90, 410, 540, 60)

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

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 72)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet("QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }")
        h = QHBoxLayout4(header, 16, 0, 16, 0)

        btn_back = QPushButton("\u2190", header)
        btn_back.setObjectName("btnBackMain")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; } QPushButton:pressed { color: #FF6600; }")

        title = QLabel("SỐ ĐIỆN THOẠI", header)
        title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(42, 48, 42, 0)
        body.setSpacing(18)

        input_frame = QFrame(root)
        input_frame.setObjectName("phoneInputFrame")
        input_frame.setFixedHeight(96)
        input_frame.setStyleSheet("QFrame#phoneInputFrame { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 18px; }")
        i_layout = QVBoxLayout(input_frame)
        i_layout.setAlignment(Qt.AlignCenter)

        self.line_input = QLineEdit(input_frame)
        self.line_input.setObjectName("lineEdit")
        self.line_input.setAlignment(Qt.AlignCenter)
        self.line_input.setMaxLength(10)
        self.line_input.setStyleSheet(
            "QLineEdit { background: transparent; border: none; color: #E8E8E8; font-size: 42px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
        )
        i_layout.addWidget(self.line_input)
        body.addWidget(input_frame)

        keypad_grid = QGridLayout()
        keypad_grid.setHorizontalSpacing(18)
        keypad_grid.setVerticalSpacing(14)

        keys = [
            ("btnNum1", "1"), ("btnKey2", "2"), ("btnKey3", "3"),
            ("btnKey4", "4"), ("btnKey5", "5"), ("btnKey6", "6"),
            ("btnKey7", "7"), ("btnKey8", "8"), ("btnKey9", "9"),
            ("btnClear", "C"), ("btnKey0", "0"), ("btnBackspace", "\u232b"),
        ]

        for idx, (obj_name, text) in enumerate(keys):
            row = idx // 3
            col = idx % 3
            btn = QPushButton(text)
            btn.setObjectName(obj_name)
            btn.setFixedSize(196, 88)
            btn.setCursor(Qt.PointingHandCursor)
            if text in ("C","⌫"):
                btn.setStyleSheet(
                    "QPushButton { background-color: #333; color: white; border: none; border-radius: 18px; font-size: 28px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #555; }"
                )
            else:
                btn.setStyleSheet(
                    "QPushButton { background-color: #1C1B1B; color: #E8E8E8; border: 2px solid #333; border-radius: 18px; font-size: 32px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #2A2A2A; border-color: #2E7D32; }"
                )
            keypad_grid.addWidget(btn, row, col)

        body.addLayout(keypad_grid)
        body.addSpacing(16)

        self.btn_confirm = QPushButton("XÁC NHẬN")
        self.btn_confirm.setObjectName("btnConfirm")
        self.btn_confirm.setFixedHeight(96)
        self.btn_confirm.setCursor(Qt.PointingHandCursor)
        self.btn_confirm.setStyleSheet(
            "QPushButton { background-color: #333; color: #777; border: none; border-radius: 18px; font-size: 24px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:enabled { background-color: #2E7D32; color: white; }"
        )
        body.addWidget(self.btn_confirm)

        layout.addLayout(body)
        layout.addStretch()
        return root

    def on_enter(self, data: dict | None = None) -> None:
        self.input.setText("")
        self.error_banner.clear()
        self._sync_confirm_state()
        self.input.setFocus()

        if hasattr(self, "_position_footer"):
            self._position_footer()

    def _append_digit(self, digit: str) -> None:
        self.error_banner.clear()
        text = self.input.text()
        if len(text) < 10:
            self.input.setText(text + digit)

    def _backspace(self) -> None:
        self.error_banner.clear()
        self.input.setText(self.input.text()[:-1])

    def _clear(self) -> None:
        self.error_banner.clear()
        self.input.clear()

    def _sync_confirm_state(self) -> None:
        self.confirm_button.setEnabled(len(self.input.text()) > 0)

    def _confirm(self) -> None:
        text = self.input.text()
        if not is_valid_local_phone(text):
            self.error_banner.show_error("Số điện thoại không hợp lệ")
            return
        self.state.phone = normalize_vn_phone(text)
        self.navigate("/payment")


def QHBoxLayout4(parent, left, top, right, bottom):
    from PySide6.QtWidgets import QHBoxLayout
    l = QHBoxLayout(parent)
    l.setContentsMargins(left, top, right, bottom)
    return l
