from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QPushButton,
    QScrollArea, QVBoxLayout, QWidget,
)

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
        self.selected_card: QFrame | None = None

        self.child("btnBack", QPushButton).clicked.connect(lambda: self.navigate("/rent-plan"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-phone"))

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = QFrame(root)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet(
            "QFrame#headerFrame { background-color: #0A0A0A; border: none; border-bottom: 1px solid #222; }"
        )
        h = QHBoxLayout(header)
        h.setContentsMargins(16, 0, 16, 0)

        btn_back = QPushButton("←", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet(
            "QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; }"
            "QPushButton:pressed { color: #FF6600; }"
        )

        self.lbl_title = QLabel("Chọn gói thuê", header)
        self.lbl_title.setObjectName("lblTitle")
        self.lbl_title.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;"
        )

        h.addWidget(btn_back)
        h.addWidget(self.lbl_title)
        h.addStretch()
        layout.addWidget(header)

        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(24, 8, 24, 0)
        body.setSpacing(0)

        self.lbl_group = QLabel("", root)
        self.lbl_group.setObjectName("lblSelectedGroup")
        self.lbl_group.setFixedHeight(44)
        self.lbl_group.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500; padding: 4px 0;"
        )
        body.addWidget(self.lbl_group)

        scroll = QScrollArea(root)
        scroll.setObjectName("scrollArea")
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet(
            "QScrollArea { background: transparent; border: none; }"
            "QScrollBar:vertical { width: 0; }"
        )

        container = QWidget()
        container.setObjectName("planOptionsContainer")
        container.setStyleSheet("background: transparent;")
        container_layout = QVBoxLayout(container)
        container_layout.setObjectName("planOptionsLayout")
        container_layout.setContentsMargins(0, 8, 0, 8)
        container_layout.setSpacing(14)
        scroll.setWidget(container)
        body.addWidget(scroll, stretch=1)

        body.addSpacing(12)

        btn_continue = QPushButton("TIẾP TỤC")
        btn_continue.setObjectName("btnContinue")
        btn_continue.setFixedHeight(96)
        btn_continue.setEnabled(False)
        btn_continue.setCursor(Qt.PointingHandCursor)
        btn_continue.setStyleSheet(
            "QPushButton { background-color: #333; color: #777; border: none;"
            " border-radius: 24px; font-size: 26px; font-weight: 800;"
            " font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:enabled { background-color: #2E7D32; color: white; }"
        )
        body.addWidget(btn_continue)
        body.addSpacing(68)

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
                self.show_error_dialog(
                    message=str(error) or "Không thể tải danh sách gói thuê.",
                    title="LỖI TẢI GÓI THUÊ",
                    on_retry=lambda: self.on_enter(data),
                )
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

    def _build_plan_card(self, plan: Plan) -> QFrame:
        card = QFrame()
        card.setObjectName(f"planCard_{plan.id}")
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setMinimumHeight(190)
        card.setStyleSheet("""
            QFrame {
                background-color: #111111;
                border: 3px solid #2A2A2A;
                border-radius: 22px;
            }
            QFrame:hover {
                border: 3px solid #FF6600;
                background-color: #1A1A1A;
            }
            QLabel { background-color: transparent; }
        """)

        card_layout = QHBoxLayout(card)
        card_layout.setContentsMargins(36, 28, 36, 28)

        info_layout = QVBoxLayout()
        info_layout.setSpacing(12)

        name_label = QLabel(plan.name)
        name_label.setStyleSheet(
            "color: #E8E8E8; font-size: 28px; font-weight: 700; border: none;"
        )

        subtitle_text = format_plan_subtitle(plan.rental_type, plan.duration_days, plan.max_opens)
        subtitle_label = QLabel(subtitle_text)
        subtitle_label.setStyleSheet(
            "color: #888888; font-size: 20px; font-weight: 500; border: none;"
        )

        info_layout.addWidget(name_label)
        info_layout.addWidget(subtitle_label)

        price_label = QLabel(format_currency(plan.price))
        price_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        price_label.setStyleSheet(
            "color: #FF6600; font-size: 36px; font-weight: 900; border: none;"
        )

        card_layout.addLayout(info_layout)
        card_layout.addStretch()
        card_layout.addWidget(price_label)

        self.set_clickable(card, lambda p=plan: self._select_plan(p, card))
        return card

    def _select_plan(self, plan: Plan, card: QFrame) -> None:
        self.state.selected_plan = plan

        if self.selected_card and self.selected_card is not card:
            self.selected_card.setStyleSheet("""
                QFrame {
                    background-color: #111111;
                    border: 3px solid #2A2A2A;
                    border-radius: 22px;
                }
                QLabel { background-color: transparent; }
            """)

        card.setStyleSheet("""
            QFrame {
                background-color: #1A3A1A;
                border: 3px solid #2E7D32;
                border-radius: 22px;
            }
            QLabel { background-color: transparent; }
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
