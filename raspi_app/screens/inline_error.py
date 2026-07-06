from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QHBoxLayout, QLabel, QWidget


class InlineError(QWidget):
    def __init__(self, parent: QWidget):
        super().__init__(parent)
        self.setObjectName("InlineError")
        self.setFixedHeight(44)
        self.hide()

        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 0, 12, 0)
        layout.setSpacing(8)

        self.lbl_icon = QLabel("⚠️")
        self.lbl_icon.setFixedWidth(28)
        self.lbl_icon.setAlignment(Qt.AlignCenter)
        self.lbl_icon.setObjectName("lblErrorIcon")

        self.lbl_message = QLabel("")
        self.lbl_message.setObjectName("lblErrorMessage")
        self.lbl_message.setAlignment(Qt.AlignLeft | Qt.AlignVCenter)
        self.lbl_message.setWordWrap(True)

        layout.addWidget(self.lbl_icon)
        layout.addWidget(self.lbl_message, stretch=1)

        self.setStyleSheet("""
            InlineError {
                background-color: #1A0A0A;
                border: 1px solid #EF4444;
                border-radius: 10px;
            }
            QLabel {
                background: transparent;
                color: #E8E8E8;
                font-size: 20px;
                font-family: 'Be Vietnam Pro', Arial, sans-serif;
            }
            QLabel#lblErrorIcon {
                font-size: 22px;
            }
        """)

    def show_error(self, message: str, icon: str = "⚠️") -> None:
        self.lbl_icon.setText(icon)
        self.lbl_message.setText(message)
        self.show()

    def clear(self) -> None:
        self.hide()
