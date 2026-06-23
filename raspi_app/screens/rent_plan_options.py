from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QScrollArea, QVBoxLayout, QWidget

from screens.base import BaseController
from services.app_state import Plan
from services.formatters import PLAN_GROUPS, format_currency, format_plan_subtitle


class RentPlanOptionsController(BaseController):
    route = "/rent-plan-options"

    def __init__(self, app):
        super().__init__(app, self.route, "RentPlanOptions.ui")
        self.title_label = self.child("lblTitle", QLabel)
        self.group_label = self.child("lblSelectedGroup", QLabel)
        self.scroll_area = self.child("scrollArea", QScrollArea)
        self.options_container = self.child("planOptionsContainer", QWidget)
        self.options_layout = self.child("planOptionsLayout", QVBoxLayout)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.selected_card: QFrame | None = None

        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/rent-plan"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-phone"))

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_size:
            self.navigate("/rent-size", replace=True)
            return

        if not self.state.selected_plan_group:
            self.navigate("/rent-plan", replace=True)
            return

        self.state.selected_plan = None
        self.selected_card = None
        self.continue_button.setEnabled(False)

        group_info = PLAN_GROUPS.get(self.state.selected_plan_group, {"title": self.state.selected_plan_group})
        self.group_label.setText(group_info["title"])

        plans = [p for p in self.state.available_plans if p.rental_type.upper() == self.state.selected_plan_group]

        if not plans:
            try:
                self.state.available_plans = self.api_client.get_plans(self.state.selected_size)
                plans = [p for p in self.state.available_plans if p.rental_type.upper() == self.state.selected_plan_group]
            except Exception as error:
                self.show_error_dialog(
                    message=str(error) or "Kh\u00f4ng th\u1ec3 t\u1ea3i danh s\u00e1ch g\u00f3i thu\u00ea.",
                    title="L\u1ed6I T\u1ea2I G\u00d3I THU\u00ca",
                    on_retry=lambda: self.on_enter(data),
                )
                return

        self._render_plan_options(plans)

    def _render_plan_options(self, plans: list[Plan]) -> None:
        self._clear_layout(self.options_layout)

        if not plans:
            label = QLabel("Kh\u00f4ng c\u00f3 g\u00f3i n\u00e0o trong nh\u00f3m n\u00e0y")
            label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 600; padding: 60px 0;")
            self.options_layout.addWidget(label)
            return

        for plan in plans:
            card = self._build_plan_card(plan)
            self.options_layout.addWidget(card)

        self.options_layout.addStretch()

    def _build_plan_card(self, plan: Plan) -> QFrame:
        card = QFrame()
        card.setObjectName(f"planCard_{plan.id}")
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setStyleSheet("""
            QFrame {
                background-color: #111111;
                border: 3px solid #2A2A2A;
                border-radius: 18px;
            }
            QFrame:hover {
                border: 3px solid #FF6600;
                background-color: #1A1A1A;
            }
            QLabel {
                background-color: transparent;
            }
        """)
        card.setMinimumHeight(150)

        layout = QHBoxLayout(card)
        layout.setContentsMargins(30, 22, 30, 22)

        info_layout = QVBoxLayout()
        info_layout.setSpacing(8)

        name_label = QLabel(plan.name)
        name_label.setStyleSheet("color: #E8E8E8; font-size: 26px; font-weight: 700; border: none;")

        subtitle_text = format_plan_subtitle(plan.rental_type, plan.duration_days, plan.max_opens)
        subtitle_label = QLabel(subtitle_text)
        subtitle_label.setStyleSheet("color: #888888; font-size: 19px; font-weight: 500; border: none;")

        info_layout.addWidget(name_label)
        info_layout.addWidget(subtitle_label)

        price_label = QLabel(format_currency(plan.price))
        price_label.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        price_label.setStyleSheet("color: #FF6600; font-size: 32px; font-weight: 900; border: none;")

        layout.addLayout(info_layout)
        layout.addStretch()
        layout.addWidget(price_label)

        self.set_clickable(card, lambda p=plan: self._select_plan(p, card))

        return card

    def _select_plan(self, plan: Plan, card: QFrame) -> None:
        self.state.selected_plan = plan

        if self.selected_card and self.selected_card is not card:
            self.selected_card.setStyleSheet("""
                QFrame {
                    background-color: #111111;
                    border: 3px solid #2A2A2A;
                    border-radius: 18px;
                }
                QLabel {
                    background-color: transparent;
                }
            """)

        card.setStyleSheet("""
            QFrame {
                background-color: #1A3A1A;
                border: 3px solid #2E7D32;
                border-radius: 18px;
            }
            QLabel {
                background-color: transparent;
            }
        """)
        self.selected_card = card
        self.continue_button.setEnabled(True)

    def _clear_layout(self, layout: QVBoxLayout) -> None:
        while layout.count():
            item = layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()

    def on_exit(self) -> None:
        pass
