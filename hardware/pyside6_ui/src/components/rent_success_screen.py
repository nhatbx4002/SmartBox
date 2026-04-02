"""
RentSuccessScreen — two-phase: locker open → OTP result.
Routes: /rent-locker → / (home) after completion.
"""

import random
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont, QPainter, QColor, QPen, QPainterPath

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM,
    ACCENT_ORANGE, ACCENT_GREEN, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


LOCKER_TIMEOUT = 120  # seconds


class RentSuccessScreen(KioskLayout):
    show_back = False

    def __init__(self, nav, parent=None):
        self._locker = f"L{random.randint(1, 6):02d}"
        self._otp = str(random.randint(100000, 999999))
        self._txid = f"RT{random.randint(10000, 99999)}"
        self._countdown = LOCKER_TIMEOUT
        self._show_otp = False
        self._timer = QTimer()

        super().__init__(nav, parent)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(20, 20, 20, 20)
        lay.setSpacing(12)
        lay.setAlignment(Qt.AlignCenter)

        # Locker icon
        icon_lbl = QLabel()
        icon_lbl.setPixmap(_locker_icon(ACCENT_GREEN))
        icon_lbl.setFixedSize(80, 80)

        # Title
        title_lbl = QLabel("MỞ TỦ THÀNH CÔNG")
        title_lbl.setFont(QFont(FONT_FAMILY, 20, QFont.Bold))
        title_lbl.setStyleSheet(f"color:{ACCENT_GREEN}; letter-spacing:1px;")
        title_lbl.setAlignment(Qt.AlignCenter)

        # Locker number
        self._locker_lbl = QLabel(f"Tủ {self._locker}")
        self._locker_lbl.setFont(QFont(FONT_FAMILY, 46, QFont.Bold))
        self._locker_lbl.setStyleSheet(f"color:{ACCENT_GREEN};")
        self._locker_lbl.setAlignment(Qt.AlignCenter)

        # Hint
        hint_lbl = QLabel("Vui lòng bỏ đồ vào tủ")
        hint_lbl.setFont(QFont(FONT_FAMILY, 13))
        hint_lbl.setStyleSheet(f"color:{FG_MUTED};")
        hint_lbl.setAlignment(Qt.AlignCenter)

        # Done button
        self._done_btn = QPushButton("✓  HOÀN TẤT - ĐÃ BỎ ĐỒ VÀO TỦ")
        self._done_btn.setFixedHeight(64)
        self._done_btn.setCursor(Qt.PointingHandCursor)
        self._done_btn.setFont(QFont(FONT_FAMILY, 14, QFont.Bold))
        self._done_btn.setStyleSheet(f"""
            QPushButton {{
                background: {ACCENT_GREEN};
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #fff;
                font-family: {FONT_FAMILY};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }}
            QPushButton:hover {{ opacity: 0.85; }}
        """)
        self._done_btn.clicked.connect(self._show_otp_result)

        # Timer
        self._timer_lbl = QLabel()
        self._timer_lbl.setFont(QFont(FONT_FAMILY, 11))
        self._timer_lbl.setStyleSheet(f"color:{FG_DIM};")
        self._timer_lbl.setAlignment(Qt.AlignCenter)

        for w in [icon_lbl, title_lbl, self._locker_lbl, hint_lbl, self._done_btn, self._timer_lbl]:
            lay.addWidget(w, alignment=Qt.AlignCenter)

    def showEvent(self, event):
        super().showEvent(event)
        self._show_otp = False
        self._countdown = LOCKER_TIMEOUT
        self._timer_lbl.setText(f"Tủ sẽ tự đóng sau 2:00")
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
            self._show_otp_result()
            return
        m = self._countdown // 60
        s = self._countdown % 60
        self._timer_lbl.setText(f"Tủ sẽ tự đóng sau {m}:{s:02d}")

    def _show_otp_result(self) -> None:
        self._timer.stop()
        self._show_otp = True
        # Rebuild content area with OTP result
        self._build_otp_result_ui()

    def _build_otp_result_ui(self) -> None:
        # Remove all widgets from content
        content = self._content
        while content.layout().count():
            child = content.layout().takeAt(0)
            if child.widget():
                child.widget().deleteLater()

        lay = self.content_layout()
        lay.setContentsMargins(20, 20, 20, 20)
        lay.setSpacing(12)
        lay.setAlignment(Qt.AlignCenter)

        # Check icon
        icon = QLabel()
        icon.setPixmap(_checkmark_icon())
        icon.setFixedSize(56, 56)

        # Title
        t = QLabel("THUÊ TỦ THÀNH CÔNG")
        t.setFont(QFont(FONT_FAMILY, 17, QFont.Bold))
        t.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:1px;")
        t.setAlignment(Qt.AlignCenter)

        # Locker
        l = QLabel(f"Tủ {self._locker}")
        l.setFont(QFont(FONT_FAMILY, 14))
        l.setStyleSheet(f"color:{FG_MUTED};")
        l.setAlignment(Qt.AlignCenter)

        # OTP card
        otp_card = QWidget()
        otp_card.setStyleSheet(f"background:{BG_CARD}; border:1.5px solid {BG_CARD_BORDER}; border-radius:{RADIUS_LG}px;")
        otp_lay = QVBoxLayout(otp_card)
        otp_lay.setContentsMargins(20, 16, 20, 16)
        otp_lay.setSpacing(6)
        otp_lay.setAlignment(Qt.AlignCenter)

        lbl = QLabel("MÃ OTP LẤY ĐỒ")
        lbl.setFont(QFont(FONT_FAMILY, 11, QFont.Bold))
        lbl.setStyleSheet(f"color:{FG_MUTED}; letter-spacing:1px;")
        lbl.setAlignment(Qt.AlignCenter)

        otp_val = QLabel(self._otp)
        otp_val.setFont(QFont(FONT_FAMILY, 34, QFont.Bold))
        otp_val.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:4px;")
        otp_val.setAlignment(Qt.AlignCenter)

        desc = QLabel("Lưu lại mã này để lấy đồ lần sau")
        desc.setFont(QFont(FONT_FAMILY, 10))
        desc.setStyleSheet(f"color:#666;")
        desc.setAlignment(Qt.AlignCenter)

        otp_lay.addWidget(lbl)
        otp_lay.addWidget(otp_val)
        otp_lay.addWidget(desc)

        # Reminder
        reminder = QWidget()
        reminder.setStyleSheet(f"background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:{RADIUS_MD}px; padding:10px 16px;")
        rem_lay = QHBoxLayout(reminder)
        rem_lay.setContentsMargins(0, 0, 0, 0)
        rem_lay.setSpacing(8)
        rem_lay.addWidget(QLabel("⚠"))
        warn = QLabel("Lưu lại mã OTP này để lấy đồ lần sau")
        warn.setFont(QFont(FONT_FAMILY, 11, QFont.Bold))
        warn.setStyleSheet("color:#f59e0b;")
        warn_lay = QVBoxLayout()
        warn_lay.addWidget(warn)
        rem_lay.addLayout(warn_lay)
        rem_lay.addStretch()

        # Tx id
        tx = QLabel(f"Mã giao dịch: {self._txid}")
        tx.setFont(QFont(FONT_FAMILY, 10))
        tx.setStyleSheet(f"color:{FG_DIM};")
        tx.setAlignment(Qt.AlignCenter)

        # Back button
        back_btn = QPushButton("QUAY VỀ MÀN HÌNH CHÍNH")
        back_btn.setFixedHeight(56)
        back_btn.setCursor(Qt.PointingHandCursor)
        back_btn.setFont(QFont(FONT_FAMILY, 13, QFont.Bold))
        back_btn.setStyleSheet(f"""
            QPushButton {{
                background: {ACCENT_ORANGE};
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #fff;
                font-family: {FONT_FAMILY};
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
            QPushButton:hover {{ opacity: 0.85; }}
        """)
        back_btn.clicked.connect(lambda: self.nav.navigate("/") if self.nav else None)

        for w in [icon, t, l, otp_card, reminder, tx, back_btn]:
            lay.addWidget(w, alignment=Qt.AlignCenter)


