from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLineEdit, QPushButton, QVBoxLayout, QWidget

from screens.components.bottom_action_bar import BottomActionBar
from screens.components.buttons import PrimaryButton
from screens.components.numeric_keypad import NumericKeypad
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

        keypad = self.child("numericKeypad", NumericKeypad)
        keypad.digit_pressed.connect(self._append_digit)
        keypad.clear_pressed.connect(self._clear)
        keypad.backspace_pressed.connect(self._backspace)

        self.confirm_button.clicked.connect(self._confirm)
        self.input.textChanged.connect(self._sync_confirm_state)

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
        body.setContentsMargins(40, 48, 40, 0)
        body.setSpacing(24)

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

        keypad = NumericKeypad(
            parent=root,
            button_width=200,
            button_height=120,
            h_spacing=18,
            v_spacing=16,
        )
        body.addWidget(keypad)

        body.addSpacing(24)

        btn_confirm = PrimaryButton(
            "XÁC NHẬN",
            object_name="btnConfirm",
            color="green",
        )
        btn_confirm.setEnabled(False)
        body.addWidget(BottomActionBar(btn_confirm))

        layout.addLayout(body, 1)
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
