"""
HomeScreen — bento grid 2x2.
Routes: /otp/deposit  /otp/pickup  /rent  /support
"""

from PySide6.QtWidgets import (
    QWidget, QGridLayout, QVBoxLayout, QPushButton,
    QLabel, QSizePolicy, QSpacerItem,
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont, QPainter, QColor, QPaintEvent

from theme import BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, ACCENT_ORANGE, ACCENT_BLUE, ACCENT_GREEN, FONT_FAMILY, RADIUS_LG
from .kiosk_layout import KioskLayout


class HomeScreen(KioskLayout):
    show_back = False

    def __init__(self, router, parent=None):
        super().__init__(router, parent)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(14, 12, 14, 12)
        lay.setSpacing(10)

        # Two rows of two cards
        grid = QGridLayout()
        grid.setSpacing(10)

        grid.addWidget(self._make_card("GỬI HÀNG", "Nhập mã OTP, bỏ đồ vào tủ",
                                        ACCENT_ORANGE, "#000",
                                        lambda: self.nav.navigate("/otp/deposit"),
                                        _deposit_icon()), 0, 0)

        grid.addWidget(self._make_card("NHẬN HÀNG", "Nhập mã OTP, lấy đồ ra",
                                        ACCENT_BLUE, "#fff",
                                        lambda: self.nav.navigate("/otp/pickup"),
                                        _pickup_icon()), 0, 1)

        grid.addWidget(self._make_card("THUÊ TỦ", "Gói từ 1 tháng trở lên",
                                        ACCENT_GREEN, "#fff",
                                        lambda: self.nav.navigate("/rent"),
                                        _rent_icon()), 1, 0)

        grid.addWidget(self._make_card("HỖ TRỢ", "FAQ & Hotline 24/7",
                                        "#1A1A1A", "#fff",
                                        lambda: self.nav.navigate("/support"),
                                        _support_icon(),
                                        border_color=BG_CARD_BORDER), 1, 1)

        lay.addLayout(grid)

    def _make_card(self, title: str, desc: str,
                   bg: str, fg: str,
                   on_click, icon_pixmap,
                   border_color: str = "transparent") -> QWidget:
        w = QWidget()
        w.setAttribute(Qt.WA_Hover, True)
        w.setCursor(Qt.PointingHandCursor)

        style = f"""
            QWidget {{
                background: {bg};
                border-radius: {RADIUS_LG}px;
                {"border: 1.5px solid " + border_color if border_color != "transparent" else ""}
            }}
        """
        w.setStyleSheet(style)

        lay = QVBoxLayout(w)
        lay.setContentsMargins(16, 16, 16, 16)
        lay.setSpacing(8)
        lay.setAlignment(Qt.AlignCenter)

        icon_lbl = QLabel()
        icon_lbl.setPixmap(icon_pixmap)
        icon_lbl.setAlignment(Qt.AlignCenter)

        title_lbl = QLabel(title)
        title_lbl.setFont(QFont(FONT_FAMILY, 17, QFont.Bold))
        title_lbl.setStyleSheet(f"color:{fg}; letter-spacing:1px;")
        title_lbl.setAlignment(Qt.AlignCenter)

        desc_lbl = QLabel(desc)
        desc_lbl.setFont(QFont(FONT_FAMILY, 10))
        desc_lbl.setStyleSheet(f"color:{fg}; opacity:0.7;")
        desc_lbl.setAlignment(Qt.AlignCenter)

        lay.addWidget(icon_lbl)
        lay.addWidget(title_lbl)
        lay.addWidget(desc_lbl)

        w.mousePressEvent = lambda e, fn=on_click: fn()
        return w


# ─── SVG-like icons drawn with QPainter ──────────────────────────────────────

def _deposit_icon() -> "QPixmap":
    """Box with up-arrow: deposit"""
    from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
    pm = QPixmap(52, 52)
    pm.fill(QColor(0, 0, 0, 0))
    p = QPainter(pm)
    p.setPen(QPen(QColor(0, 0, 0), 2.5))
    # box
    p.drawRect(6, 14, 36, 28)
    p.drawLine(6, 24, 42, 24)
    # arrow up
    p.drawLine(24, 14, 24, 4)
    p.drawLine(16, 4, 32, 4)
    p.drawLine(24, 4, 16, 10)
    p.end()
    return pm

def _pickup_icon() -> "QPixmap":
    """Box with down-arrow: pickup"""
    from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
    pm = QPixmap(52, 52)
    pm.fill(QColor(0, 0, 0, 0))
    p = QPainter(pm)
    p.setPen(QPen(QColor(255, 255, 255), 2.5))
    p.drawRect(6, 10, 36, 28)
    p.drawLine(6, 20, 42, 20)
    p.drawLine(24, 20, 24, 34)
    p.drawLine(16, 28, 24, 34)
    p.drawLine(32, 28, 24, 34)
    p.end()
    return pm

def _rent_icon() -> "QPixmap":
    """Cabinet/locker icon"""
    from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
    pm = QPixmap(52, 52)
    pm.fill(QColor(0, 0, 0, 0))
    p = QPainter(pm)
    p.setPen(QPen(QColor(255, 255, 255), 2.5))
    p.drawRect(6, 10, 36, 32)
    p.drawLine(6, 20, 42, 20)
    p.drawRect(17, 23, 14, 10)
    p.drawEllipse(25, 27, 3, 3)
    p.end()
    return pm

def _support_icon() -> "QPixmap":
    """Head + question circle icon"""
    from PySide6.QtGui import QPainter, QPen, QColor, QPixmap
    pm = QPixmap(52, 52)
    pm.fill(QColor(0, 0, 0, 0))
    p = QPainter(pm)
    p.setPen(QPen(QColor(255, 255, 255), 2.5))
    p.drawEllipse(16, 10, 20, 20)
    p.drawEllipse(22, 14, 6, 6)
    p.end()
    return pm
