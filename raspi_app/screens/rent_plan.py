from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QLabel, QPushButton, QScrollArea, QVBoxLayout, QWidget

from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.base import BaseController
from screens.components.header_bar import HeaderBar
from screens.components.buttons import PrimaryButton
from screens.components.selectable_card import SelectableCard
from screens.components.bottom_action_bar import BottomActionBar
from services.app_state import Plan
from services.formatters import PLAN_GROUPS, format_currency


class RentPlanController(BaseController):
    route = "/rent-plan"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.selected_size_label = self.child("lblSelectedSize", QLabel)
        self.scroll_area = self.child("scrollArea", QScrollArea)
        self.plans_container = self.child("plansContainer", QWidget)
        self.plans_layout = self.child("plansLayout", QVBoxLayout)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.continue_button.setEnabled(False)
        self.selected_card: SelectableCard | None = None
        self.selected_group_type: str | None = None
        self.group_cards: dict[str, SelectableCard] = {}

        self.continue_button.clicked.connect(self._on_continue)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = HeaderBar(
            "CHỌN GÓI THUÊ",
            on_back=lambda: self.navigate("/rent-size"),
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)

        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(24, 16, 24, 0)
        body.setSpacing(0)

        self.lbl_size = QLabel("", root)
        self.lbl_size.setObjectName("lblSelectedSize")
        self.lbl_size.setFixedHeight(52)
        self.lbl_size.setStyleSheet(
            "background: transparent; border: none; color: #A0A0A0;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 700; padding: 8px 0;"
        )
        body.addWidget(self.lbl_size)

        # Scroll area cho cards
        scroll = QScrollArea(root)
        scroll.setObjectName("scrollArea")
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet(
            "QScrollArea { background: transparent; border: none; }"
            "QScrollBar:vertical { width: 0; }"
        )

        container = QWidget()
        container.setObjectName("plansContainer")
        container.setStyleSheet("background: transparent;")
        container_layout = QVBoxLayout(container)
        container_layout.setObjectName("plansLayout")
        container_layout.setContentsMargins(0, 8, 0, 8)
        container_layout.setSpacing(16)
        scroll.setWidget(container)
        body.addWidget(scroll, stretch=1)

        layout.addLayout(body, 1)

        btn_continue = PrimaryButton(
            "TIẾP TỤC",
            object_name="btnContinue",
            color="orange",
        )
        btn_continue.setEnabled(False)
        layout.addWidget(BottomActionBar(btn_continue))
        return root

    def _on_continue(self) -> None:
        if self.selected_group_type:
            self.state.selected_plan_group = self.selected_group_type
            self.navigate("/rent-plan-options")

    def on_enter(self, data: dict | None = None) -> None:
        if not self.state.selected_size:
            self.navigate("/rent-size", replace=True)
            return

        self.state.selected_plan_group = None
        self.state.selected_plan = None
        self.selected_card = None
        self.selected_group_type = None
        self.group_cards = {}
        self.continue_button.setEnabled(False)
        size_text = "Size 1 (Tủ nhỏ)" if self.state.selected_size == "SMALL" else "Size 2 (Tủ lớn)"
        self.selected_size_label.setText(f"Đã chọn: {size_text}")
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
                message=str(error) or "Không thể tải danh sách gói thuê. Vui lòng thử lại.",
                title="LỖI TẢI GÓI THUÊ",
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
            label = QLabel("Hiện chưa có gói thuê phù hợp với kích thước này")
            label.setAlignment(Qt.AlignCenter)
            label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 600; padding: 60px 0;")
            self.plans_layout.addWidget(label)
            return

        for rental_type, plans in grouped.items():
            card = self._build_group_card(rental_type, plans)
            self.group_cards[rental_type] = card
            self.plans_layout.addWidget(card)

        self.plans_layout.addStretch()

    def _build_group_card(self, rental_type: str, plans: list[Plan]) -> SelectableCard:
        group_info = PLAN_GROUPS.get(rental_type, {"title": rental_type, "subtitle": ""})
        min_price = min(p.price for p in plans)

        card = SelectableCard(
            title=group_info["title"],
            subtitle=group_info["subtitle"],
            trailing=f"Từ {format_currency(min_price)}",
            object_name=f"groupCard_{rental_type}",
            min_height=240,
            selected_color="orange",
        )

        self.set_clickable(card, lambda rt=rental_type: self._select_group(rt))
        return card

    def _select_group(self, rental_type: str) -> None:
        if self.selected_card:
            self.selected_card.set_selected(False)

        card = self.group_cards.get(rental_type)
        if not card:
            return

        card.set_selected(True)
        self.selected_card = card
        self.selected_group_type = rental_type
        self.continue_button.setEnabled(True)

    def _clear_layout(self, layout: QVBoxLayout) -> None:
        while layout.count():
            item = layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()

    def on_exit(self) -> None:
        pass
