"""
SuccessScreen — checkmark card with countdown ring and auto-close.
Props: title, subtitle, lockerCode, transactionId, type, autoClose
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
)
from PySide6.QtCore import Qt, QTimer, QEasingCurve, QVariantAnimation, Property
from PySide6.QtGui import QFont, QPainter, QColor, QPen, QPixmap, QPainterPath

from src.theme import BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM, ACCENT_ORANGE, ACCENT_BLUE, ACCENT_GREEN, FONT_FAMILY, RADIUS_MD, RADIUS_LG
from .kiosk_layout import KioskLayout
from .state import STATE


class SuccessScreen(KioskLayout):
    show_back = False

    def __init__(self, nav,
                 title: str = "",
                 subtitle: str = "",
                 locker_code: str = "",
                 transaction_id: str = "",
                 success_type: str = "",
                 auto_close: int = 30,
                 parent=None):
        # Fill from shared STATE when no props given
        stype = success_type or STATE.get("success_type", "deposit")
        self._title      = title or STATE.get("title", "THÀNH CÔNG")
        self._subtitle   = subtitle or STATE.get("subtitle", "")
        self._locker     = locker_code or STATE.get("locker", "")
        self._txid       = transaction_id or STATE.get("txid", "")
        self._type       = stype
        self._auto_close = auto_close
        self._countdown  = auto_close
        self._timer      = None  # initialized in _build_ui

        self._accent = {
            "deposit": ACCENT_ORANGE,
            "pickup":  ACCENT_BLUE,
            "rent":    ACCENT_GREEN,
        }.get(stype, ACCENT_ORANGE)

        super().__init__(nav, parent)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(20, 20, 20, 20)
        lay.setSpacing(12)
        lay.setAlignment(Qt.AlignCenter)

        # Card container
        card = QWidget()
        card.setStyleSheet(f"background:{BG_CARD}; border:1px solid {BG_CARD_BORDER}; border-radius:{RADIUS_LG}px;")
        card_lay = QVBoxLayout(card)
        card_lay.setContentsMargins(24, 20, 24, 20)
        card_lay.setSpacing(12)
        card_lay.setAlignment(Qt.AlignHCenter)

        # Checkmark icon
        check = _CheckmarkWidget(self._accent)
        check.setFixedSize(64, 64)

        # Title
        title_lbl = QLabel(self._title)
        title_lbl.setFont(QFont(FONT_FAMILY, 17, QFont.Bold))
        title_lbl.setStyleSheet(f"color:{self._accent}; letter-spacing:0.5px;")
        title_lbl.setAlignment(Qt.AlignCenter)

        # Subtitle
        if self._subtitle:
            sub_lbl = QLabel(self._subtitle)
            sub_lbl.setFont(QFont(FONT_FAMILY, 11))
            sub_lbl.setStyleSheet(f"color:{FG_MUTED};")
            sub_lbl.setAlignment(Qt.AlignCenter)
            card_lay.addWidget(sub_lbl)

        # Info grid (locker + tx)
        if self._locker or self._txid:
            info_grid = QHBoxLayout()
            info_grid.setSpacing(16)
            info_grid.addStretch()

            if self._locker:
                lock_w = _info_item("MỞ TỦ", self._locker, self._accent, large=True)
                info_grid.addWidget(lock_w)
            if self._txid:
                tx_w = _info_item("MÃ GD", self._txid, FG_PRIMARY)
                info_grid.addWidget(tx_w)

            info_grid.addStretch()
            card_lay.addLayout(info_grid)

        # Countdown ring
        countdown_row = QHBoxLayout()
        countdown_row.setSpacing(10)
        countdown_row.addStretch()

        ring = _CountdownRing(self._accent, self._auto_close, self._auto_close)
        ring.setFixedSize(40, 40)
        self._ring = ring

        cdown_lbl = QLabel("Tự động đóng sau")
        cdown_lbl.setFont(QFont(FONT_FAMILY, 11))
        cdown_lbl.setStyleSheet(f"color:{FG_MUTED};")
        countdown_row.addWidget(ring)
        countdown_row.addWidget(cdown_lbl)
        countdown_row.addStretch()
        card_lay.addLayout(countdown_row)

        # Back button
        back_btn = QPushButton("Quay về màn hình chính")
        back_btn.setFont(QFont(FONT_FAMILY, 12))
        back_btn.setCursor(Qt.PointingHandCursor)
        back_btn.setStyleSheet(f"""
            QPushButton {{
                background: transparent;
                border: 1px solid {BG_CARD_BORDER};
                border-radius: {RADIUS_MD}px;
                color: {FG_MUTED};
                padding: 10px 24px;
            }}
            QPushButton:hover {{ color: {FG_PRIMARY}; }}
        """)
        back_btn.clicked.connect(self._go_home)
        card_lay.addWidget(back_btn)

        lay.addWidget(card)

        # Countdown timer
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._on_tick)

    def showEvent(self, event):
        super().showEvent(event)
        self._countdown = self._auto_close
        if hasattr(self, "_ring"):
            self._ring.reset(self._auto_close)
        self._timer.start(1000)

    def hideEvent(self, event):
        if self._timer is not None:
            self._timer.stop()
        super().hideEvent(event)

    def _on_tick(self) -> None:
        self._countdown -= 1
        if hasattr(self, "_ring"):
            self._ring.step()
        if self._countdown <= 0:
            self._timer.stop()
            self._go_home()

    def _go_home(self) -> None:
        if self.nav:
            self.nav.navigate("/")


# ─── Helper widgets ────────────────────────────────────────────────────────────

def _info_item(label: str, value: str, color: str, large: bool = False) -> QWidget:
    w = QWidget()
    lay = QVBoxLayout(w)
    lay.setContentsMargins(0, 0, 0, 0)
    lay.setSpacing(4)
    lbl = QLabel(label)
    lbl.setFont(QFont(FONT_FAMILY, 10, QFont.Bold))
    lbl.setStyleSheet(f"color:{FG_MUTED}; letter-spacing:1px;")
    val = QLabel(value)
    fs = 22 if large else 13
    val.setFont(QFont(FONT_FAMILY, fs, QFont.Bold))
    val.setStyleSheet(f"color:{color};")
    lay.addWidget(lbl)
    lay.addWidget(val)
    return w


class _CountdownRing(QWidget):
    """Circular countdown ring that animates every second."""
    def __init__(self, color: str, total: int, current: int, parent=None):
        super().__init__(parent)
        self._color = color
        self._total = total
        self._current = current

    def reset(self, total: int) -> None:
        self._total = total
        self._current = total
        self.update()

    def step(self) -> None:
        if self._current > 0:
            self._current -= 1
        self.update()

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)

        # Background circle
        pen = QPen(QColor(self._color).darker(400))
        pen.setWidth(2)
        p.setPen(pen)
        p.drawEllipse(2, 2, 36, 36)

        # Foreground arc
        if self._total > 0:
            frac = self._current / self._total
            pen2 = QPen(QColor(self._color))
            pen2.setWidth(2)
            p.setPen(pen2)
            import math
            start_angle = int(90 * 16)   # -90° = top
            span_angle = int(-frac * 360 * 16)
            p.drawArc(2, 2, 36, 36, start_angle, span_angle)

        # Number text
        p.setPen(QColor(self._color))
        p.drawText(self.rect(), Qt.AlignCenter, str(self._current))
        p.end()


class _CheckmarkWidget(QWidget):
    def __init__(self, color: str, parent=None):
        super().__init__(parent)
        self._color = color

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.Antialiasing)

        # Background circle
        c = QColor(self._color)
        p.setBrush(c.lighter(300).lighter(300))
        p.setPen(QPen(c, 2))
        p.drawEllipse(2, 2, 60, 60)

        # Checkmark
        p.setPen(QPen(c, 3.5))
        p.setBrush(Qt.NoBrush)
        path = QPainterPath()
        path.moveTo(17, 32)
        path.lineTo(27, 42)
        path.lineTo(47, 20)
        p.drawPath(path)
