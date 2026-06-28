from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QFrame, QGridLayout, QHBoxLayout, QLabel,
    QLineEdit, QPushButton, QVBoxLayout, QWidget,
)

from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar
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
        self.error_banner.setGeometry(40, 440, 640, 60)

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
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = HeaderBar(
            "Nhập số điện thoại",
            on_back=lambda: self.navigate("/rent-plan"),
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)

        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(40, 88, 40, 0)
        body.setSpacing(18)
        body.setAlignment(Qt.AlignTop)

        # Input frame
        input_frame = QFrame(root)
        input_frame.setObjectName("phoneInputFrame")
        input_frame.setFixedHeight(118)
        input_frame.setStyleSheet(
            "QFrame#phoneInputFrame { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 22px; }"
        )
        i_layout = QVBoxLayout(input_frame)
        i_layout.setAlignment(Qt.AlignCenter)
        i_layout.setContentsMargins(16, 0, 16, 0)

        self.line_input = QLineEdit(input_frame)
        self.line_input.setObjectName("lineEdit")
        self.line_input.setAlignment(Qt.AlignCenter)
        self.line_input.setMaxLength(10)
        self.line_input.setStyleSheet(
            "QLineEdit { background: transparent; border: none; color: #E8E8E8;"
            " font-size: 58px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
        )
        i_layout.addWidget(self.line_input)
        body.addWidget(input_frame)

        # Keypad grid
        keypad_grid = QGridLayout()
        keypad_grid.setHorizontalSpacing(18)
        keypad_grid.setVerticalSpacing(16)

        keys = [
            ("btnNum1", "1"), ("btnKey2", "2"), ("btnKey3", "3"),
            ("btnKey4", "4"), ("btnKey5", "5"), ("btnKey6", "6"),
            ("btnKey7", "7"), ("btnKey8", "8"), ("btnKey9", "9"),
            ("btnClear", "C"), ("btnKey0", "0"), ("btnBackspace", "⌫"),
        ]

        btn_w = 200
        btn_h = 96
        for idx, (obj_name, text) in enumerate(keys):
            row = idx // 3
            col = idx % 3
            btn = QPushButton(text)
            btn.setObjectName(obj_name)
            btn.setFixedSize(btn_w, btn_h)
            btn.setCursor(Qt.PointingHandCursor)
            if text in ("C", "⌫"):
                btn.setStyleSheet(
                    "QPushButton { background-color: #333; color: white; border: none;"
                    " border-radius: 20px; font-size: 28px; font-weight: 700;"
                    " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #555; }"
                )
            else:
                btn.setStyleSheet(
                    "QPushButton { background-color: #1C1B1B; color: #E8E8E8; border: 2px solid #333;"
                    " border-radius: 20px; font-size: 34px; font-weight: 700;"
                    " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #2A2A2A; border-color: #2E7D32; }"
                )
            keypad_grid.addWidget(btn, row, col)

        body.addLayout(keypad_grid)
        body.addSpacing(18)

        btn_confirm = QPushButton("XÁC NHẬN")
        btn_confirm.setObjectName("btnConfirm")
        btn_confirm.setFixedHeight(96)
        btn_confirm.setCursor(Qt.PointingHandCursor)
        btn_confirm.setStyleSheet(
            "QPushButton { background-color: #333333; color: #8A8A8A; border: none;"
            " border-radius: 24px; font-size: 26px; font-weight: 900;"
            " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:enabled { background-color: #2E7D32; color: white; }"
            "QPushButton:pressed:enabled { background-color: #256428; }"
        )
        body.addWidget(btn_confirm)
        body.addSpacing(68)

        layout.addLayout(body)
        layout.addStretch(1)
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
