from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QPushButton, QScrollArea, QVBoxLayout, QWidget

from screens.base import BaseController
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
        self.selected_card: QFrame | None = None
        self.selected_group_type: str | None = None
        self.group_cards: dict[str, QFrame] = {}

        self.child("btnBackMain", QPushButton).clicked.connect(lambda: self.navigate("/rent-size"))
        self.continue_button.clicked.connect(self._on_continue)

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
        h = QHBoxLayout5(header, 16, 0, 16, 0)

        btn_back = QPushButton("←", header)
        btn_back.setObjectName("btnBackMain")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; } QPushButton:pressed { color: #FF6600; }")

        title = QLabel("CHỌN GÓI THUÊ", header)
        title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 8, 24, 0)
        body.setSpacing(0)

        self.lbl_size = QLabel("", root)
        self.lbl_size.setObjectName("lblSelectedSize")
        self.lbl_size.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 500; padding: 8px 0;")
        body.addWidget(self.lbl_size)

        scroll = QScrollArea(root)
        scroll.setObjectName("scrollArea")
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { background: transparent; border: none; } QScrollBar:vertical { width: 0; }")

        container = QWidget()
        container.setObjectName("plansContainer")
        container.setStyleSheet("background: transparent;")
        container_layout = QVBoxLayout(container)
        container_layout.setObjectName("plansLayout")
        container_layout.setContentsMargins(0, 8, 0, 8)
        container_layout.setSpacing(16)

        scroll.setWidget(container)
        body.addWidget(scroll, stretch=1)

        self.btn_continue = QPushButton("Tiếp Tục")
        self.btn_continue.setObjectName("btnContinue")
        self.btn_continue.setFixedHeight(80)
        self.btn_continue.setEnabled(False)
        self.btn_continue.setCursor(Qt.PointingHandCursor)
        self.btn_continue.setStyleSheet(
            "QPushButton { background-color: #333; color: #777; border: none; border-radius: 18px; font-size: 24px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }"
            "QPushButton:enabled { background-color: #FF6600; color: white; }"
        )
        body.addWidget(self.btn_continue)

        layout.addLayout(body)
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
        size_text = (
            "Size 1 (Tủ nhỏ)"
            if self.state.selected_size == "SMALL"
            else "Size 2 (Tủ lớn)"
        )
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
        card.setMinimumHeight(220)

        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(32, 28, 32, 28)
        card_layout.setSpacing(12)

        title_label = QLabel(group_info["title"])
        title_label.setStyleSheet("color: #E8E8E8; font-size: 30px; font-weight: bold; border: none;")

        subtitle_label = QLabel(group_info["subtitle"])
        subtitle_label.setStyleSheet("color: #888888; font-size: 20px; font-weight: 500; border: none;")

        price_label = QLabel(f"T\u1eeb {format_currency(min_price)}")
        price_label.setStyleSheet("color: #FF6600; font-size: 28px; font-weight: 800; border: none;")

        card_layout.addWidget(title_label)
        card_layout.addWidget(subtitle_label)
        card_layout.addWidget(price_label)

        self.set_clickable(card, lambda rt=rental_type: self._select_group(rt))
        return card

    def _select_group(self, rental_type: str) -> None:
        if self.selected_card:
            rt = self.selected_group_type
            self.selected_card.setStyleSheet(f"""
                QFrame#groupCard_{rt} {{
                    background-color: #111111;
                    border: 3px solid #2A2A2A;
                    border-radius: 20px;
                }}
                QFrame#groupCard_{rt}:hover {{
                    border: 3px solid #FF6600;
                    background-color: #1A1A1A;
                }}
                QLabel {{
                    background-color: transparent;
                }}
            """)

        card = self.group_cards.get(rental_type)
        if not card:
            return

        card.setStyleSheet(f"""
            QFrame#groupCard_{rental_type} {{
                background-color: #1C1400;
                border: 3px solid #FF6600;
                border-radius: 20px;
            }}
            QFrame#groupCard_{rental_type}:hover {{
                border: 3px solid #FF6600;
                background-color: #1C1400;
            }}
            QLabel {{
                background-color: transparent;
            }}
        """)
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


def QHBoxLayout5(parent, left, top, right, bottom):
    from PySide6.QtWidgets import QHBoxLayout
    l = QHBoxLayout(parent)
    l.setContentsMargins(left, top, right, bottom)
    return l
