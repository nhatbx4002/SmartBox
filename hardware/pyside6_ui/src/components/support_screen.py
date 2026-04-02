"""
SupportScreen — FAQ accordion + hotline/chat buttons.
Routes: /support
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QScrollArea, QSizePolicy, QFrame,
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM,
    ACCENT_ORANGE, FONT_FAMILY, RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


FAQS = [
    ("Làm sao để gửi đồ?",
     "Chạm GỬI ĐỒ → nhập số điện thoại → nhận mã OTP → mở tủ → bỏ đồ vào → đóng tủ"),
    ("Quên mã OTP phải làm sao?",
     "Chạm Gửi lại mã OTP hoặc liên hệ hotline 1900.xxxx để được hỗ trợ."),
    ("Đồ bị mất trong tủ ai chịu trách nhiệm?",
     "SmartBox không chịu trách nhiệm về đồ quá giá. Không để tiền mặt, trang sức, giấy tờ quan trọng trong tủ."),
    ("Tủ có bảo mật không?",
     "Mỗi tủ có cảm biến đóng mở và camera giám sát 24/7. Chỉ chủ nhận có mã OTP mới mở được tủ."),
]


class SupportScreen(KioskLayout):
    show_back = True

    def __init__(self, nav, parent=None):
        super().__init__(nav, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(14, 12, 14, 10)
        lay.setSpacing(10)

        # Header row
        header = QHBoxLayout()
        header.setSpacing(10)
        bar = QWidget()
        bar.setFixedSize(4, 20)
        bar.setStyleSheet(f"background:{ACCENT_ORANGE}; border-radius:2px;")
        title = QLabel("HỖ TRỢ")
        title.setFont(QFont(FONT_FAMILY, 14, QFont.Bold))
        title.setStyleSheet(f"color:{ACCENT_ORANGE}; letter-spacing:1px;")
        header.addWidget(bar)
        header.addWidget(title)
        header.addStretch()

        hotline = QLabel("📞 Hotline: 1900 1234")
        hotline.setFont(QFont(FONT_FAMILY, 10))
        hotline.setStyleSheet(f"color:{FG_MUTED};")
        header.addWidget(hotline)
        lay.addLayout(header)

        # FAQ list
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        scroll.setStyleSheet(f"""
            QScrollArea {{ background: transparent; border: none; }}
            QScrollBar:vertical {{ width: 4px; background: {BG_CARD_BORDER}; border-radius: 2px; }}
        """)
        inner = QWidget()
        inner_lay = QVBoxLayout(inner)
        inner_lay.setSpacing(6)
        inner_lay.setContentsMargins(0, 0, 0, 0)

        self._faq_items: list[_FaqItem] = []
        for i, (q, a) in enumerate(FAQS):
            item = _FaqItem(i + 1, q, a)
            inner_lay.addWidget(item)
            self._faq_items.append(item)

        inner.setLayout(inner_lay)
        scroll.setWidget(inner)
        lay.addWidget(scroll, stretch=1)

        # Footer buttons
        footer = QHBoxLayout()
        footer.setSpacing(10)

        call_btn = QPushButton("📞  Liên hệ Hotline")
        call_btn.setFixedHeight(52)
        call_btn.setCursor(Qt.PointingHandCursor)
        call_btn.setFont(QFont(FONT_FAMILY, 13, QFont.Bold))
        call_btn.setStyleSheet(f"""
            QPushButton {{
                background: rgba(255,102,0,0.1);
                border: 1.5px solid rgba(255,102,0,0.5);
                border-radius: {RADIUS_LG}px;
                color: {ACCENT_ORANGE};
                font-family: {FONT_FAMILY};
                font-size: 13px;
                font-weight: 700;
            }}
            QPushButton:hover {{ background: rgba(255,102,0,0.2); }}
        """)

        chat_btn = QPushButton("💬  Chat nhân viên")
        chat_btn.setFixedHeight(52)
        chat_btn.setCursor(Qt.PointingHandCursor)
        chat_btn.setFont(QFont(FONT_FAMILY, 13, QFont.Bold))
        chat_btn.setStyleSheet(f"""
            QPushButton {{
                background: {BG_CARD};
                border: 1.5px solid {BG_CARD_BORDER};
                border-radius: {RADIUS_LG}px;
                color: {FG_MUTED};
                font-family: {FONT_FAMILY};
                font-size: 13px;
                font-weight: 700;
            }}
        """)

        footer.addWidget(call_btn)
        footer.addWidget(chat_btn)
        lay.addLayout(footer)


class _FaqItem(QFrame):
    def __init__(self, num: int, question: str, answer: str, parent=None):
        super().__init__(parent)
        self._open = False
        self.setCursor(Qt.PointingHandCursor)
        self.setStyleSheet(f"""
            QFrame {{
                background: {BG_CARD};
                border: 1px solid #1a1a1a;
                border-radius: {RADIUS_MD}px;
            }}
        """)

        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.setSpacing(0)

        # Question row
        self._q_btn = QPushButton()
        self._q_btn.setCursor(Qt.PointingHandCursor)
        self._q_btn.setStyleSheet(f"""
            QPushButton {{
                background: transparent;
                border: none;
                padding: 10px 12px;
                text-align: left;
            }}
        """)
        q_lay = QHBoxLayout(self._q_btn)
        q_lay.setContentsMargins(12, 10, 12, 10)
        q_lay.setSpacing(8)

        num_lbl = QLabel(f"Q{num}")
        num_lbl.setFont(QFont(FONT_FAMILY, 9, QFont.Bold))
        num_lbl.setStyleSheet(f"""
            color:{ACCENT_ORANGE};
            background:rgba(255,102,0,0.1);
            border:1px solid rgba(255,102,0,0.3);
            border-radius:4px;
            padding:2px 6px;
        """)
        num_lbl.setFixedWidth(30)

        q_lbl = QLabel(question)
        q_lbl.setFont(QFont(FONT_FAMILY, 11, QFont.Bold))
        q_lbl.setStyleSheet(f"color:{FG_PRIMARY};")
        q_lbl.setWordWrap(True)

        self._arrow = QLabel("▼")
        self._arrow.setFont(QFont(FONT_FAMILY, 10))
        self._arrow.setStyleSheet(f"color:{FG_DIM};")
        self._arrow.setFixedWidth(14)

        q_lay.addWidget(num_lbl)
        q_lay.addWidget(q_lbl, stretch=1)
        q_lay.addWidget(self._arrow)

        self._q_btn.clicked.connect(self._toggle)

        # Answer row (hidden initially)
        self._a_lbl = QLabel(answer)
        self._a_lbl.setFont(QFont(FONT_FAMILY, 10))
        self._a_lbl.setStyleSheet(f"""
            color:{FG_MUTED};
            padding: 8px 12px 10px 12px;
            border-top: 1px solid #1a1a1a;
        """)
        self._a_lbl.setWordWrap(True)
        self._a_lbl.hide()

        lay.addWidget(self._q_btn)
        lay.addWidget(self._a_lbl)

    def _toggle(self) -> None:
        self._open = not self._open
        self._a_lbl.setVisible(self._open)
        self._arrow.setText("▲" if self._open else "▼")
        # Update border color
        border_color = "rgba(255,102,0,0.3)" if self._open else "#1a1a1a"
        self.setStyleSheet(f"""
            QFrame {{
                background: {BG_CARD};
                border: 1px solid {border_color};
                border-radius: {RADIUS_MD}px;
            }}
        """)
