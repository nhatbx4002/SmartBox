from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLabel, QPushButton, QScrollArea, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar
from screens.components.buttons import PrimaryButton
from screens.components.selectable_card import SelectableCard
from screens.components.bottom_action_bar import BottomActionBar
from screens.base import BaseController
from services.app_state import Plan
from services.formatters import PLAN_GROUPS, format_currency, format_plan_subtitle


class RentPlanOptionsController(BaseController):
    route = "/rent-plan-options"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.title_label = self.child("lblTitle", QLabel)
        self.group_label = self.child("lblSelectedGroup", QLabel)
        self.scroll_area = self.child("scrollArea", QScrollArea)
        self.options_container = self.child("planOptionsContainer", QWidget)
        self.options_layout = self.child("planOptionsLayout", QVBoxLayout)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.selected_card: SelectableCard | None = None
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-phone"))

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = HeaderBar("Chọn gói thuê", on_back=lambda: self.navigate("/rent-plan"), parent=root, back_object_name="btnBack", title_object_name="lblTitle")
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 8, 24, 32)
        body.setSpacing(0)

        self.lbl_group = QLabel("", root)
        self.lbl_group.setObjectName("lblSelectedGroup")
        self.lbl_group.setFixedHeight(44)
        self.lbl_group.setStyleSheet("background: transparent; border: none; color: #888;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500; padding: 4px 0;")
        body.addWidget(self.lbl_group)

        scroll = QScrollArea(root)
        scroll.setObjectName("scrollArea")
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { background: transparent; border: none; }QScrollBar:vertical { width: 0; }")

        container = QWidget()
        container.setObjectName("planOptionsContainer")
        container.setStyleSheet("background: transparent;")
        container_layout = QVBoxLayout(container)
        container_layout.setObjectName("planOptionsLayout")
        container_layout.setContentsMargins(0, 8, 0, 8)
        container_layout.setSpacing(14)
        scroll.setWidget(container)
        body.addWidget(scroll, stretch=1)

        btn_continue = PrimaryButton("TIẾP TỤC", object_name="btnContinue", color="orange")
        btn_continue.setEnabled(False)
        body.addWidget(BottomActionBar(btn_continue))

        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_size:
            self.navigate("/rent-size", replace=True)
            return
        if not self.state.selected_plan_group:
            self.navigate("/rent-plan", replace=True)
            return

        self.title_label.setText("Chọn gói thuê")
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
                self.show_error_dialog(message=str(error) or "Không thể tải danh sách gói thuê.", title="LỖI TẢI GÓI THUÊ", on_retry=lambda: self.on_enter(data))
                return

        self._render_plan_options(plans)

    def _render_plan_options(self, plans: list[Plan]) -> None:
        self._clear_layout(self.options_layout)
        if not plans:
            label = QLabel("Không có gói nào trong nhóm này")
            label.setAlignment(Qt.AlignCenter)
            label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 600; padding: 60px 0;")
            self.options_layout.addWidget(label)
            return

        for plan in plans:
            card = self._build_plan_card(plan)
            self.options_layout.addWidget(card)
        self.options_layout.addStretch()

    def _build_plan_card(self, plan: Plan) -> SelectableCard:
        subtitle_text = format_plan_subtitle(plan.rental_type, plan.duration_days, plan.max_opens)
        card = SelectableCard(title=plan.name, subtitle=subtitle_text, trailing=format_currency(plan.price), object_name=f"planCard_{plan.id}", min_height=190, radius=22, selected_color="green", horizontal=True)
        self.set_clickable(card, lambda p=plan, c=card: self._select_plan(p, c))
        return card

    def _select_plan(self, plan: Plan, card: SelectableCard) -> None:
        self.state.selected_plan = plan
        if self.selected_card and self.selected_card is not card:
            self.selected_card.set_selected(False)
        card.set_selected(True)
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
