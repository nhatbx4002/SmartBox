"""
ProcessingScreen — spinner + animated progress bar + step dots.
Used during async operations (OTP verify, payment, etc.)
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QProgressBar, QHBoxLayout,
)
from PySide6.QtCore import Qt, QTimer, QPropertyAnimation, QVariantAnimation, Property
from PySide6.QtGui import QFont, QPainter, QColor

from src.theme import BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM, ACCENT_ORANGE, FONT_FAMILY, RADIUS_MD
from .kiosk_layout import KioskLayout


class ProcessingScreen(KioskLayout):
    show_back = False

    def __init__(self, nav,
                 message: str = "ĐANG XỬ LÝ...",
                 sub: str = "Vui lòng chờ trong giây lát",
                 proc_type: str = "deposit",
                 step: int = 1,
                 total_steps: int = 3,
                 parent=None):
        self._message = message
        self._sub     = sub
        self._type    = proc_type
        self._step    = step
        self._total   = total_steps
        super().__init__(nav, parent)
        self._build_ui()

    def _build_ui(self) -> None:
        accent = {
            "deposit": ACCENT_ORANGE,
            "pickup":  "#2196F3",
            "rent":    "#4CAF50",
        }.get(self._type, ACCENT_ORANGE)

        lay = self.content_layout()
        lay.setContentsMargins(20, 20, 20, 20)
        lay.setSpacing(14)
        lay.setAlignment(Qt.AlignCenter)

        # Icon wrap
        icon_lbl = QLabel("⟳")
        icon_lbl.setFont(QFont(FONT_FAMILY, 22, QFont.Bold))
        icon_lbl.setStyleSheet(f"color:{accent}; background:rgba(255,102,0,0.1); "
                                f"border:1.5px solid rgba(255,102,0,0.3); "
                                f"border-radius:{RADIUS_MD*4}px;")
        icon_lbl.setFixedSize(56, 56)
        icon_lbl.setAlignment(Qt.AlignCenter)

        # Spinning indicator (animated via timer)
        self._spin_lbl = QLabel()
        self._spin_lbl.setFixedSize(36, 36)
        self._spin_lbl.setStyleSheet(f"""
            background: transparent;
            border: 3px solid {BG_CARD_BORDER};
            border-top-color: {accent};
            border-radius: 18px;
        """)
        self._spin_timer = QTimer(self)
        self._spin_timer.timeout.connect(self._spin_step)
        self._spin_timer.start(60)
        self._spin_angle = 0

        spinner_row = QHBoxLayout()
        spinner_row.addStretch()
        spinner_row.addWidget(self._spin_lbl)
        spinner_row.addStretch()

        # Title
        msg_lbl = QLabel(self._message)
        msg_lbl.setFont(QFont(FONT_FAMILY, 17, QFont.Bold))
        msg_lbl.setStyleSheet(f"color:{accent}; letter-spacing:1px;")
        msg_lbl.setAlignment(Qt.AlignCenter)

        # Sub
        sub_lbl = QLabel(self._sub)
        sub_lbl.setFont(QFont(FONT_FAMILY, 11))
        sub_lbl.setStyleSheet(f"color:{FG_MUTED};")
        sub_lbl.setAlignment(Qt.AlignCenter)

        # Progress bar
        self._pbar = QProgressBar()
        self._pbar.setFixedHeight(6)
        self._pbar.setTextVisible(False)
        self._pbar.setStyleSheet(f"""
            QProgressBar {{
                background: #1a1a1a;
                border-radius: 3px;
            }}
            QProgressBar::chunk {{
                background: {accent};
                border-radius: 3px;
            }}
        """)
        self._pbar.setRange(0, 100)
        self._pbar.setValue(0)
        self._pbar_anim = QTimer(self)
        self._pbar_anim.timeout.connect(self._pbar_step)
        self._pbar_anim.start(180)
        self._pbar_val = 0

        # Pct label
        self._pct_lbl = QLabel("0%")
        self._pct_lbl.setFont(QFont(FONT_FAMILY, 12))
        self._pct_lbl.setStyleSheet(f"color:{accent}; font-weight:600;")
        self._pct_lbl.setAlignment(Qt.AlignCenter)

        # Step dots
        steps_lay = QWidget()
        steps_lay_lay = QHBoxLayout(steps_lay)
        steps_lay_lay.setContentsMargins(0, 0, 0, 0)
        steps_lay_lay.setSpacing(8)
        steps_lay_lay.addStretch()
        for i in range(self._total):
            dot = QLabel("●" if i < self._step else "○")
            dot.setFont(QFont(FONT_FAMILY, 14))
            if i < self._step:
                dot.setStyleSheet(f"color:{accent};")
            else:
                dot.setStyleSheet(f"color:{FG_DIM};")
            steps_lay_lay.addWidget(dot)
        steps_lay_lay.addStretch()

        lay.addWidget(icon_lbl, alignment=Qt.AlignCenter)
        lay.addLayout(spinner_row)
        lay.addWidget(msg_lbl)
        lay.addWidget(sub_lbl)
        lay.addWidget(self._pbar)
        lay.addWidget(self._pct_lbl)
        lay.addLayout(steps_lay_lay)

    def _spin_step(self) -> None:
        self._spin_angle = (self._spin_angle + 15) % 360
        self._spin_lbl.update()

    def _pbar_step(self) -> None:
        if self._pbar_val < 95:
            self._pbar_val += 4 + (100 - self._pbar_val) * 0.05
            if self._pbar_val > 100:
                self._pbar_val = 100
        self._pbar.setValue(int(self._pbar_val))
        self._pct_lbl.setText(f"{int(self._pbar_val)}%")

    def hideEvent(self, event):
        if getattr(self, '_spin_timer', None):
            self._spin_timer.stop()
        if getattr(self, '_pbar_anim', None):
            self._pbar_anim.stop()
        super().hideEvent(event)
