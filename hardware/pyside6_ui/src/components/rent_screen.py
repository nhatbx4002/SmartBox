"""
RentScreen — plan selection (1 / 3 / 6 tháng).
Routes: /rent → /rent-phone
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QGridLayout,
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED,
    ACCENT_ORANGE, FONT_FAMILY, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


PLANS = [
    {"id": "1m", "label": "1 THÁNG", "price": "150.000đ", "popular": False, "color": "#3B82F6"},
    {"id": "3m", "label": "3 THÁNG", "price": "400.000đ", "popular": True,  "color": ACCENT_ORANGE},
    {"id": "6m", "label": "6 THÁNG", "price": "720.000đ", "popular": False, "color": "#4CAF50"},
]


class RentScreen(KioskLayout):
    show_back = True

    def __init__(self, nav, parent=None):
        super().__init__(nav, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(14, 12, 14, 12)
        lay.setSpacing(12)

        # Header
        header = QHBoxLayout()
        header.setSpacing(10)
        bar = QWidget()
        bar.setFixedSize(4, 20)
        bar.setStyleSheet(f"background:{ACCENT_ORANGE}; border-radius:2px;")
        title = QLabel("THUÊ TỦ MỚI")
        title.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        title.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:1px;")
        sub = QLabel("Chọn gói thuê")
        sub.setFont(QFont(FONT_FAMILY, 11))
        sub.setStyleSheet(f"color:{FG_MUTED};")
        header.addWidget(bar)
        header.addWidget(title)
        header.addWidget(sub)
        header.addStretch()
        lay.addLayout(header)

        # Plan cards grid 3-column
        grid = QGridLayout()
        grid.setSpacing(10)
        for i, plan in enumerate(PLANS):
            card = _PlanCard(plan, self.nav)
            grid.addWidget(card, 0, i)
        lay.addLayout(grid)


class _PlanCard(QWidget):
    def __init__(self, plan: dict, router, parent=None):
        super().__init__(parent)
        self._plan = plan
        self._router = router
        self._build_ui()

    def _build_ui(self) -> None:
        color = self._plan["color"]
        self.setCursor(Qt.PointingHandCursor)

        border = f"rgba(255,102,0,0.5)" if self._plan["popular"] else BG_CARD_BORDER

        self.setStyleSheet(f"""
            QWidget {{
                background: {BG_CARD};
                border: 1.5px solid {border};
                border-radius: {RADIUS_LG}px;
            }}
            QWidget:hover {{ border: 1.5px solid {color}; }}
        """)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(16, 16, 16, 16)
        lay.setSpacing(8)
        lay.setAlignment(Qt.AlignCenter)

        # Popular badge
        if self._plan["popular"]:
            badge = QLabel("PHỔ BIẾN")
            badge.setFont(QFont(FONT_FAMILY, 9, QFont.Bold))
            badge.setStyleSheet(f"""
                color:{ACCENT_ORANGE};
                background:rgba(255,102,0,0.15);
                border:1px solid rgba(255,102,0,0.3);
                border-radius:4px;
                padding:2px 6px;
            """)
            badge_lay = QHBoxLayout()
            badge_lay.addStretch()
            badge_lay.addWidget(badge)
            lay.addLayout(badge_lay)

        label_lbl = QLabel(self._plan["label"])
        label_lbl.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        label_lbl.setStyleSheet(f"color:{FG_PRIMARY}; letter-spacing:1px;")
        label_lbl.setAlignment(Qt.AlignCenter)

        price_lbl = QLabel(self._plan["price"])
        price_lbl.setFont(QFont(FONT_FAMILY, 19, QFont.Bold))
        price_lbl.setStyleSheet(f"color:{FG_PRIMARY};")
        price_lbl.setAlignment(Qt.AlignCenter)

        per_lbl = QLabel("/tháng")
        per_lbl.setFont(QFont(FONT_FAMILY, 11))
        per_lbl.setStyleSheet(f"color:{FG_MUTED};")
        per_lbl.setAlignment(Qt.AlignCenter)

        lay.addWidget(label_lbl)
        lay.addWidget(price_lbl)
        lay.addWidget(per_lbl)

    def mousePressEvent(self, e):
        if self._router:
            self._router.navigate("/rent-phone")
