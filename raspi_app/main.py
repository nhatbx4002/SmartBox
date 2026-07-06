from __future__ import annotations

import sys

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication

from app.kiosk_app import KioskApp


def main():
    app = QApplication(sys.argv)

    app.setStyleSheet("""
        * {
            background-color: #0A0A0A;
            font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
        }
        QLabel, QPushButton, QFrame {
            background-color: transparent;
        }
    """)

    window = KioskApp()
    window.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
    window.showFullScreen()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
