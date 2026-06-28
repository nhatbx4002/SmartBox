from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget
from screens.components.header_bar import HeaderBar
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style

from screens.base import BaseController


class PickupMethodController(BaseController):
    route = "/pickup-method"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)
        self.header_title = self.child("lblHeaderTitle", QLabel)
        self.set_clickable(self.child("pinCard"), self._open_pin)
        self.set_clickable(self.child("qrCard"), self._open_qr)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = HeaderBar(
            "CHỌN PHƯƠNG THỨC",
            on_back=self.go_back,
            parent=root,
            back_object_name="btnBack",
            title_object_name="lblHeaderTitle",
        )
        layout.addWidget(header)

        body = QVBoxLayout()
        body.setContentsMargins(24, 32, 24, 0)
        body.setSpacing(24)

        pin_card = self._make_method_card("pinCard", "Mã PIN", "🔢", "Nhập mã PIN được cung cấp", "#1565C0")
        qr_card = self._make_method_card("qrCard", "Mã QR", "📱", "Quét mã QR từ điện thoại", "#00897B")

        body.addWidget(pin_card)
        body.addWidget(qr_card)
        body.addStretch()

        layout.addLayout(body)
        return root

    def _make_method_card(self, obj_name: str, label: str, icon: str, desc: str, accent: str) -> QFrame:
        card = QFrame()
        card.setObjectName(obj_name)
        card.setFixedHeight(300)
        card.setCursor(Qt.PointingHandCursor)
        card.setStyleSheet(
            f"QFrame#{obj_name} {{"
            f"  background-color: #111111;"
            f"  border: 3px solid {accent};"
            f"  border-radius: 24px;"
            f"}}"
            f"QLabel {{ background: transparent; }}"
        )

        c_layout = QVBoxLayout(card)
        c_layout.setContentsMargins(32, 28, 32, 28)

        icon_label = QLabel(icon, card)
        icon_label.setStyleSheet("border: none; font-size: 48px;")

        title = QLabel(label, card)
        title.setStyleSheet(
            f"border: none; color: {accent};"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 30px; font-weight: 900;"
        )

        sub = QLabel(desc, card)
        sub.setWordWrap(True)
        sub.setStyleSheet(
            "border: none; color: #999;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 18px; font-weight: 500;"
        )

        c_layout.addWidget(icon_label)
        c_layout.addSpacing(8)
        c_layout.addWidget(title)
        c_layout.addWidget(sub)

        return card

    def on_enter(self, data: dict | None = None) -> None:
        mode = getattr(self.state, "mode", "pickup")

        if mode == "deposit":
            self.header_title.setText("CHỌN PHƯƠNG THỨC GỬI ĐỒ")
        else:
            self.header_title.setText("CHỌN PHƯƠNG THỨC NHẬN ĐỒ")

    def _open_pin(self) -> None:
        if self.state.mode == "deposit":
            self.navigate("/otp")
        else:
            self.navigate("/otp-pickup")

    def _open_qr(self) -> None:
        if self.state.mode == "deposit":
            self.navigate("/qr-scan")
        else:
            self.navigate("/qr-scan")

