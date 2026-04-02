"""
InputOTPScreen — 6-digit OTP entry with paste, countdown, loading, success flow.
type: "deposit" | "pickup" | "rent"
"""

import random
from typing import Literal

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLineEdit,
    QPushButton, QLabel, QSizePolicy, QSpacerItem,
    QGraphicsOpacityEffect,
)
from PySide6.QtCore import Qt, QTimer, Signal, QEvent
from PySide6.QtGui import QFont, QPainter, QColor, QPixmap

from src.theme import (
    BG_ROOT, BG_CARD, BG_CARD_BORDER, FG_PRIMARY, FG_MUTED, FG_DIM, FG_DISABLED,
    ACCENT_ORANGE, ACCENT_BLUE, ACCENT_GREEN, FONT_FAMILY,
    RADIUS_MD, RADIUS_LG,
)
from .kiosk_layout import KioskLayout


class InputOTPScreen(KioskLayout):
    show_back = True

    OTP_TIMEOUT = 120  # seconds

    def __init__(self, router, otp_type: Literal["deposit", "pickup", "rent"] = "deposit", parent=None):
        self.otp_type = otp_type
        # Color by type
        self.accent = {
            "deposit": ACCENT_ORANGE,
            "pickup":  ACCENT_BLUE,
            "rent":    ACCENT_GREEN,
        }[otp_type]
        self.title = {
            "deposit": "GỬI ĐỒ",
            "pickup":  "NHẬN ĐỒ",
            "rent":    "THUÊ TỦ",
        }[otp_type]

        # State
        self._otp = ["", "", "", "", "", ""]
        self._error = ""
        self._loading = False
        self._success = False
        self._countdown = self.OTP_TIMEOUT
        self._txid = f"TX{random.randint(10000, 99999)}"
        self._locker = f"L{random.randint(1, 8):02d}"
        self._timer = None   # initialized in _build_ui
        self._boxes: list = []   # initialized in _build_ui, but safe to exist
        self._timer_lbl = None
        self._confirm_btn = None

        super().__init__(router, parent)
        self.set_back_visible(True)
        self._build_ui()

    def _build_ui(self) -> None:
        lay = self.content_layout()
        lay.setContentsMargins(16, 14, 16, 14)
        lay.setSpacing(14)

        # Header accent
        header_row = QHBoxLayout()
        header_row.setSpacing(10)
        accent_bar = QWidget()
        accent_bar.setFixedSize(4, 20)
        accent_bar.setStyleSheet(f"background:{self.accent}; border-radius:2px;")
        title_lbl = QLabel(self.title)
        title_lbl.setFont(QFont(FONT_FAMILY, 14, QFont.Bold))
        title_lbl.setStyleSheet(f"color:{self.accent}; letter-spacing:0.5px;")
        header_row.addWidget(accent_bar)
        header_row.addWidget(title_lbl)
        header_row.addStretch()
        lay.addLayout(header_row)

        # Timer hint row
        timer_lbl = QLabel(f"Mã sẽ hết hạn sau <b>{self._countdown}s</b>")
        timer_lbl.setFont(QFont(FONT_FAMILY, 11))
        timer_lbl.setStyleSheet(f"color:{self.accent}; font-weight:700;")
        lay.addWidget(timer_lbl)
        self._timer_lbl = timer_lbl

        # OTP boxes
        boxes_lay = QHBoxLayout()
        boxes_lay.setSpacing(10)
        boxes_lay.addStretch()
        self._boxes: list[QLineEdit] = []
        for i in range(6):
            le = _OTPBox(self.accent)
            le.setAlignment(Qt.AlignCenter)
            le.setMaxLength(1)
            le.returnPressed.connect(self._on_confirm)
            le.textChanged.connect(lambda txt, idx=i: self._on_digit(idx, txt))
            le.installEventFilter(self)
            boxes_lay.addWidget(le)
            self._boxes.append(le)
        boxes_lay.addStretch()
        lay.addLayout(boxes_lay)
        self._boxes[0].setFocus()

        # Error label
        self._err_lbl = QLabel()
        self._err_lbl.setFont(QFont(FONT_FAMILY, 10))
        self._err_lbl.setStyleSheet("color:#ef4444;")
        self._err_lbl.setAlignment(Qt.AlignCenter)
        self._err_lbl.hide()
        lay.addWidget(self._err_lbl)

        lay.addStretch()

        # Confirm button
        self._confirm_btn = QPushButton("XÁC NHẬN")
        self._confirm_btn.setFixedHeight(60)
        self._confirm_btn.setCursor(Qt.PointingHandCursor)
        self._confirm_btn.setFont(QFont(FONT_FAMILY, 13, QFont.Bold))
        self._confirm_btn.setStyleSheet(self._btn_disabled_style())
        self._confirm_btn.clicked.connect(self._on_confirm)
        lay.addWidget(self._confirm_btn)

        # Countdown timer
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._on_tick)

    def showEvent(self, event):
        super().showEvent(event)
        self._reset()
        self._timer.start(1000)

    def hideEvent(self, event):
        if self._timer is not None:
            self._timer.stop()
        super().hideEvent(event)

    def _reset(self) -> None:
        self._otp = ["", "", "", "", "", ""]
        self._error = ""
        self._loading = False
        self._success = False
        self._countdown = self.OTP_TIMEOUT
        for i, le in enumerate(self._boxes):
            le.setText("")
            le.setStyleSheet(self._box_style(False, False))
        self._err_lbl.hide()
        self._confirm_btn.setStyleSheet(self._btn_disabled_style())
        self._timer_lbl.setText(f"Mã sẽ hết hạn sau <b>{self._countdown}s</b>")
        self._boxes[0].setFocus()

    def _box_style(self, filled: bool, error: bool) -> str:
        border = "#ef4444" if error else ("#444" if filled else "#2a2a2a")
        return f"""
            QLineEdit {{
                background: {BG_CARD};
                border: 2px solid {border};
                border-radius: {RADIUS_MD}px;
                color: {FG_PRIMARY};
                font-family: {FONT_FAMILY};
                font-size: 26px;
                font-weight: 700;
                padding: 0;
                selection-background-color: {self.accent};
            }}
        """

    def _btn_disabled_style(self) -> str:
        return f"""
            QPushButton {{
                background: #222;
                border: none;
                border-radius: {RADIUS_LG}px;
                color: {FG_DISABLED};
                font-family: {FONT_FAMILY};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
        """

    def _btn_ready_style(self) -> str:
        return f"""
            QPushButton {{
                background: {self.accent};
                border: none;
                border-radius: {RADIUS_LG}px;
                color: #fff;
                font-family: {FONT_FAMILY};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 1px;
            }}
            QPushButton:hover {{ opacity: 0.85; }}
        """

    def _on_digit(self, index: int, text: str) -> None:
        digit = text[-1] if text else ""
        self._otp[index] = digit
        self._boxes[index].setText(digit)
        self._boxes[index].setStyleSheet(self._box_style(bool(digit), False))
        self._err_lbl.hide()
        # Move focus forward
        if digit and index < 5:
            self._boxes[index + 1].setFocus()
        # Update button
        if len("".join(self._otp)) == 6:
            self._confirm_btn.setStyleSheet(self._btn_ready_style())
        else:
            self._confirm_btn.setStyleSheet(self._btn_disabled_style())

    def eventFilter(self, watched, event):
        """Handle Backspace → move focus backward."""
        if event.type() == QEvent.KeyPress:
            key = event.key()
            for i, le in enumerate(self._boxes):
                if le is watched:
                    if key == Qt.Key_Backspace and not le.text() and i > 0:
                        self._boxes[i - 1].setFocus()
                    elif key == Qt.Key_Left and i > 0:
                        self._boxes[i - 1].setFocus()
                    elif key == Qt.Key_Right and i < 5:
                        self._boxes[i + 1].setFocus()
                    break
        return super().eventFilter(watched, event)

    def _on_confirm(self) -> None:
        code = "".join(self._otp)
        if len(code) != 6:
            return
        # Show loading then success
        self._loading = True
        self._timer.stop()

        # Replace content with spinner → navigate
        self._navigate_after_delay()

    def _navigate_after_delay(self) -> None:
        """Simulate async verify (1.5s) then go to result."""
        from PySide6.QtCore import QTimer
        from .state import STATE

        # Write shared state before navigating to overlay screens
        STATE["success_type"] = self.otp_type
        STATE["locker"]       = self._locker
        STATE["txid"]         = self._txid

        if self.nav:
            self.nav.navigate("/_processing")
        QTimer.singleShot(1500, self._show_success)

    def _show_success(self) -> None:
        if self.nav:
            if self.otp_type == "rent":
                # Rent success screen
                self.nav.navigate("/_success")
            else:
                self.nav.navigate("/_locker-open")

    def _on_tick(self) -> None:
        self._countdown -= 1
        if self._countdown <= 0:
            self._timer.stop()
            if self.nav:
                self.nav.navigate("/")
            return
        self._timer_lbl.setText(f"Mã sết hết hạn sau <b>{self._countdown}s</b>")

    def content_layout(self) -> QVBoxLayout:
        """Hook for the loading/success states to replace the content."""
        return super().content_layout()


class _OTPBox(QLineEdit):
    """Single OTP digit box with dark styling."""
    def __init__(self, accent: str, parent=None):
        super().__init__(parent)
        self._accent = accent
        self.setFixedSize(52, 68)

    def keyPressEvent(self, event):
        """Only allow digits."""
        if event.text() and not event.text()[0].isdigit():
            if event.key() not in (Qt.Key_Backspace, Qt.Key_Left, Qt.Key_Right,
                                    Qt.Key_Delete, Qt.Key_Tab, Qt.Key_Escape):
                return
        super().keyPressEvent(event)
