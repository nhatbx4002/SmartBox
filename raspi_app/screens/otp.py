from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QGridLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController, process_events
from screens.inline_error import InlineError
from services.api_client import ApiError


class OtpController(BaseController):
    route = "/otp"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.lines: list[QLineEdit] = [self.child(f"lineOtp{i}", QLineEdit) for i in range(1, 7)]
        for line in self.lines:
            line.setAlignment(Qt.AlignCenter)
        self.title = self.child("labelOtpTitle", QLabel)
        self.confirm_button = self.child("btnConfirm", QPushButton)
        self.error_banner = InlineError(self.child("frameOtpCard"))
        self.error_banner.setGeometry(28, 205, 600, 54)

        self.child("btnBack", QPushButton).clicked.connect(self.go_back)
        self.child("btnBackspace", QPushButton).clicked.connect(self._backspace)
        self.child("btnClear", QPushButton).clicked.connect(self._clear)
        self.confirm_button.clicked.connect(self._submit)

        for digit in range(10):
            self.child(f"btnKey{digit}", QPushButton).clicked.connect(
                lambda _checked=False, value=str(digit): self._append_digit(value)
            )
        for line in self.lines:
            line.textChanged.connect(self._sync_confirm_state)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet("QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }")
        h = QHBoxLayout(header)
        h.setContentsMargins(16, 0, 16, 0)

        btn_back = QPushButton("←", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; } QPushButton:pressed { color: #FF6600; }")

        self.lbl_title = QLabel("", header)
        self.lbl_title.setObjectName("labelOtpTitle")
        self.lbl_title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")

        h.addWidget(btn_back)
        h.addWidget(self.lbl_title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 32, 24, 0)
        body.setAlignment(Qt.AlignTop)

        card = QFrame(root)
        card.setObjectName("frameOtpCard")
        card.setFixedSize(656, 320)
        card.setStyleSheet("QFrame#frameOtpCard { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 24px; }")
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(28, 24, 28, 24)
        card_layout.setSpacing(24)
        card_layout.setAlignment(Qt.AlignCenter)

        otp_row = QHBoxLayout()
        otp_row.setSpacing(12)
        otp_row.setAlignment(Qt.AlignCenter)
        for i in range(1, 7):
            line = QLineEdit(card)
            line.setObjectName(f"lineOtp{i}")
            line.setFixedSize(72, 72)
            line.setMaxLength(1)
            line.setAlignment(Qt.AlignCenter)
            line.setStyleSheet(
                "QLineEdit {"
                "  background-color: #0A0A0A; color: #E8E8E8;"
                "  border: 2px solid #444; border-radius: 12px;"
                "  font-size: 36px; font-weight: 900;"
                "  font-family: 'Be Vietnam Pro', Arial, sans-serif;"
                "}"
                "QLineEdit:focus {"
                "  border: 3px solid #FF6600;"
                "}"
            )
            otp_row.addWidget(line)

        card_layout.addLayout(otp_row)
        self._otp_card = card
        body.addWidget(card, alignment=Qt.AlignTop)

        layout.addLayout(body)

        keypad_area = QVBoxLayout()
        keypad_area.setContentsMargins(24, 0, 24, 0)
        keypad_area.setSpacing(0)

        keypad_grid = QGridLayout()
        keypad_grid.setSpacing(10)
        keys = [
            ("btnKey1", "1"), ("btnKey2", "2"), ("btnKey3", "3"),
            ("btnKey4", "4"), ("btnKey5", "5"), ("btnKey6", "6"),
            ("btnKey7", "7"), ("btnKey8", "8"), ("btnKey9", "9"),
            ("btnClear", "C"), ("btnKey0", "0"), ("btnBackspace", "\u232b"),
        ]
        for idx, (obj_name, text) in enumerate(keys):
            row = idx // 3
            col = idx % 3
            btn = QPushButton(text)
            btn.setObjectName(obj_name)
            btn.setFixedSize(210, 80)
            btn.setCursor(Qt.PointingHandCursor)
            if text in ("C", "\u232b"):
                btn.setStyleSheet(
                    "QPushButton { background-color: #333; color: white; border: none; border-radius: 18px; font-size: 28px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #555; }"
                )
            else:
                btn.setStyleSheet(
                    "QPushButton { background-color: #1C1B1B; color: #E8E8E8; border: 2px solid #333; border-radius: 18px; font-size: 32px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
                    "QPushButton:pressed { background-color: #2A2A2A; border-color: #FF6600; }"
                )
            keypad_grid.addWidget(btn, row, col)

        keypad_area.addLayout(keypad_grid)
        keypad_area.addSpacing(16)

        self.btn_confirm = QPushButton("X\xc1C NH\u1eacN")
        self.btn_confirm.setObjectName("btnConfirm")
        self.btn_confirm.setFixedHeight(80)
        self.btn_confirm.setEnabled(False)
        self.btn_confirm.setCursor(Qt.PointingHandCursor)
        self.btn_confirm.setStyleSheet(
            "QPushButton { background-color: #333; color: #777; border: none; border-radius: 18px; font-size: 24px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:enabled { background-color: #FF6600; color: white; }"
        )
        keypad_area.addWidget(self.btn_confirm)

        layout.addLayout(keypad_area)
        layout.addStretch()

        return root

    def on_enter(self, data: dict | None = None) -> None:
        self._clear()
        mode_title = "Nhập mã gửi đồ" if self.state.mode == "deposit" else "Nhập mã lấy đồ"
        self.title.setText(mode_title)
        self.lines[0].setFocus()

    def _append_digit(self, digit: str) -> None:
        self.error_banner.clear()
        for index, line in enumerate(self.lines):
            if not line.text():
                line.setText(digit)
                if index < len(self.lines) - 1:
                    self.lines[index + 1].setFocus()
                break
        self._sync_confirm_state()

    def _backspace(self) -> None:
        self.error_banner.clear()
        for index in range(len(self.lines) - 1, -1, -1):
            if self.lines[index].text():
                self.lines[index].clear()
                self.lines[index].setFocus()
                break
        self._sync_confirm_state()

    def _clear(self) -> None:
        self.error_banner.clear()
        for line in self.lines:
            line.clear()
        self.confirm_button.setEnabled(False)

    def _otp(self) -> str:
        return "".join(line.text() for line in self.lines)

    def _sync_confirm_state(self) -> None:
        self.confirm_button.setEnabled(len(self._otp()) == 6 and self._otp().isdigit())

    def _submit(self) -> None:
        code = self._otp()
        if len(code) != 6:
            self.error_banner.show_error("Vui lòng nhập đủ 6 chữ số")
            return

        confirm_text = self.confirm_button.text()
        self.confirm_button.setEnabled(False)
        self.confirm_button.setText("ĐANG KIỂM TRA....")
        process_events()
        try:
            rental, compartment = self.api_client.verify_pin(code, self.state.mode)
        except ApiError as error:
            self.confirm_button.setText(confirm_text)
            if error.status_code and 400 <= error.status_code < 500:
                self.error_banner.show_error(error.message)
                self._clear()
                self.lines[0].setFocus()
            else:
                self.show_error_dialog(
                    message=error.message or "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
                    title="LỖI KẾT NỐI",
                    on_retry=self._submit,
                )
            return
        except Exception as error:
            self.confirm_button.setText(confirm_text)
            self.confirm_button.setEnabled(True)
            self.show_error_dialog(
                message=str(error) or "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
                title="LỖI KẾT NỐI",
                on_retry=self._submit,
            )
            return

        self.state.rental_data = rental
        self.state.compartment_data = compartment
        self.navigate("/locker-open")


class OtpPickupController(OtpController):
    route = "/otp-pickup"

    def on_enter(self, data: dict | None = None) -> None:
        self.state.mode = "pickup"
        super().on_enter(data)
