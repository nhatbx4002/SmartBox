from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget
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
        self.avail_small = self.child("cardSize1_avail", QLabel)
        self.avail_large = self.child("cardSize2_avail", QLabel)
        self.continue_button = self.child("btnContinue", QPushButton)
        self.availability: dict[str, int | None] = {"SMALL": None, "LARGE": None}
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

        header = HeaderBar("Chọn kích thước tủ muốn thuê", on_back=lambda: self.go_home(), parent=root, back_object_name="btnBack")
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 24, 24, 24)
        body.setSpacing(16)

        subtitle = QLabel("Chọn kích thước phù hợp với đồ cần gửi")
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet("background: transparent; border: none; color: #888;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 600;")
        body.addWidget(subtitle)
        body.addSpacing(8)

        card1 = self._size_card("cardSize1", "Tủ nhỏ", "📦", "Phù hợp với đồ cá nhân, ví, sạc, phụ kiện nhỏ")
        card2 = self._size_card("cardSize2", "Tủ lớn", "🧳", "Phù hợp với balo, túi xách, hành lý nhỏ")
        body.addWidget(card1)
        body.addWidget(card2)
        body.addStretch(1)

        btn_continue = PrimaryButton("TIẾP TỤC", object_name="btnContinue", color="green")
        btn_continue.setEnabled(False)
        body.addWidget(BottomActionBar(btn_continue))

        layout.addLayout(body, 1)
        return root

    def _size_card(self, obj_name: str, label: str, icon: str, desc: str) -> QFrame:
        card = QFrame()
        card.setObjectName(obj_name)
        card.setFixedHeight(380)
        card.setCursor(Qt.PointingHandCursor)
        card.setStyleSheet(self._card_css(obj_name, "normal"))

        c_layout = QHBoxLayout(card)
        c_layout.setContentsMargins(36, 28, 36, 28)
        c_layout.setSpacing(28)

        icon_lbl = QLabel(icon, card)
        icon_lbl.setFixedSize(100, 100)
        icon_lbl.setAlignment(Qt.AlignCenter)
        icon_lbl.setStyleSheet("border: none; font-size: 64px;")
        c_layout.addWidget(icon_lbl)

        text_box = QVBoxLayout()
        text_box.setSpacing(10)
        text_box.setAlignment(Qt.AlignVCenter)

        title_lbl = QLabel(label, card)
        title_lbl.setStyleSheet("border: none; color: #E8E8E8;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 32px; font-weight: 900;")

        desc_lbl = QLabel(desc, card)
        desc_lbl.setWordWrap(True)
        desc_lbl.setStyleSheet("border: none; color: #999;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 20px; font-weight: 500;")

        avail_lbl = QLabel("Đang kiểm tra...", card)
        avail_lbl.setObjectName(f"{obj_name}_avail")
        avail_lbl.setStyleSheet("border: none; color: #888;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 700;")

        text_box.addWidget(title_lbl)
        text_box.addWidget(desc_lbl)
        text_box.addWidget(avail_lbl)
        c_layout.addLayout(text_box)
        c_layout.addStretch()

        return card

    def on_enter(self, data: dict | None = None) -> None:
        self.error_banner.clear()
        self.state.selected_size = None
        self.state.selected_plan = None
        self.state.selected_plan_group = None
        self.state.available_plans.clear()
        self.state.phone = None
        self.state.rental_data = None
        self.state.compartment_data = None

        cached = self.state.cached_availability
        if cached:
            self.availability = dict(cached)
        else:
            self.availability = {"SMALL": None, "LARGE": None}
        self._render()
        self._load_availability()

    def _load_availability(self) -> None:
        def _check():
            result = self.api_client.check_availability(None)
            items = result.get("items", [])
            return {"SMALL": sum(1 for i in items if i.get("size") == "SMALL"), "LARGE": sum(1 for i in items if i.get("size") == "LARGE")}

        def _on_done(result):
            self.availability["SMALL"] = result["SMALL"]
            self.availability["LARGE"] = result["LARGE"]
            self.state.cached_availability = dict(result)
            self._render()

        def _on_error(_exc):
            self.availability = {"SMALL": None, "LARGE": None}
            self._render()

        run_in_thread(_check, _on_done, _on_error)

    def _select_size(self, size: str) -> None:
        if self._is_sold_out(size):
            return
        self.error_banner.clear()
        self.state.selected_size = size
        self.state.selected_plan = None
        self.state.selected_plan_group = None
        self.state.available_plans.clear()
        self.state.phone = None
        self.state.rental_data = None
        self.state.compartment_data = None
        self._render()

    def _is_sold_out(self, size: str) -> bool:
        count = self.availability.get(size)
        return count is not None and count <= 0

    def _render(self) -> None:
        self._render_card("SMALL", self.card_small, "cardSize1", self.avail_small)
        self._render_card("LARGE", self.card_large, "cardSize2", self.avail_large)
        selected = self.state.selected_size
        self.continue_button.setEnabled(selected in {"SMALL", "LARGE"} and not self._is_sold_out(selected))

    def _render_card(self, size: str, card: QWidget, name: str, avail_lbl: QLabel) -> None:
        count = self.availability.get(size)
        if count is None:
            avail_color = "#888"
        elif count <= 0:
            avail_lbl.setText("Hết tủ")
            avail_color = "#EF4444"
        else:
            avail_lbl.setText(f"Còn {count} tủ trống")
            avail_color = "#00C853"
        avail_lbl.setStyleSheet(f"border: none; color: {avail_color};font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 17px; font-weight: 700;")

        if self._is_sold_out(size):
            state = "disabled"
        elif self.state.selected_size == size:
            state = "selected"
        else:
            state = "normal"
        card.setStyleSheet(self._card_css(name, state))
        card.setCursor(Qt.ForbiddenCursor if state == "disabled" else Qt.PointingHandCursor)

    def _card_css(self, name: str, state: str) -> str:
        if state == "selected":
            return f"QFrame#{name} {{ border: 4px solid #FF6600; background-color: #1C1400; border-radius: 28px; }}QLabel {{ background: transparent; }}"
        if state == "disabled":
            return f"QFrame#{name} {{ background-color: #151515; border: 3px solid #2A2A2A; border-radius: 28px; }}QLabel {{ background: transparent; color: #555; }}"
        return f"QFrame#{name} {{ background-color: #1C1B1B; border: 3px solid #2A2A2A; border-radius: 28px; }}QLabel {{ background: transparent; }}"
