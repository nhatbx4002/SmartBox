from __future__ import annotations

from PySide6.QtWidgets import QLabel, QLineEdit, QPushButton

from screens.base import BaseController
from screens.inline_error import InlineError
from services.api_client import ApiError


class OtpController(BaseController):
    route = "/otp"

    def __init__(self, app):
        super().__init__(app, self.route, "OTPInput.ui")
        self.lines: list[QLineEdit] = [self.child(f"lineOtp{i}", QLineEdit) for i in range(1, 7)]
        self.title = self.child("labelOtpTitle", QLabel)
        self.confirm_button = self.child("btnConfirm", QPushButton)

        # Embedded inline error banner inside frameOtpCard
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

    def on_enter(self, data: dict | None = None) -> None:
        self._clear()
        mode_title = "Nhập mã gửi đồ" if self.state.mode == "deposit" else "Nhập mã nhận đồ"
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

        try:
            rental, compartment = self.api_client.verify_pin(code, self.state.mode)
        except ApiError as error:
            if error.status_code and 400 <= error.status_code < 500:
                self.error_banner.show_error(error.message)
                self._clear()
                self.lines[0].setFocus()
            else:
                self.show_error_dialog(
                    message=error.message or "Lỗi kết nối máy chủ",
                    title="LỖI MÁY CHỦ",
                    on_retry=self._submit,
                )
            return
        except Exception as error:
            self.show_error_dialog(
                message=str(error) or "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.",
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
