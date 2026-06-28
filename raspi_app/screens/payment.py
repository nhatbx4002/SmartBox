from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLabel, QPushButton, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar
from screens.components.buttons import PrimaryButton
from screens.components.bottom_action_bar import BottomActionBar
from screens.components.amount_card import AmountCard
from screens.base import BaseController, process_events
from screens.inline_error import InlineError
from services.api_client import ApiError
from services.formatters import format_currency


class PaymentController(BaseController):
    route = "/payment"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.amount_card = self.child("amountCard", AmountCard)
        self.plan_info_label = self.child("lblPlanInfo", QLabel)
        self.pay_button = self.child("btnPayNow", QPushButton)
        self.pay_button_text = self.pay_button.text()
        self.payos_card = self.child("btnPaymentPayOS", QPushButton)

        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(40, 860, 640, 64)

        self.pay_button.clicked.connect(self._pay_now)
        self.state.payment_method = "PAYOS"
        self.payos_card.setChecked(True)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = HeaderBar(
            "THANH TOÁN",
            on_back=lambda: self.navigate("/rent-phone"),
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)
        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(32, 36, 32, 32)
        body.setSpacing(24)

        amount_card = AmountCard(
            title="Số tiền thanh toán",
            amount="0đ",
            parent=root,
            height=200,
            radius=24,
            amount_font_size=80,
        )
        body.addWidget(amount_card)

        # Thông tin gói
        self.lbl_plan = QLabel("", root)
        self.lbl_plan.setObjectName("lblPlanInfo")
        self.lbl_plan.setAlignment(Qt.AlignCenter)
        self.lbl_plan.setStyleSheet(
            "background: transparent; border: none; color: #B0B0B0;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 600;"
        )
        body.addWidget(self.lbl_plan)

        # Tiêu đề phương thức
        methods_title = QLabel("Phương thức thanh toán", root)
        methods_title.setAlignment(Qt.AlignCenter)
        methods_title.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 800;"
        )
        body.addWidget(methods_title)

        # Card PayOS duy nhất — lớn, rõ ràng
        payos_card = QPushButton("PayOS", root)
        payos_card.setObjectName("btnPaymentPayOS")
        payos_card.setFixedHeight(180)
        payos_card.setCursor(Qt.PointingHandCursor)
        payos_card.setCheckable(True)
        payos_card.setChecked(True)
        payos_card.setStyleSheet(
            "QPushButton {"
            "  background-color: #1C1B1B; color: #FFFFFF;"
            "  border: 3px solid #FF6600; border-radius: 28px;"
            "  font-size: 40px; font-weight: 900;"
            "  font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "}"
            "QPushButton:pressed { background-color: #232323; }"
        )
        body.addWidget(payos_card)

        # Gợi ý hướng dẫn
        payos_hint = QLabel("Quét mã QR PayOS ở bước tiếp theo để hoàn tất thanh toán", root)
        payos_hint.setAlignment(Qt.AlignCenter)
        payos_hint.setWordWrap(True)
        payos_hint.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500;"
        )
        body.addWidget(payos_hint)
        body.addStretch(1)

        # CTA button
        self.btn_pay = PrimaryButton(
            "THANH TOÁN NGAY",
            object_name="btnPayNow",
            color="orange",
        )
        body.addWidget(BottomActionBar(self.btn_pay))

        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_plan:
            self.navigate("/rent-plan", replace=True)
            return

        self.error_banner.clear()
        self.amount_card.set_amount(format_currency(self.state.selected_plan.price))
        size_text = "Size 1" if self.state.selected_size == "SMALL" else "Size 2"
        self.plan_info_label.setText(f"{size_text} – {self.state.selected_plan.name}")
        self.pay_button.setText(self.pay_button_text)
        self._apply_selection()

    def _apply_selection(self) -> None:
        self.state.payment_method = "PAYOS"
        self.payos_card.setChecked(True)
        self.pay_button.setEnabled(True)

    def _pay_now(self) -> None:
        self.error_banner.clear()
        self.state.payment_method = "PAYOS"
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
            self._show_payment_error_dialog(str(error) or "Không thể kết nối để tạo thanh toán. Vui lòng thử lại.")

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
