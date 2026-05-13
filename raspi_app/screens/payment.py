from __future__ import annotations

from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.formatters import format_currency


class PaymentController(BaseController):
    route = "/payment"

    def __init__(self, app):
        super().__init__(app, self.route, "Payment.ui")
        self.amount_label = self.child("lblAmount", QLabel)
        self.plan_info_label = self.child("lblPlanInfo", QLabel)
        self.pay_button = self.child("btnPayNow", QPushButton)
        self.method_buttons: dict[str, QPushButton] = {
            "MOMO": self.child("btnPaymentMomo", QPushButton),
            "ZALOPAY": self.child("btnPaymentZalo", QPushButton),
            "VIETQR": self.child("btnPaymentVietQR", QPushButton),
        }
        self.button_styles = {method: button.styleSheet() for method, button in self.method_buttons.items()}

        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/rent-phone"))
        self.pay_button.clicked.connect(self._pay_now)
        for method, button in self.method_buttons.items():
            button.clicked.connect(lambda _checked=False, value=method: self._select_method(value))

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_plan:
            self.navigate("/rent-plan", replace=True)
            return

        self.amount_label.setText(format_currency(self.state.selected_plan.price))
        size_text = "Size 1" if self.state.selected_size == "SMALL" else "Size 2"
        self.plan_info_label.setText(f"{size_text} - {self.state.selected_plan.name}")
        self._apply_selection()

    def _select_method(self, method: str) -> None:
        self.state.payment_method = method
        self._apply_selection()

    def _apply_selection(self) -> None:
        for method, button in self.method_buttons.items():
            selected = self.state.payment_method == method
            style = self.button_styles[method]
            if selected:
                style += "\nbackground-color: #2E7D32; color: white; border: 3px solid #FF6600;"
            button.setStyleSheet(style)
        self.pay_button.setEnabled(self.state.payment_method is not None)

    def _pay_now(self) -> None:
        if not self.state.selected_plan or not self.state.payment_method:
            return
        rental, compartment = self.api_client.create_rental(
            phone=self.state.phone,
            size=self.state.selected_size,
            plan_id=self.state.selected_plan.id,
            payment_method=self.state.payment_method,
            cabinet_id=getattr(self.app, "cabinet_id", None),
        )
        self.state.rental_data = rental
        self.state.compartment_data = compartment
        self.navigate("/rent-success")
