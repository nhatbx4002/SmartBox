"""
SizeSelectScreen — select locker size (small / medium / large / xlarge).
Included from the React SizeSelectScreen.tsx — may be used by deposit flow.
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QGridLayout,
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

from src.theme import (
    BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED,
    ACCENT_ORANGE, SIZE_COLORS, SIZE_LABELS, SIZE_PRICES, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


SIZES = ["small", "medium", "large", "xlarge"]


class SizeSelectScreen(KioskLayout):
    show_back = True

    def __init__(self, nav, parent=None):
        self._selected = None
        super().__init__(nav, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(14, 12, 14, 12)
        lay.setSpacing(12)

        # Header
        h = QHBoxLayout()
        h.setSpacing(10)
        bar = QWidget()
        bar.setFixedSize(4, 20)
        bar.setStyleSheet(f"background:{ACCENT_ORANGE}; border-radius:2px;")
        title = QLabel("CHỌN KÍCH THƯỚC TỦ")
        title.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        title.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:0.5px;")
        h.addWidget(bar)
        h.addWidget(title)
        h.addStretch()
        lay.addLayout(h)

        # 2x2 grid
        grid = QGridLayout()
        grid.setSpacing(10)
        self._size_btns: list[QWidget] = []
        for i, size in enumerate(SIZES):
            btn = _SizeCard(size, self._on_select)
            grid.addWidget(btn, i // 2, i % 2)
            self._size_btns.append(btn)
        lay.addLayout(grid)

        # Confirm button
        self._confirm_btn = QPushButton("TIẾP TỤC")
        self._confirm_btn.setFixedHeight(60)
        self._confirm_btn.setCursor(Qt.PointingHandCursor)
        self._confirm_btn.setFont(QFont(FONT_FAMILY, 14, QFont.Bold))
        self._confirm_btn.setStyleSheet(self._btn_disabled_style())
        self._confirm_btn.clicked.connect(self._on_confirm)
        lay.addWidget(self._confirm_btn)

    def _btn_disabled_style(self) -> str:
        return f"""
            QPushButton {{
                background: #222;
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #444;
                font-family: {FONT_FAMILY};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
        """

    def _btn_ready_style(self) -> str:
        return f"""
            QPushButton {{
                background: {ACCENT_ORANGE};
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #fff;
                font-family: {FONT_FAMILY};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
        """

    def _on_select(self, size: str) -> None:
        self._selected = size
        for btn in self._size_btns:
            btn.update_selected(btn._size == size)
        self._confirm_btn.setStyleSheet(self._btn_ready_style())

    def _on_confirm(self) -> None:
        if not self._selected or not self.nav:
            return
        # Continue to OTP
        self.nav.navigate("/otp/deposit")


class _SizeCard(QWidget):
    def __init__(self, size: str, on_select, parent=None):
        super().__init__(parent)
        self._size = size
        self._on_select = on_select
        self._selected = False
        self._build_ui()

    def _build_ui(self) -> None:
        color = SIZE_COLORS[size]
        label = SIZE_LABELS[size]
        price = SIZE_PRICES[size]
        self.setCursor(Qt.PointingHandCursor)
        self._update_style(color)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(12, 12, 12, 12)
        lay.setSpacing(6)
        lay.setAlignment(Qt.AlignCenter)

        lbl = QLabel(label)
        lbl.setFont(QFont(FONT_FAMILY, 12, QFont.Bold))
        lbl.setStyleSheet(f"color:{FG_PRIMARY}; letter-spacing:0.5px;")
        lbl.setAlignment(Qt.AlignCenter)

        price_lbl = QLabel(price)
        price_lbl.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        price_lbl.setStyleSheet(f"color:{color};")
        price_lbl.setAlignment(Qt.AlignCenter)

        self._check = QLabel("✓")
        self._check.setFont(QFont(FONT_FAMILY, 14))
        self._check.setStyleSheet(f"color:{color};")
        self._check.setAlignment(Qt.AlignCenter)
        self._check.hide()

        lay.addWidget(lbl)
        lay.addWidget(price_lbl)
        lay.addWidget(self._check)

    def _update_style(self, color: str) -> None:
        border = color if self._selected else BG_CARD_BORDER
        self.setStyleSheet(f"""
            QWidget {{
                background: {BG_CARD};
                border: 1.5px solid {border};
                border-radius: {RADIUS_LG}px;
            }}
        """)

    def update_selected(self, selected: bool) -> None:
        self._selected = selected
        color = SIZE_COLORS[self._size]
        self._update_style(color)
        self._check.setVisible(selected)

    def mousePressEvent(self, e):
        self._on_select(self._size)
