from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QScrollArea, QVBoxLayout, QWidget

from screens.base import BaseController
from services.app_state import Plan
from services.formatters import PLAN_GROUPS, format_currency


class RentPlanController(BaseController):
    route = "/rent-plan"

    def __init__(self, app):
        super().__init__(app, self.route, "RentPlan.ui")
        self.selected_size_label = self.child("lblSelectedSize", QLabel)
        self.scroll_area = self.child("scrollArea", QScrollArea)
        self.plans_container = self.child("plansContainer", QWidget)
        self.plans_layout = self.child("plansLayout", QVBoxLayout)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.child("btnBackMain", QPushButton).clicked.connect(lambda: self.navigate("/rent-size"))

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_size:
            self.navigate("/rent-size", replace=True)
            return

        self.state.selected_plan_group = None
        self.state.selected_plan = None
        size_text = "Size 1 (Nh\u1ecf)" if self.state.selected_size == "SMALL" else "Size 2 (L\u1edbn)"
        self.selected_size_label.setText(f"B\u1ea1n \u0111\u00e3 ch\u1ecdn {size_text}")
        self._load_plans()

    def _load_plans(self) -> None:
        try:
            plans = self.api_client.get_plans(self.state.selected_size)
            self.state.available_plans = plans
            grouped = self._group_plans_by_type(plans)
            self._render_plan_groups(grouped)
            self.hide_error_dialog()
        except Exception as error:
            self.show_error_dialog(
                message=str(error) or "Kh\u00f4ng th\u1ec3 t\u1ea3i danh s\u00e1ch g\u00f3i thu\u00ea. Vui l\u00f2ng th\u1eed l\u1ea1i.",
                title="L\u1ed6I T\u1ea2I G\u00d3I THU\u00ca",
                on_retry=self._load_plans,
            )

    def _group_plans_by_type(self, plans: list[Plan]) -> dict[str, list[Plan]]:
        grouped: dict[str, list[Plan]] = {}
        for plan in plans:
            rt = plan.rental_type.upper()
            if rt not in grouped:
                grouped[rt] = []
            grouped[rt].append(plan)
        return grouped

    def _render_plan_groups(self, grouped: dict[str, list[Plan]]) -> None:
        self._clear_layout(self.plans_layout)

        if not grouped:
            label = QLabel("Kh\u00f4ng c\u00f3 g\u00f3i thu\u00ea cho k\u00edch th\u01b0\u1edbc n\u00e0y")
            label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 600; padding: 60px 0;")
            self.plans_layout.addWidget(label)
            return

        for rental_type, plans in grouped.items():
            card = self._build_group_card(rental_type, plans)
            self.plans_layout.addWidget(card)

        self.plans_layout.addStretch()

    def _build_group_card(self, rental_type: str, plans: list[Plan]) -> QFrame:
        group_info = PLAN_GROUPS.get(rental_type, {"title": rental_type, "subtitle": ""})
        min_price = min(p.price for p in plans)

        card = QFrame()
        card.setObjectName(f"groupCard_{rental_type}")
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setStyleSheet(f"""
            QFrame#groupCard_{rental_type} {{
                background-color: #111111;
                border: 3px solid #2A2A2A;
                border-radius: 20px;
            }}
            QFrame#groupCard_{rental_type}:hover {{
                border: 3px solid #FF6600;
                background-color: #1A1A1A;
            }}
            QLabel {{
                background-color: transparent;
            }}
        """)
        card.setMinimumHeight(190)

        layout = QVBoxLayout(card)
        layout.setContentsMargins(32, 28, 32, 28)
        layout.setSpacing(12)

        title_label = QLabel(group_info["title"])
        title_label.setStyleSheet("color: #E8E8E8; font-size: 30px; font-weight: bold; border: none;")

        subtitle_label = QLabel(group_info["subtitle"])
        subtitle_label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 500; border: none;")

        price_label = QLabel(f"T\u1eeb {format_currency(min_price)}")
        price_label.setStyleSheet("color: #FF6600; font-size: 28px; font-weight: 800; border: none;")

        layout.addWidget(title_label)
        layout.addWidget(subtitle_label)
        layout.addWidget(price_label)

        self.set_clickable(card, lambda rt=rental_type: self._select_group(rt))

        return card

    def _select_group(self, rental_type: str) -> None:
        self.state.selected_plan_group = rental_type
        self.navigate("/rent-plan-options")

    def _clear_layout(self, layout: QVBoxLayout) -> None:
        while layout.count():
            item = layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()

    def on_exit(self) -> None:
        pass
