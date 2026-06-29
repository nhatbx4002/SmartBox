from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget,
)

from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.header_bar import HeaderBar
from screens.components.buttons import PrimaryButton
from screens.components.bottom_action_bar import BottomActionBar
from screens.base import BaseController, run_in_thread
from screens.inline_error import InlineError


class RentSizeController(BaseController):
    route = "/rent-size"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)
        self.card_small = self.child("cardSize1", QWidget)
        self.card_large = self.child("cardSize2", QWidget)
        self.continue_button = self.child("btnContinue", QPushButton)

        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(40, 1040, 640, 54)

        self.set_clickable(self.card_small, lambda: self._select_size("SMALL"))
        self.set_clickable(self.card_large, lambda: self._select_size("LARGE"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-plan"))

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Header ──────────────────────────────────────────────
        header = HeaderBar(
            "Chọn kích thước tủ muốn thuê",
            on_back=lambda: self.go_home(),
            parent=root,
            back_object_name="btnBack",
        )
        layout.addWidget(header)
        # ── Body ────────────────────────────────────────────────
        body = QVBoxLayout()
        body.setContentsMargins(24, 32, 24, 32)
        body.setSpacing(20)

        subtitle = QLabel("Chọn kích thước phù hợp với đồ cần gửi")
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet(
            "background: transparent; border: none; color: #888;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 600;"
        )
        body.addWidget(subtitle)

        body.addSpacing(8)

        card1 = self._size_card(
            "cardSize1", "Tủ nhỏ", "📦",
            "Phù hợp với đồ cá nhân, ví, sạc, phụ kiện nhỏ",
        )
        card2 = self._size_card(
            "cardSize2", "Tủ lớn", "🧳",
            "Phù hợp với balo, túi xách, hành lý nhỏ",
        )

        body.addWidget(card1)
        body.addWidget(card2)

        btn_continue = PrimaryButton(
            "TIẾP TỤC",
            object_name="btnContinue",
            color="green",
        )
        btn_continue.setEnabled(False)
        body.addWidget(BottomActionBar(btn_continue))

        layout.addLayout(body, 1)
        return root

    def _size_card(self, obj_name: str, label: str, icon: str, desc: str) -> QFrame:
        card = QFrame()
        card.setObjectName(obj_name)
        card.setFixedHeight(360)
        card.setCursor(Qt.PointingHandCursor)
        card.setStyleSheet(
            f"QFrame#{obj_name} {{"
            f"  background-color: #1C1B1B; border: 3px solid #2A2A2A; border-radius: 28px;"
            f"}}"
            f"QFrame#{obj_name}:hover {{ border: 3px solid #FF6600; }}"
            f"QLabel {{ background: transparent; }}"
        )

        c_layout = QHBoxLayout(card)
        c_layout.setContentsMargins(40, 28, 40, 28)
        c_layout.setSpacing(28)

        icon_lbl = QLabel(icon, card)
        icon_lbl.setFixedSize(104, 104)
        icon_lbl.setAlignment(Qt.AlignCenter)
        icon_lbl.setStyleSheet("border: none; font-size: 64px;")
        c_layout.addWidget(icon_lbl)

        text_box = QVBoxLayout()
        text_box.setSpacing(10)
        text_box.setAlignment(Qt.AlignVCenter)

        title_lbl = QLabel(label, card)
        title_lbl.setStyleSheet(
            "border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 30px; font-weight: 900;"
        )

        desc_lbl = QLabel(desc, card)
        desc_lbl.setWordWrap(True)
        desc_lbl.setStyleSheet(
            "border: none; color: #999;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 19px; font-weight: 500;"
        )

        text_box.addWidget(title_lbl)
        text_box.addWidget(desc_lbl)
        c_layout.addLayout(text_box)
        c_layout.addStretch()

        return card

    def on_enter(self, data: dict | None = None) -> None:
        self.error_banner.clear()
        reset = data.get("reset", False) if data else False
        if reset:
            self.state.selected_size = None
            self.state.selected_plan = None
            self.state.selected_plan_group = None
            self.state.available_plans = []
            self.state.phone = None
            self.state.payment_method = None
            self.state.rental_data = None
            self.state.compartment_data = None
        self._apply_selection(self.state.selected_size)

    def _select_size(self, size: str) -> None:
        self.error_banner.clear()
        self.continue_button.setEnabled(False)
        self._apply_selection(size)

        def _check():
            return self.api_client.check_availability(size)

        def _on_done(result):
            if not result.get("available"):
                size_label = "Tủ nhỏ" if size == "SMALL" else "Tủ lớn"
                self.error_banner.show_error(f"Hiện không còn ngăn trống cho {size_label}")
                return
            self.state.selected_size = size
            self.state.selected_plan = None
            self.state.selected_plan_group = None
            self.state.available_plans = []
            self.state.phone = None
            self.state.payment_method = None
            self.state.rental_data = None
            self.state.compartment_data = None
            self.continue_button.setEnabled(True)

        def _on_error(_exc):
            # Không có mạng → cho phép tiếp tục, lỗi sẽ hiện ở bước sau
            self.state.selected_size = size
            self.continue_button.setEnabled(True)

        run_in_thread(_check, _on_done, _on_error)

    def _apply_selection(self, size: str | None) -> None:
        self._style_card(self.card_small, "cardSize1", size == "SMALL")
        self._style_card(self.card_large, "cardSize2", size == "LARGE")
        self.continue_button.setEnabled(size in {"SMALL", "LARGE"})

    def _style_card(self, card: QWidget, name: str, selected: bool) -> None:
        if selected:
            card.setStyleSheet(
                f"QFrame#{name} {{ border: 4px solid #FF6600; background-color: #1C1400; border-radius: 28px; }}"
                f"QLabel {{ background: transparent; }}"
            )
        else:
            card.setStyleSheet(
                f"QFrame#{name} {{ background-color: #1C1B1B; border: 3px solid #2A2A2A; border-radius: 28px; }}"
                f"QFrame#{name}:hover {{ border: 3px solid #FF6600; }}"
                f"QLabel {{ background: transparent; }}"
            )
