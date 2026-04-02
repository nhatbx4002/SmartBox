"""
SmartBox Kiosk UI — PySide6 port of the React kiosk UI.
Mirrors hardware/ui/src/components/* into native Qt widgets.

Screen: 800 x 480 px (portrait kiosk display)
Theme:  dark background (#0A0A0A), orange brand accent (#FF6600)
"""

import sys
import os
import random
import string
from datetime import datetime
from typing import Optional

# Add src/ to path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QStackedWidget
from PySide6.QtCore import QTimer, Signal, QObject, Qt

from theme import SCREEN_W, SCREEN_H, BG_ROOT


# ─── Simple signal-based router ──────────────────────────────────────────────

class Router(QObject):
    """Emits navigate requests; the main window swaps screens."""
    navigate = Signal(str)   # path e.g. "/otp/deposit"
    go_back = Signal()


class Navigator:
    """
    Thin layer above QStackedWidget that mimics react-router-dom.
    Usage:
        nav = Navigator(self.stack)
        nav.register("/home", HomeWidget())
        nav.navigate("/home")
    """

    def __init__(self, stack: QStackedWidget):
        self.stack = stack
        self._routes: dict[str, QWidget] = {}
        self._order: list[QWidget] = []   # push order for back()

    def register(self, path: str, widget: QWidget) -> None:
        self._routes[path] = widget
        self.stack.addWidget(widget)

    def navigate(self, path: str) -> None:
        w = self._routes.get(path)
        if w is None:
            print(f"[Router] No route registered for {path!r}")
            return
        self._order.append(w)
        self.stack.setCurrentWidget(w)

    def back(self) -> None:
        if len(self._order) >= 2:
            self._order.pop()          # remove current
            prev = self._order[-1]      # back to previous
            self.stack.setCurrentWidget(prev)
        elif len(self._order) == 1:
            # default to home
            home = self._routes.get("/")
            if home:
                self._order.clear()
                self._order.append(home)
                self.stack.setCurrentWidget(home)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def random_txid(prefix: str = "TX") -> str:
    n = random.randint(10000, 99999)
    return f"{prefix}{n}"

def random_locker() -> str:
    return f"L{random.randint(1, 8):02d}"

def random_otp() -> str:
    return str(random.randint(100000, 999999))


# ─── Main Window ──────────────────────────────────────────────────────────────

class MainWindow(QMainWindow):
    WIDTH  = SCREEN_W
    HEIGHT = SCREEN_H

    def __init__(self):
        super().__init__()
        self.setWindowTitle("SmartBox Kiosk")
        self.resize(self.WIDTH, self.HEIGHT)
        self.setMinimumSize(self.WIDTH, self.HEIGHT)
        self.setMaximumSize(self.WIDTH, self.HEIGHT)

        # Stacked widget = "router outlet"
        self.stack = QStackedWidget()
        self.stack.setStyleSheet(f"background:{BG_ROOT};")
        self.setCentralWidget(self.stack)

        # Navigator
        self.nav = Navigator(self.stack)

        # Router signals
        self.router = Router()
        self.router.navigate.connect(self._on_navigate)
        self.router.go_back.connect(self._on_back)

        # Register all screens
        self._register_screens()

        # Start at home
        self.nav.navigate("/")

    def _register_screens(self) -> None:
        from components import (
            HomeScreen,
            InputOTPScreen,
            RentScreen,
            RentPhoneScreen,
            PaymentScreen,
            RentSuccessScreen,
            SupportScreen,
            ProcessingScreen,
            SuccessScreen,
            LockerOpenScreen,
            SizeSelectScreen,
        )

        def make_otp(tp: str):
            return InputOTPScreen(self.nav, tp)

        self.nav.register("/", HomeScreen(self.nav))
        self.nav.register("/otp/deposit", make_otp("deposit"))
        self.nav.register("/otp/pickup",   make_otp("pickup"))
        self.nav.register("/otp/rent",     make_otp("rent"))
        self.nav.register("/rent",         RentScreen(self.nav))
        self.nav.register("/rent-phone",   RentPhoneScreen(self.nav))
        self.nav.register("/payment",      PaymentScreen(self.nav))
        self.nav.register("/rent-locker",  RentSuccessScreen(self.nav))
        self.nav.register("/support",      SupportScreen(self.nav))
        # Shared overlays (managed by their parent screen)
        self.nav.register("/_processing",  ProcessingScreen(self.nav))
        self.nav.register("/_success",     SuccessScreen(self.nav))
        self.nav.register("/_locker-open", LockerOpenScreen(self.nav))

    def _on_navigate(self, path: str) -> None:
        self.nav.navigate(path)

    def _on_back(self) -> None:
        self.nav.back()

    def keyPressEvent(self, event):
        """ESC → back, F11 → fullscreen toggle."""
        if event.key() == Qt.Key_Escape:
            self.router.go_back.emit()
        elif event.key() == Qt.Key_F11:
            if self.isFullScreen():
                self.showNormal()
            else:
                self.showFullScreen()
        super().keyPressEvent(event)


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setApplicationName("SmartBox Kiosk")

    w = MainWindow()
    w.show()
    sys.exit(app.exec())
