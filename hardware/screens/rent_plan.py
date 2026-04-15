from __future__ import annotations

from PySide6.QtWidgets import QLabel

from screens.base_screen import BaseScreen


class RentPlanScreen(BaseScreen):
    PLAN_LABELS = {
        "on_demand": "Thuê theo lượt",
        "multi": "Thuê nhiều lượt",
        "monthly": "Thuê theo tháng",
    }

    def __init__(self, app) -> None:
        super().__init__(app, "RentPlanSeclection.ui", title="Chọn gói dịch vụ", show_back=True)
        self.label_size_selection = self.find("labelSizeSelection", QLabel)
        self._reg(self.find("framePlan1"), lambda: self._select_plan("on_demand"))
        self._reg(self.find("framePlan2"), lambda: self._select_plan("multi"))
        self._reg(self.find("framePlan3"), lambda: self._select_plan("monthly"))

    def on_enter(self, **kwargs) -> None:
        super().on_enter(**kwargs)
        size_label = "Size 1" if self.app.state.selected_size == "SMALL" else "Size 2"
        if self.label_size_selection is not None:
            self.label_size_selection.setText(f"Ban da chon {size_label}")

    def _select_plan(self, plan: str) -> None:
        self.app.state.selected_plan = plan
        self.app.show_screen("phone")
