"""
KioskLayout — shared header + footer + clock.
All screen widgets inherit from this so they get the same chrome.
"""

from datetime import datetime
from PySide6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout, QLabel, QPushButton
from PySide6.QtCore import QTimer, Qt
from PySide6.QtGui import QFont

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, BG_HEADER, BG_HEADER_BORDER,
    FG_PRIMARY, FG_MUTED, FG_DIM, ACCENT_ORANGE,
    HEADER_H, FOOTER_H,
    FONT_FAMILY,
)


class KioskLayout(QWidget):
    """
    Base widget for every screen.
    Contains:
      header  — back button (optional) + brand + clock
      content  — fill the remaining space (subclass puts content here)
      footer   — version + warning
    """

    # True → show back button in header
    show_back: bool = False

    def __init__(self, nav=None, parent=None):
        super().__init__(parent)
        self.nav = nav
        self._setup_ui()

        # Live clock
        self._clock_timer = QTimer(self)
        self._clock_timer.timeout.connect(self._update_clock)
        self._clock_timer.start(1000)
        self._update_clock()

    def hideEvent(self, event):
        """Override: subclasses can stop their timers here."""
        super().hideEvent(event)

    # ── Public API ─────────────────────────────────────────────────────────────

    def set_back_visible(self, visible: bool) -> None:
        self._back_btn.setVisible(visible)

    # ── Internal ───────────────────────────────────────────────────────────────

    def _setup_ui(self) -> None:
        self.setStyleSheet(f"background:{BG_ROOT};")
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # ── Header ────────────────────────────────────────────────────────────
        self._header = QWidget()
        self._header.setFixedHeight(HEADER_H)
        self._header.setStyleSheet(f"background:{BG_HEADER}; border-bottom:1px solid {BG_HEADER_BORDER};")
        hlay = QHBoxLayout(self._header)
        hlay.setContentsMargins(16, 0, 16, 0)

        # Left: back + brand
        left = QWidget()
        leftLay = QHBoxLayout(left)
        leftLay.setContentsMargins(0, 0, 0, 0)
        leftLay.setSpacing(10)
        leftLay.setAlignment(Qt.AlignLeft | Qt.AlignVCenter)

        self._back_btn = QPushButton("← Quay lại")
        self._back_btn.setFixedHeight(32)
        self._back_btn.setCursor(Qt.PointingHandCursor)
        self._back_btn.setStyleSheet(self._back_btn_style())
        self._back_btn.clicked.connect(self._on_back)
        leftLay.addWidget(self._back_btn)
        self._back_btn.setVisible(self.show_back)

        brand = QLabel("📦 SmartBox")
        brand.setFont(QFont(FONT_FAMILY, 13, QFont.Bold))
        brand.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:0.5px;")
        leftLay.addWidget(brand)

        hlay.addWidget(left)

        # Right: clock
        right = QWidget()
        rlay = QHBoxLayout(right)
        rlay.setContentsMargins(0, 0, 0, 0)
        rlay.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        clock_box = QWidget()
        clock_box_lay = QVBoxLayout(clock_box)
        clock_box_lay.setContentsMargins(0, 0, 0, 0)
        clock_box_lay.setSpacing(0)
        clock_box_lay.setAlignment(Qt.AlignRight)

        self._clock_time = QLabel()
        self._clock_time.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        self._clock_time.setStyleSheet(f"color:{FG_PRIMARY};")
        self._clock_time.setAlignment(Qt.AlignRight)

        self._clock_date = QLabel()
        self._clock_date.setFont(QFont(FONT_FAMILY, 11))
        self._clock_date.setStyleSheet(f"color:{FG_DIM};")
        self._clock_date.setAlignment(Qt.AlignRight)

        clock_box_lay.addWidget(self._clock_time)
        clock_box_lay.addWidget(self._clock_date)
        rlay.addWidget(clock_box)
        hlay.addWidget(right)

        root.addWidget(self._header)

        # ── Content (subclass hook) ──────────────────────────────────────────
        self._content = QWidget()
        self._content.setStyleSheet(f"background:{BG_ROOT};")
        content_lay = QVBoxLayout(self._content)
        content_lay.setContentsMargins(0, 0, 0, 0)
        content_lay.setSpacing(0)
        root.addWidget(self._content)

        # ── Footer ───────────────────────────────────────────────────────────
        footer = QWidget()
        footer.setFixedHeight(FOOTER_H)
        footer.setStyleSheet(f"background:{BG_HEADER}; border-top:1px solid {BG_HEADER_BORDER};")
        flay = QHBoxLayout(footer)
        flay.setContentsMargins(16, 0, 16, 0)

        term = QLabel("SmartBox v1.0")
        term.setFont(QFont(FONT_FAMILY, 12, QFont.Bold))
        term.setStyleSheet(f"color:{ACCENT_ORANGE};")

        warn = QLabel("Không để đồ quý giá trong tủ")
        warn.setFont(QFont(FONT_FAMILY, 12))
        warn.setStyleSheet(f"color:{FG_DIM};")

        flay.addWidget(term)
        flay.addStretch()
        flay.addWidget(warn)

        root.addWidget(footer)

    def _back_btn_style(self) -> str:
        return f"""
            QPushButton {{
                background: transparent;
                border: 1px solid {BG_CARD_BORDER};
                border-radius: 8px;
                color: {FG_MUTED};
                font-family: {FONT_FAMILY};
                font-size: 13px;
                font-weight: 600;
                padding: 6px 14px;
            }}
            QPushButton:hover {{
                border-color: {FG_MUTED};
                color: {FG_PRIMARY};
            }}
        """

    def _update_clock(self) -> None:
        now = datetime.now()
        self._clock_time.setText(now.strftime("%H:%M"))
        self._clock_date.setText(now.strftime("%d/%m/%Y"))

    def _on_back(self) -> None:
        if self.nav:
            self.nav.back()

    # ── Subclass hook: get the content area to fill ────────────────────────────
    def content_layout(self) -> QVBoxLayout:
        """Return the layout inside the content widget. Override to add widgets."""
        return self._content.layout()
