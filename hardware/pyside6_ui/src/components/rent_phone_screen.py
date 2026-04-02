"""
RentPhoneScreen — phone number input (mocked for now).
Routes: /rent-phone → /payment
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

from src.theme import (
    BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM,
    ACCENT_ORANGE, ACCENT_GREEN, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


class RentPhoneScreen(KioskLayout):
    show_back = True

    def __init__(self, nav, parent=None):
        super().__init__(nav, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(16, 14, 16, 20)
        lay.setSpacing(16)

        # Header
        h = QHBoxLayout()
        h.setSpacing(10)
        bar = QWidget()
        bar.setFixedSize(4, 20)
        bar.setStyleSheet(f"background:{ACCENT_ORANGE}; border-radius:2px;")
        title = QLabel("THUÊ TỦ")
        title.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        title.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:1px;")
        sub = QLabel("Nhập số điện thoại")
        sub.setFont(QFont(FONT_FAMILY, 11))
        sub.setStyleSheet(f"color:{FG_MUTED};")
        h.addWidget(bar)
        h.addWidget(title)
        h.addWidget(sub)
        h.addStretch()
        lay.addLayout(h)

        lay.addStretch()

        # Input area
        area = QWidget()
        area_lay = QVBoxLayout(area)
        area_lay.setSpacing(12)
        area_lay.setAlignment(Qt.AlignCenter)

        hint = QLabel("Số điện thoại nhận hợp đồng")
        hint.setFont(QFont(FONT_FAMILY, 12))
        hint.setStyleSheet(f"color:{FG_MUTED};")
        hint.setAlignment(Qt.AlignCenter)
        area_lay.addWidget(hint)

        # Display
        display = QWidget()
        display.setStyleSheet(f"""
            background:{BG_CARD};
            border: 2px solid {BG_CARD_BORDER};
            border-radius: {RADIUS_MD}px;
            padding: 16px 24px;
        """)
        disp_lay = QHBoxLayout(display)
        disp_lay.setSpacing(6)
        disp_lay.setContentsMargins(0, 0, 0, 0)

        prefix = QLabel("+84")
        prefix.setFont(QFont(FONT_FAMILY, 20, QFont.Bold))
        prefix.setStyleSheet(f"color:{FG_DIM};")
        disp_lay.addWidget(prefix)

        digits = "0901234567"
        for c in digits:
            lbl = QLabel(c)
            lbl.setFont(QFont(FONT_FAMILY, 24, QFont.Bold))
            lbl.setStyleSheet(f"color:{FG_PRIMARY};")
            disp_lay.addWidget(lbl)

        area_lay.addWidget(display)

        hint2 = QLabel("✓ Đã nhập 10 số")
        hint2.setFont(QFont(FONT_FAMILY, 11))
        hint2.setStyleSheet(f"color:#4CAF50;")
        hint2.setAlignment(Qt.AlignCenter)
        area_lay.addWidget(hint2)

        lay.addWidget(area)
        lay.addStretch()

        # Confirm button
        btn = QPushButton("TIẾP TỤC THANH TOÁN")
        btn.setFixedHeight(64)
        btn.setCursor(Qt.PointingHandCursor)
        btn.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        btn.setStyleSheet(f"""
            QPushButton {{
                background: {ACCENT_GREEN};
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #fff;
                font-family: {FONT_FAMILY};
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
            QPushButton:hover {{ opacity: 0.85; }}
        """)
        btn.clicked.connect(lambda: self.nav.navigate("/payment") if self.nav else None)
        lay.addWidget(btn)
