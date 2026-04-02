"""
PaymentScreen — payment method selection (MoMo, ZaloPay, VietQR, Tiền mặt).
Routes: /payment → /rent-locker
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QScrollArea, QSizePolicy,
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont, QPainter, QColor, QPixmap, QPainterPath

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED,
    ACCENT_ORANGE, ACCENT_GREEN, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


METHODS = [
    {"id": "momo",    "label": "MoMo",       "color": "#A50064", "sub": "Thanh toán nhanh"},
    {"id": "zlp",     "label": "ZaloPay",    "color": "#2D9A38", "sub": "An toàn, tiện lợi"},
    {"id": "vietqr",  "label": "VietQR",     "color": "#0068FF", "sub": "Quét mã QR"},
    {"id": "cash",    "label": "Tiền mặt",  "color": "#4CAF50", "sub": "Tại quầy thanh toán"},
]


class PaymentScreen(KioskLayout):
    show_back = True

    def __init__(self, nav, parent=None):
        self._selected = None
        super().__init__(nav, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(16, 12, 16, 14)
        lay.setSpacing(12)

        # Header
        h = QHBoxLayout()
        h.setSpacing(10)
        bar = QWidget()
        bar.setFixedSize(4, 20)
        bar.setStyleSheet(f"background:{ACCENT_ORANGE}; border-radius:2px;")
        title = QLabel("THANH TOÁN")
        title.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        title.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:1px;")
        sub = QLabel("Chọn phương thức thanh toán")
        sub.setFont(QFont(FONT_FAMILY, 11))
        sub.setStyleSheet(f"color:{FG_MUTED};")
        h.addWidget(bar)
        h.addWidget(title)
        h.addWidget(sub)
        h.addStretch()
        lay.addLayout(h)

        # Amount card
        amt_card = QWidget()
        amt_card.setStyleSheet(f"background:{BG_CARD}; border:1.5px solid {BG_CARD_BORDER}; border-radius:{RADIUS_MD}px;")
        amt_lay = QVBoxLayout(amt_card)
        amt_lay.setContentsMargins(16, 14, 16, 14)
        amt_lay.setSpacing(4)
        amt_lay.setAlignment(Qt.AlignCenter)

        lbl = QLabel("Số tiền thanh toán")
        lbl.setFont(QFont(FONT_FAMILY, 11))
        lbl.setStyleSheet(f"color:{FG_MUTED};")
        lbl.setAlignment(Qt.AlignCenter)

        val = QLabel("150.000đ")
        val.setFont(QFont(FONT_FAMILY, 26, QFont.Bold))
        val.setStyleSheet(f"color:{ACCENT_ORANGE};")
        val.setAlignment(Qt.AlignCenter)

        note = QLabel("Thuê tủ 1 tháng")
        note.setFont(QFont(FONT_FAMILY, 10))
        note.setStyleSheet(f"color:#666;")
        note.setAlignment(Qt.AlignCenter)

        amt_lay.addWidget(lbl)
        amt_lay.addWidget(val)
        amt_lay.addWidget(note)
        lay.addWidget(amt_card)

        # Method list
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        scroll.setStyleSheet(f"""
            QScrollArea {{ background: transparent; border: none; }}
            QScrollBar:vertical {{ width: 4px; background: {BG_CARD_BORDER}; border-radius: 2px; }}
        """)
        inner = QWidget()
        inner_lay = QVBoxLayout(inner)
        inner_lay.setSpacing(8)
        inner_lay.setContentsMargins(0, 0, 0, 0)

        self._method_btns: list[QWidget] = []
        for m in METHODS:
            btn = _MethodBtn(m, self._on_select)
            inner_lay.addWidget(btn)
            self._method_btns.append(btn)

        inner.setLayout(inner_lay)
        scroll.setWidget(inner)
        lay.addWidget(scroll, stretch=1)

        # Pay button
        self._pay_btn = QPushButton("THANH TOÁN NGAY")
        self._pay_btn.setFixedHeight(60)
        self._pay_btn.setCursor(Qt.PointingHandCursor)
        self._pay_btn.setFont(QFont(FONT_FAMILY, 15, QFont.Bold))
        self._pay_btn.setStyleSheet(self._btn_disabled_style())
        self._pay_btn.clicked.connect(self._on_pay)
        lay.addWidget(self._pay_btn)

    def _btn_disabled_style(self) -> str:
        return f"""
            QPushButton {{
                background: #222;
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #444;
                font-family: {FONT_FAMILY};
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
        """

    def _btn_ready_style(self) -> str:
        return f"""
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
        """

    def _on_select(self, method_id: str) -> None:
        self._selected = method_id
        for btn in self._method_btns:
            btn.update_selected(btn._method["id"] == method_id)
        self._pay_btn.setStyleSheet(self._btn_ready_style())

    def _on_pay(self) -> None:
        if not self._selected:
            return
        if self.nav:
            self.nav.navigate("/rent-locker")


class _MethodBtn(QWidget):
    def __init__(self, method: dict, on_select, parent=None):
        super().__init__(parent)
        self._method = method
        self._on_select = on_select
        self._selected = False
        self._build_ui()

    def _build_ui(self) -> None:
        self.setCursor(Qt.PointingHandCursor)
        self.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Fixed)
        self.setFixedHeight(64)
        self._update_style()

        lay = QHBoxLayout(self)
        lay.setContentsMargins(16, 0, 16, 0)
        lay.setSpacing(14)

        # Icon
        icon_lbl = QLabel()
        icon_lbl.setPixmap(_method_icon(self._method["id"], self._method["color"]))
        icon_lbl.setFixedSize(36, 36)
        lay.addWidget(icon_lbl)

        # Text
        txt = QVBoxLayout()
        txt.setSpacing(2)
        lbl = QLabel(self._method["label"])
        lbl.setFont(QFont(FONT_FAMILY, 14, QFont.Bold))
        lbl.setStyleSheet(f"color:{FG_PRIMARY};")
        sub = QLabel(self._method["sub"])
        sub.setFont(QFont(FONT_FAMILY, 10))
        sub.setStyleSheet(f"color:{FG_MUTED};")
        txt.addWidget(lbl)
        txt.addWidget(sub)
        lay.addLayout(txt)

        lay.addStretch()

        # Checkmark
        self._check = QLabel("✓")
        self._check.setFont(QFont(FONT_FAMILY, 16, QFont.Bold))
        self._check.setStyleSheet(f"color:{ACCENT_ORANGE}; background:{ACCENT_ORANGE}; border-radius:11px; min-width:22px; min-height:22px;")
        self._check.setAlignment(Qt.AlignCenter)
        self._check.hide()
        lay.addWidget(self._check)

    def _update_style(self) -> None:
        border = ACCENT_ORANGE if self._selected else BG_CARD_BORDER
        self.setStyleSheet(f"""
            QWidget {{
                background: {BG_CARD};
                border: 1.5px solid {border};
                border-radius: {RADIUS_MD}px;
            }}
        """)

    def update_selected(self, selected: bool) -> None:
        self._selected = selected
        self._update_style()
        self._check.setVisible(selected)

    def mousePressEvent(self, e):
        self._on_select(self._method["id"])


def _method_icon(method_id: str, color: str) -> QPixmap:
    """Draw tiny SVG-like icons as QPixmap."""
    from PySide6.QtGui import QPainter, QPen, QColor, QPainterPath
    pm = QPixmap(36, 36)
    pm.fill(QColor(0, 0, 0, 0))
    p = QPainter(pm)
    p.setRenderHint(QPainter.Antialiasing)
    c = QColor(color)

    if method_id == "momo":
        p.setBrush(c)
        p.setPen(Qt.NoPen)
        p.drawEllipse(2, 2, 32, 32)
        p.setPen(QPen(QColor(255,255,255), 2))
        p.drawArc(10, 10, 16, 16, 30*16, 180*16)
        p.setBrush(QColor(255,255,255))
        p.setPen(Qt.NoPen)
        p.drawEllipse(24, 8, 6, 6)
    elif method_id == "zlp":
        p.setBrush(c)
        p.setPen(Qt.NoPen)
        p.drawRoundedRect(0, 0, 36, 36, 6, 6)
        p.setPen(QPen(QColor(255,255,255), 2.5))
        pts = [(4,22),(10,10),(16,17),(22,4),(28,22)]
        path = QPainterPath()
        path.moveTo(pts[0][0], pts[0][1])
        for pt in pts[1:]:
            path.lineTo(pt[0], pt[1])
        p.drawPath(path)
    elif method_id == "vietqr":
        p.setBrush(c)
        p.setPen(Qt.NoPen)
        p.drawRoundedRect(0, 0, 36, 36, 6, 6)
        p.setPen(QPen(QColor(255,255,255), 2))
        p.drawRect(4, 4, 12, 12)
        p.drawRect(20, 4, 12, 12)
        p.drawRect(4, 20, 12, 12)
        p.setBrush(QColor(255,255,255))
        p.setPen(Qt.NoPen)
        p.drawRect(22, 22, 6, 6)
    elif method_id == "cash":
        p.setPen(QPen(c, 2.5))
        p.drawEllipse(4, 4, 28, 28)
        p.drawLine(18, 8, 18, 28)
        p.drawLine(14, 12, 22, 12)
        p.drawLine(14, 18, 22, 18)

    p.end()
    return pm
