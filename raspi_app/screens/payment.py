from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController, process_events
from screens.inline_error import InlineError
from services.api_client import ApiError
from services.formatters import format_currency


class PaymentController(BaseController):
    route = "/payment"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

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

        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(20, 720, 680, 64)

        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/rent-phone"))
        self.pay_button.clicked.connect(self._pay_now)
        for method, button in self.method_buttons.items():
            button.clicked.connect(lambda _checked=False, value=method: self._select_method(value))

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

        btn_back = QPushButton("\u2190", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; } QPushButton:pressed { color: #FF6600; }")
        h.addWidget(btn_back)

        title = QLabel("THANH TO\xc1N", header)
        title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(32, 32, 32, 0)
        body.setSpacing(16)

        amount_card = QFrame(root)
        amount_card.setFixedHeight(120)
        amount_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #2A2A2A; border-radius: 20px; } QLabel { background: transparent; }")
        a_layout = QVBoxLayout(amount_card)
        a_layout.setAlignment(Qt.AlignCenter)

        lbl_amount_title = QLabel("S\u1ed1 ti\u1ec1n", amount_card)
        lbl_amount_title.setAlignment(Qt.AlignCenter)
        lbl_amount_title.setStyleSheet("border: none; color: #888; font-size: 18px; font-weight: 500;")

        self.lbl_amount = QLabel("0\u20ab", amount_card)
        self.lbl_amount.setObjectName("lblAmount")
        self.lbl_amount.setAlignment(Qt.AlignCenter)
        self.lbl_amount.setStyleSheet("border: none; color: #FF6600; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 48px; font-weight: 900;")

        a_layout.addWidget(lbl_amount_title)
        a_layout.addWidget(self.lbl_amount)
        body.addWidget(amount_card)

        self.lbl_plan = QLabel("", root)
        self.lbl_plan.setObjectName("lblPlanInfo")
        self.lbl_plan.setAlignment(Qt.AlignCenter)
        self.lbl_plan.setStyleSheet("background: transparent; border: none; color: #B0B0B0; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 600;")
        body.addWidget(self.lbl_plan)

        methods_title = QLabel("Ch\u1ecdn ph\u01b0\u01a1ng th\u1ee9c thanh to\xe1n", root)
        methods_title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 700;")
        body.addWidget(methods_title)

        methods_row = QHBoxLayout()
        methods_row.setSpacing(12)
        for name, label_text, color in [
            ("btnPaymentPayOS", "PayOS", "#FF6600"),
            ("btnPaymentZalo", "ZaloPay", "#0068FF"),
            ("btnPaymentVietQR", "VietQR", "#E60000"),
        ]:
            btn = QPushButton(label_text)
            btn.setObjectName(name)
            btn.setFixedSize(200, 100)
            btn.setCursor(Qt.PointingHandCursor)
            btn.setCheckable(True)
            btn.setStyleSheet(
                f"QPushButton {{ background-color: #1C1B1B; color: #E8E8E8; border: 3px solid #2A2A2A; border-radius: 18px; font-size: 20px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }}"
                f"QPushButton:checked {{ background-color: #2E7D32; color: white; border: 3px solid {color}; }}"
            )
            methods_row.addWidget(btn)
        body.addLayout(methods_row)

        body.addStretch()

        self.btn_pay = QPushButton("THANH TO\xc1N NGAY")
        self.btn_pay.setObjectName("btnPayNow")
        self.btn_pay.setFixedHeight(88)
        self.btn_pay.setCursor(Qt.PointingHandCursor)
        self.btn_pay.setStyleSheet(
            "QPushButton { background-color: #FF6600; color: white; border: none; border-radius: 18px; font-size: 24px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:disabled { background-color: #333; color: #777; }"
        )
        body.addWidget(self.btn_pay)

        layout.addLayout(body)
        return root

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
            button.setChecked(selected)
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
                self._show_payment_error_dialog(error.message or "Không thể tạo đơn thuê. Vui lòng thử lại.")
            return
        except Exception as error:
            self._show_payment_error_dialog(str(error) or "Không thể kết nối đến máy chủ. Vui lòng thử lại.")
            return

        self.state.rental_data = rental
        self.state.compartment_data = compartment

        try:
            payment = self.api_client.create_payment(rental.id, source="KIOSK")
            self.state.payment_order_code = payment["orderCode"]
            self.state.payment_qr_string = payment["qrCode"]
            self.state.payment_amount = payment.get("amount")
            self.state.payment_expires_at = payment.get("expiresAt")
            self.navigate("/qr-payment")
        except ApiError as error:
            self._show_payment_error_dialog(error.message or "Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.")
        except Exception as error:
            self._show_payment_error_dialog(str(error) or "Không thể kết nối đến máy chủ để tạo thanh toán. Vui lòng thử lại.")

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