def _locker_icon(color: str) -> "QPixmap":
    from PySide6.QtGui import QPainter, QColor, QPen, QPainterPath
    pm = __import__("PySide6.QtGui", fromlist=["QPixmap"]).QPixmap(80, 80)
    pm.fill(QColor(0,0,0,0))
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    c = QColor(color)
    pen = QPen(c, 3)
    p.setPen(pen)
    p.drawRect(8, 12, 64, 60)
    p.drawLine(8, 34, 72, 34)
    p.drawLine(40, 34, 40, 12)
    p.drawLine(20, 12, 60, 12)
    p.setPen(QPen(c, 2))
    p.drawRect(30, 38, 20, 14)
    p.drawEllipse(44, 43, 4, 4)
    p.drawLine(30, 45, 26, 45)
    p.drawLine(54, 45, 50, 45)
    p.end()
    return pm


def _checkmark_icon() -> "QPixmap":
    from PySide6.QtGui import QPainter, QColor, QPen, QPainterPath, QPixmap
    pm = QPixmap(56, 56)
    pm.fill(QColor(0,0,0,0))
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    c = QColor(ACCENT_ORANGE)
    p.setBrush(c.lighter(300))
    p.setPen(QPen(c, 2))
    p.drawEllipse(2, 2, 52, 52)
    p.setPen(QPen(c, 3.5))
    p.setBrush(QColor(0,0,0,0))
    path = QPainterPath()
    path.moveTo(15, 28)
    path.lineTo(24, 38)
    path.lineTo(41, 18)
    p.drawPath(path)
    p.end()
    return pm
