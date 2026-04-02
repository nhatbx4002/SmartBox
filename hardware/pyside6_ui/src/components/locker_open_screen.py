"""
LockerOpenScreen — shown after OTP verify for deposit/pickup.
Displays locker number, countdown, instruction, done button.
"""

import random
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont, QPainter, QColor, QPen, QPainterPath

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM,
    ACCENT_ORANGE, ACCENT_BLUE, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout
from .state import STATE


LOCKER_TIMEOUT = 60  # seconds


class LockerOpenScreen(KioskLayout):
    show_back = False

    def __init__(self, nav,
                 locker: str = None,
                 tx_id: str = None,
                 lock_type: str = "",
                 parent=None):
        ltype  = lock_type  or STATE.get("success_type", "deposit")
        self._locker     = locker or STATE.get("locker", f"L{random.randint(1,8):02d}")
        self._txid       = tx_id  or STATE.get("txid", f"TX{random.randint(10000,99999)}")
        self._type       = ltype  # "deposit" | "pickup"
        self._countdown  = LOCKER_TIMEOUT
        self._accent     = ACCENT_ORANGE if ltype == "deposit" else ACCENT_BLUE
        self._timer      = None  # initialized in _build_ui

        super().__init__(nav, parent)
        self._build_ui()

    def _build_ui(self) -> None:
        is_deposit = self._type == "deposit"
        hint = ("Vui lòng bỏ đồ vào tủ rồi đóng cửa"
                if is_deposit else "Vui lòng lấy đồ ra rồi đóng cửa")

        lay = self.content_layout()
        lay.setContentsMargins(20, 20, 20, 20)
        lay.setSpacing(12)
        lay.setAlignment(Qt.AlignCenter)

        # Icon ring
        icon_lbl = QLabel()
        icon_lbl.setPixmap(_locker_open_icon(self._accent))
        icon_lbl.setFixedSize(96, 96)

        # Title
        title = QLabel("MỞ TỦ THÀNH CÔNG")
        title.setFont(QFont(FONT_FAMILY, 19, QFont.Bold))
        title.setStyleSheet(f"color:{self._accent}; letter-spacing:1px;")
        title.setAlignment(Qt.AlignCenter)

        # Locker number
        locker_lbl = QLabel(f"Tủ {self._locker}")
        locker_lbl.setFont(QFont(FONT_FAMILY, 50, QFont.Bold))
        locker_lbl.setStyleSheet(f"color:{self._accent}; letter-spacing:2px;")
        locker_lbl.setAlignment(Qt.AlignCenter)

        # Hint
        hint_lbl = QLabel(hint)
        hint_lbl.setFont(QFont(FONT_FAMILY, 12))
        hint_lbl.setStyleSheet(f"color:{FG_MUTED};")
        hint_lbl.setAlignment(Qt.AlignCenter)
        hint_lbl.setWordWrap(True)

        # Timer
        self._timer_lbl = QLabel(f"Tủ sẽ tự đóng sau 1:00")
        self._timer_lbl.setFont(QFont(FONT_FAMILY, 11))
        self._timer_lbl.setStyleSheet(f"color:{FG_DIM};")
        self._timer_lbl.setAlignment(Qt.AlignCenter)

        # Done button
        self._done_btn = QPushButton("HOÀN TẤT")
        self._done_btn.setFixedHeight(64)
        self._done_btn.setCursor(Qt.PointingHandCursor)
        self._done_btn.setFont(QFont(FONT(FAMILY, 15, QFont.Bold) if False else QFont(FONT_FAMILY, 15, QFont.Bold)))
        self._done_btn.setStyleSheet(f"""
            QPushButton {{
                background: {self._accent};
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
        self._done_btn.clicked.connect(self._go_home)

        # Tx ID
        tx_lbl = QLabel(f"Mã giao dịch: {self._txid}")
        tx_lbl.setFont(QFont(FONT_FAMILY, 10))
        tx_lbl.setStyleSheet(f"color:{FG_DIM};")
        tx_lbl.setAlignment(Qt.AlignCenter)

        for w in [icon_lbl, title, locker_lbl, hint_lbl, self._timer_lbl,
                  self._done_btn, tx_lbl]:
            lay.addWidget(w, alignment=Qt.AlignCenter)

        # Timer
        self._timer = QTimer(self)

    def showEvent(self, event):
        super().showEvent(event)
        self._countdown = LOCKER_TIMEOUT
        self._timer.timeout.connect(self._on_tick)
        self._timer.start(1000)

    def hideEvent(self, event):
        if self._timer is not None:
            self._timer.stop()
        super().hideEvent(event)

    def _on_tick(self) -> None:
        self._countdown -= 1
        if self._countdown <= 0:
            self._timer.stop()
            self._go_home()
            return
        m = self._countdown // 60
        s = self._countdown % 60
        self._timer_lbl.setText(f"Tủ sẽ tự đóng sau {m}:{s:02d}")

    def _go_home(self) -> None:
        if self.nav:
            self.nav.navigate("/")


def _locker_open_icon(color: str) -> "QPixmap":
    from PySide6.QtGui import QPainter, QColor, QPen, QPainterPath
    from PySide6.QtGui import QPixmap
    pm = QPixmap(96, 96)
    pm.fill(QColor(0,0,0,0))
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    c = QColor(color)
    # Ring
    p.setBrush(QColor(color).lighter(150))
    p.setPen(QPen(c, 3))
    p.drawEllipse(4, 4, 88, 88)
    # Locker outline
    pen = QPen(c, 2.5)
    p.setPen(pen)
    p.drawRect(18, 18, 60, 54)
    p.drawLine(18, 38, 78, 38)
    p.drawLine(48, 38, 48, 18)
    p.drawLine(26, 18, 70, 18)
    p.drawRect(38, 44, 20, 12)
    p.drawEllipse(52, 48, 4, 4)
    p.drawLine(38, 50, 34, 50)
    p.drawLine(58, 50, 54, 50)
    p.end()
    return pm
