from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
from services.formatters import format_pin


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
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setContentsMargins(32, 60, 32, 0)
        body.setSpacing(16)
        body.setAlignment(Qt.AlignTop)

        icon_label = QLabel("✅", root)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setFixedHeight(120)
        icon_label.setStyleSheet("background: transparent; border: none; font-size: 100px;")
        body.addWidget(icon_label)

        title = QLabel("THUÊ TỦ THÀNH CÔNG", root)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("background: transparent; border: none; color: #2E7D32; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 32px; font-weight: 900;")
        body.addWidget(title)

        pin_card = QFrame(root)
        pin_card.setFixedHeight(160)
        pin_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #2E7D32; border-radius: 24px; } QLabel { background: transparent; }")
        p_layout = QVBoxLayout(pin_card)
        p_layout.setAlignment(Qt.AlignCenter)

        pin_title = QLabel("MÃ PIN", pin_card)
        pin_title.setAlignment(Qt.AlignCenter)
        pin_title.setStyleSheet("border: none; color: #888; font-size: 18px; font-weight: 500;")

        self.pin = QLabel("", pin_card)
        self.pin.setObjectName("lblPinCode")
        self.pin.setAlignment(Qt.AlignCenter)
        self.pin.setStyleSheet("border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 60px; font-weight: 900; letter-spacing: 12px;")

        p_layout.addWidget(pin_title)
        p_layout.addWidget(self.pin)
        body.addWidget(pin_card)

        self.locker = QLabel("", root)
        self.locker.setObjectName("lblLockerInfo")
        self.locker.setAlignment(Qt.AlignCenter)
        self.locker.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 700;")
        body.addWidget(self.locker)

        self.warning = QLabel("", root)
        self.warning.setObjectName("lblPinWarning")
        self.warning.setAlignment(Qt.AlignCenter)
        self.warning.setWordWrap(True)
        self.warning.setStyleSheet("background: transparent; border: none; color: #FFB596; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 600;")
        body.addWidget(self.warning)

        body.addStretch()

        btn_row = QHBoxLayout()
        btn_row.setSpacing(16)

        btn_open = QPushButton("MỞ NGAY")
        btn_open.setObjectName("btnOpenNow")
        btn_open.setFixedHeight(88)
        btn_open.setCursor(Qt.PointingHandCursor)
        btn_open.setStyleSheet("QPushButton { background-color: #2E7D32; color: white; border: none; border-radius: 18px; font-size: 24px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }")
        btn_row.addWidget(btn_open, stretch=1)

        btn_later = QPushButton("DÙNG SAU")
        btn_later.setObjectName("btnUseLater")
        btn_later.setFixedHeight(88)
        btn_later.setCursor(Qt.PointingHandCursor)
        btn_later.setStyleSheet("QPushButton { background-color: #333; color: white; border: 2px solid #666; border-radius: 18px; font-size: 24px; font-weight: 700; font-family: 'Be Vietnam Pro', Arial, sans-serif; }")
        btn_row.addWidget(btn_later, stretch=1)

        body.addLayout(btn_row)
        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if rental is None or compartment is None:
            self.go_home()
            return

        self.pin_label.setText(format_pin(rental.pin))

        size_text = "Tủ nhỏ" if compartment.size == "SMALL" else "Tủ lớn"
        self.locker_label.setText(f"{self._locker_text()} - {size_text}")

        self.warning_label.setText(
            f"Mã này chỉ có hiệu lực đến {rental.expires_at}"
        )

    def _locker_text(self) -> str:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if compartment is None:
            return ""
        compartment_name = rental.compartment_name if rental and rental.compartment_name else compartment.name
        if "Ngăn" in compartment_name or compartment.locker_name in compartment_name:
            return compartment_name
        return f"{compartment.locker_name} - Ngăn {compartment_name}"
