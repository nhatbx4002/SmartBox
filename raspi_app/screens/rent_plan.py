from __future__ import annotations

from PySide6.QtWidgets import QLabel, QPushButton, QWidget

from screens.base import BaseController
from services.app_state import Plan
from services.formatters import format_currency


class RentPlanController(BaseController):
    route = "/rent-plan"

    def __init__(self, app):
        super().__init__(app, self.route, "RentPlan.ui")
        self.selected_size_label = self.child("lblSelectedSize", QLabel)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.cards: dict[str, QWidget] = {
            "single": self.child("cardPlanSingle", QWidget),
            "multi": self.child("cardPlanMulti", QWidget),
            "monthly": self.child("cardPlanMonthly", QWidget),
        }
        self.groups: dict[str, list[str]] = {
            "single": ["single-1-day", "single-7-days"],
            "multi": ["multi-5-30", "multi-10-90"],
            "monthly": ["month-1", "month-3", "month-6"],
        }
        self.plan_buttons: dict[str, QPushButton] = {
            "single-1-day": self.child("btnSingle1Day", QPushButton),
            "single-7-days": self.child("btnSingle7Days", QPushButton),
            "multi-5-30": self.child("btnMulti5_30", QPushButton),
            "multi-10-90": self.child("btnMulti10_90", QPushButton),
            "month-1": self.child("btnMonth1", QPushButton),
            "month-3": self.child("btnMonth3", QPushButton),
            "month-6": self.child("btnMonth6", QPushButton),
        }
        self.button_styles = {plan_id: button.styleSheet() for plan_id, button in self.plan_buttons.items()}
        self.plans_by_id: dict[str, Plan] = {}
        self.child("btnBackMain", QPushButton).clicked.connect(lambda: self.navigate("/rent-size"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-phone"))
        for plan_id, button in self.plan_buttons.items():
            button.setCheckable(True)
            button.clicked.connect(lambda _checked=False, value=plan_id: self._select_plan(value))

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_size:
            self.navigate("/rent-size", replace=True)
            return

        size_text = "Size 1 (Nhỏ)" if self.state.selected_size == "SMALL" else "Size 2 (Lớn)"
        self.selected_size_label.setText(f"Bạn đã chọn {size_text}")
        self._load_plans()
        self._apply_group_layout()
        self._apply_selection()

    def _load_plans(self) -> None:
        plans = self.api_client.get_plans(self.state.selected_size)
        self.plans_by_id = {plan.id: plan for plan in plans}
        for plan_id, button in self.plan_buttons.items():
            plan = self.plans_by_id.get(plan_id)
            if plan is None:
                button.setEnabled(False)
                continue
            button.setEnabled(True)
            button.setText(f"{plan.name}\n{format_currency(plan.price)}")

    def _select_plan(self, plan_id: str) -> None:
        plan = self.plans_by_id.get(plan_id)
        if plan is None:
            return
        self.state.selected_plan = plan
        self.state.phone = None
        self.state.payment_method = None
        self.state.rental_data = None
        self.state.compartment_data = None
        self._apply_group_layout()
        self._apply_selection()

    def _apply_selection(self) -> None:
        selected_id = self.state.selected_plan.id if self.state.selected_plan else None
        for plan_id, button in self.plan_buttons.items():
            selected = plan_id == selected_id
            button.setChecked(selected)
            style = self.button_styles[plan_id]
            if selected:
                style += "\nbackground-color: #2E7D32; color: white; border: 3px solid #7DFF9E;"
            button.setStyleSheet(style)
        self.continue_button.setEnabled(selected_id is not None)

    def _apply_group_layout(self) -> None:
        y = 220
        gap = 40
        width = 656
        x = 32
        expanded_height = 170

        for group in ["single", "multi", "monthly"]:
            height = expanded_height
            self.cards[group].setGeometry(x, y, width, height)
            for plan_id in self.groups[group]:
                self.plan_buttons[plan_id].setVisible(True)
            y += height + gap
