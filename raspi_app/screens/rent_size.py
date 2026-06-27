from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
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
        self.error_banner.setGeometry(60, 940, 600, 64)

        self.child("btnBack", QPushButton).clicked.connect(self.go_home)
        self.set_clickable(self.card_small, lambda: self._select_size("SMALL"))
        self.set_clickable(self.card_large, lambda: self._select_size("LARGE"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-plan"))

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
        h = QHBoxLayout7(header, 16, 0, 16, 0)

        btn_back = QPushButton("\u2190", header)
        btn_back.setObjectName("btnBack")
        btn_back.setFixedSize(60, 60)
        btn_back.setCursor(Qt.PointingHandCursor)
        btn_back.setStyleSheet("QPushButton { background: transparent; border: none; color: #E8E8E8; font-size: 32px; } QPushButton:pressed { color: #FF6600; }")

        title = QLabel("CHỌN KÍCH THƯỚC TỦ", header)
        title.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 26px; font-weight: 900;")

        h.addWidget(btn_back)
        h.addWidget(title)
        h.addStretch()
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 32, 24, 0)
        body.setSpacing(16)

        sizes_row = QHBoxLayout()
        sizes_row.setSpacing(16)

        card1 = self._size_card(
            "cardSize1",
            "Tủ nhỏ",
            "📦",
            "Phù hợp với đồ cá nhân nhỏ",
        )

        card2 = self._size_card(
            "cardSize2",
            "Tủ lớn",
            "🧳",
            "Phù hợp với hành lý, ba lô, túi xách",
        )

        sizes_row.addWidget(card1)
        sizes_row.addWidget(card2)

        body.addLayout(sizes_row)
        body.addStretch()

        self.btn_continue = QPushButton("TIẾP TỤC")
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

    def _size_card(self, obj_name: str, label: str, icon: str, desc: str) -> QFrame:
        card = QFrame()
        card.setObjectName(obj_name)
        card.setFixedHeight(280)
        card.setCursor(Qt.PointingHandCursor)
        card.setStyleSheet(
            f"QFrame#{obj_name} {{"
            f"  background-color: #1C1B1B;"
            f"  border: 3px solid #2A2A2A;"
            f"  border-radius: 24px;"
            f"}}"
            f"QFrame#{obj_name}:hover {{"
            f"  border: 3px solid #FF6600;"
            f"}}"
            f"QLabel {{ background: transparent; }}"
        )

        c_layout = QVBoxLayout(card)
        c_layout.setContentsMargins(20, 24, 20, 24)
        c_layout.setSpacing(8)
        c_layout.setAlignment(Qt.AlignCenter)

        icon_lbl = QLabel(icon, card)
        icon_lbl.setAlignment(Qt.AlignCenter)
        icon_lbl.setStyleSheet("border: none; font-size: 56px;")
        c_layout.addWidget(icon_lbl)

        title_lbl = QLabel(label, card)
        title_lbl.setAlignment(Qt.AlignCenter)
        title_lbl.setStyleSheet("border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 800;")
        c_layout.addWidget(title_lbl)

        desc_lbl = QLabel(desc, card)
        desc_lbl.setAlignment(Qt.AlignCenter)
        desc_lbl.setWordWrap(True)
        desc_lbl.setStyleSheet("border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; font-weight: 500;")
        c_layout.addWidget(desc_lbl)

        return card

    def on_enter(self, data: dict | None = None) -> None:
        self.error_banner.clear()
        self._apply_selection(self.state.selected_size)

    def _select_size(self, size: str) -> None:
        self.error_banner.clear()
        self._apply_selection(size)

        try:
            result = self.api_client.check_availability(size)
        except Exception:
            self.state.selected_size = size
            self.state.selected_plan = None
            self.state.selected_plan_group = None
            self.state.available_plans = []
            self.state.phone = None
            self.state.payment_method = None
            self.state.rental_data = None
            self.state.compartment_data = None
            return

        if not result.get("available"):
            size_label = "Tủ nhỏ" if size == "SMALL" else "Tủ lớn"
            self.error_banner.show_error(f"Hiện không còn ngăn trống cho {size_label}")
            self.continue_button.setEnabled(False)
            return

        self.state.selected_size = size
        self.state.selected_plan = None
        self.state.selected_plan_group = None
        self.state.available_plans = []
        self.state.phone = None
        self.state.payment_method = None
        self.state.rental_data = None
        self.state.compartment_data = None

    def _apply_selection(self, size: str | None) -> None:
        self._style_card(self.card_small, "SMALL", size == "SMALL")
        self._style_card(self.card_large, "LARGE", size == "LARGE")
        self.continue_button.setEnabled(size in {"SMALL", "LARGE"})

    def _style_card(self, card: QWidget, key: str, selected: bool) -> None:
        name = card.objectName()
        if selected:
            card.setStyleSheet(
                f"QFrame#{name} {{ border: 4px solid #FF6A00; background-color: #1C1400; border-radius: 24px; }}"
                f"QLabel {{ background: transparent; }}"
            )
        else:
            card.setStyleSheet(
                f"QFrame#{name} {{ background-color: #1C1B1B; border: 3px solid #2A2A2A; border-radius: 24px; }}"
                f"QFrame#{name}:hover {{ border: 3px solid #FF6600; }}"
                f"QLabel {{ background: transparent; }}"
            )


def QHBoxLayout7(parent, left, top, right, bottom):
    from PySide6.QtWidgets import QHBoxLayout
    l = QHBoxLayout(parent)
    l.setContentsMargins(left, top, right, bottom)
    return l
