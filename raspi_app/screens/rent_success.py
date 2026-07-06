from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QLabel, QVBoxLayout, QWidget
from screens.components.theme import SCREEN_WIDTH, SCREEN_HEIGHT, root_style
from screens.components.buttons import PrimaryButton
from screens.components.bottom_action_bar import BottomActionBar
from screens.base import BaseController
from services.formatters import format_expiry, format_pin


class RentSuccessController(BaseController):
    route = "/rent-success"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.pin_label = self.child("lblPinCode", QLabel)
        self.locker_label = self.child("lblLockerInfo", QLabel)
        self.warning_label = self.child("lblPinWarning", QLabel)
        self.set_clickable(self.child("btnOpenNow"), lambda: self.navigate("/locker-open"))
        self.set_clickable(self.child("btnUseLater"), self.go_home)

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        root.setStyleSheet(root_style())

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setContentsMargins(36, 64, 36, 32)
        body.setSpacing(20)
        body.setAlignment(Qt.AlignTop)

        icon_label = QLabel("✅", root)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setFixedHeight(128)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 100px;")
        body.addWidget(icon_label)

        title = QLabel("THUÊ TỦ THÀNH CÔNG", root)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("background: transparent; border: none; color: #2E7D32;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 34px; font-weight: 900;")
        body.addWidget(title)

        pin_card = QFrame(root)
        pin_card.setFixedHeight(200)
        pin_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #2E7D32; border-radius: 28px; }QLabel { background: transparent; }")
        p_layout = QVBoxLayout(pin_card)
        p_layout.setAlignment(Qt.AlignCenter)
        p_layout.setSpacing(10)

        pin_title = QLabel("MÃ PIN", pin_card)
        pin_title.setAlignment(Qt.AlignCenter)
        pin_title.setStyleSheet("border: none; color: #888; font-size: 18px; font-weight: 500;")

        self.pin = QLabel("", pin_card)
        self.pin.setObjectName("lblPinCode")
        self.pin.setAlignment(Qt.AlignCenter)
        self.pin.setStyleSheet("border: none; color: #E8E8E8;font-family: 'Be Vietnam Pro', Arial, sans-serif;font-size: 68px; font-weight: 900; letter-spacing: 14px;")

        p_layout.addWidget(pin_title)
        p_layout.addWidget(self.pin)
        body.addWidget(pin_card)

        self.locker = QLabel("", root)
        self.locker.setObjectName("lblLockerInfo")
        self.locker.setAlignment(Qt.AlignCenter)
        self.locker.setStyleSheet("background: transparent; border: none; color: #E8E8E8;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 700;")
        body.addWidget(self.locker)

        self.warning = QLabel("", root)
        self.warning.setObjectName("lblPinWarning")
        self.warning.setAlignment(Qt.AlignCenter)
        self.warning.setWordWrap(True)
        self.warning.setStyleSheet("background: transparent; border: none; color: #FFB596;font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 600;")
        body.addWidget(self.warning)

        body.addStretch()

        btn_col_widget = QWidget(root)
        btn_col = QVBoxLayout(btn_col_widget)
        btn_col.setContentsMargins(0, 0, 0, 0)
        btn_col.setSpacing(16)

        btn_open = PrimaryButton("MỞ NGAY", object_name="btnOpenNow", parent=btn_col_widget, color="green")
        btn_col.addWidget(btn_open)

        btn_later = PrimaryButton("DÙNG SAU", object_name="btnUseLater", parent=btn_col_widget, color="orange")
        btn_col.addWidget(btn_later)

        body.addWidget(BottomActionBar(btn_col_widget))
        layout.addLayout(body, 1)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if rental is None or compartment is None:
            self.go_home()
            return

        self.pin_label.setText(format_pin(rental.pin))
        size_text = "Tủ nhỏ" if compartment.size == "SMALL" else "Tủ lớn"
        self.locker_label.setText(f"{self._locker_text()} – {size_text}")
        self.warning_label.setText(f"Mã này chỉ có hiệu lực đến {format_expiry(rental.expires_at)}")

    def _locker_text(self) -> str:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if compartment is None:
            return ""
        compartment_name = rental.compartment_name if rental and rental.compartment_name else compartment.name
        if "Ngăn" in compartment_name or compartment.cabinet_name in compartment_name:
            return compartment_name
        return f"{compartment.cabinet_name} – Ngăn {compartment_name}"
