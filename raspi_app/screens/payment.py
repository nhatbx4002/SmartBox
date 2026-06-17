from __future__ import annotations

from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController, process_events
from screens.inline_error import InlineError
from services.api_client import ApiError
from services.formatters import format_currency


class PaymentController(BaseController):
    route = "/payment"

    def __init__(self, app):
        super().__init__(app, self.route, "Payment.ui")
        self.amount_label = self.child("lblAmount", QLabel)
        self.plan_info_label = self.child("lblPlanInfo", QLabel)
        self.pay_button = self.child("btnPayNow", QPushButton)
        self.pay_button_text = self.pay_button.text()
        self.method_buttons: dict[str, QPushButton] = {
            "PAYOS": self.child("btnPaymentPayOS", QPushButton),
            "ZALOPAY": self.child("btnPaymentZalo", QPushButton),
            "VIETQR": self.child("btnPaymentVietQR", QPushButton),
        }
        self.button_styles = {method: button.styleSheet() for method, button in self.method_buttons.items()}

        # Embedded inline error banner placed in the empty space below payment options
        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(20, 720, 680, 64)

        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/rent-phone"))
        self.pay_button.clicked.connect(self._pay_now)
        for method, button in self.method_buttons.items():
            button.clicked.connect(lambda _checked=False, value=method: self._select_method(value))

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_plan:
            self.navigate("/rent-plan", replace=True)
            return

        self.error_banner.clear()
        self.amount_label.setText(format_currency(self.state.selected_plan.price))
        size_text = "Size 1" if self.state.selected_size == "SMALL" else "Size 2"
        self.plan_info_label.setText(f"{size_text} - {self.state.selected_plan.name}")
        self.pay_button.setText(self.pay_button_text)
        self._apply_selection()

    def _select_method(self, method: str) -> None:
        self.error_banner.clear()
        self.state.payment_method = method
        self._apply_selection()

    def _apply_selection(self) -> None:
        for method, button in self.method_buttons.items():
            selected = self.state.payment_method == method
            style = self.button_styles[method]
            if selected:
                style += "\nbackground-color: #2E7D32; color: white; border: 3px solid #FF6600;"
            button.setStyleSheet(style)
        # Always keep pay button enabled so user can click and receive validation feedback
        self.pay_button.setEnabled(True)

    def _pay_now(self) -> None:
        self.error_banner.clear()
        if not self.state.payment_method:
            self.error_banner.show_error("Chưa chọn phương thức thanh toán")
            return
        if not self.state.selected_plan:
            return

        self.pay_button.setEnabled(False)
        self.pay_button.setText("ĐANG XỬ LÝ...")
        process_events()
        try:
            rental, compartment = self.api_client.create_rental(
                phone=self.state.phone,
                size=self.state.selected_size,
                plan_id=self.state.selected_plan.id,
                payment_method=self.state.payment_method,
                cabinet_id=getattr(self.app, "cabinet_id", None),
            )
            self.hide_error_dialog()
        except ApiError as error:
            if error.status_code and 400 <= error.status_code < 500:
                self._show_payment_error(error.message)
            else:
                self._show_payment_error_dialog(error.message or "Lỗi hệ thống khi tạo đơn thuê.")
            return
        except Exception as error:
            self._show_payment_error_dialog(str(error) or "Không thể kết nối đến máy chủ.")
            return

        self.state.rental_data = rental
        self.state.compartment_data = compartment

        # NEW: create PayOS payment link
        try:
            payment = self.api_client.create_payment(rental.id, source="KIOSK")
            self.state.payment_order_code = payment["orderCode"]
            self.state.payment_qr_string = payment["qrCode"]
            self.state.payment_amount = payment.get("amount")
            self.state.payment_expires_at = payment.get("expiresAt")
            self.navigate("/qr-payment")
        except ApiError as error:
            self._show_payment_error_dialog(error.message or "Không thể tạo thanh toán.")
        except Exception as error:
            self._show_payment_error_dialog(str(error) or "Lỗi kết nối khi tạo thanh toán.")

    def _show_payment_error(self, message: str) -> None:
        self.error_banner.show_error(message)
        self.pay_button.setText(self.pay_button_text)
        self.pay_button.setEnabled(True)

    def _show_payment_error_dialog(self, message: str) -> None:
        self.pay_button.setText(self.pay_button_text)
        self.pay_button.setEnabled(True)
        self.show_error_dialog(
            message=message,
            title="LỖI GIAO DỊCH",
            on_retry=self._pay_now,
        )

