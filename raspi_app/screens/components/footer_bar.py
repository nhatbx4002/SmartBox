from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QWidget

from screens.components.theme import (
    COLOR_BORDER_SOFT,
    COLOR_ERROR,
    COLOR_ONLINE,
    COLOR_SURFACE,
    COLOR_MUTED,
    FONT_FOOTER,
    FONT_FAMILY,
    FOOTER_HEIGHT,
)


class FooterBar(QFrame):
    def __init__(
        self,
        *,
        status: str = "ONLINE",
        version: str = "Version v1.0",
        parent: QWidget | None = None,
    ):
        super().__init__(parent)
        self.setObjectName("footerBar")
        self.setFixedHeight(FOOTER_HEIGHT)
        self.setStyleSheet(
            "QFrame#footerBar {"
            f"background-color: {COLOR_SURFACE};"
            "border: none;"
            f"border-top: 1px solid {COLOR_BORDER_SOFT};"
            "}"
        )

        layout = QHBoxLayout(self)
        layout.setContentsMargins(16, 0, 16, 0)
        layout.setSpacing(6)

        self.dot = QWidget(self)
        self.dot.setFixedSize(8, 8)

        self.status_label = QLabel(self)
        self.status_label.setStyleSheet("background: transparent; border: none;")

        self.version_label = QLabel(version, self)
        self.version_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self.version_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {COLOR_MUTED};"
            f"font-family: {FONT_FAMILY};"
            f"font-size: {FONT_FOOTER}px;"
        )

        layout.addWidget(self.dot)
        layout.addWidget(self.status_label)
        layout.addStretch()
        layout.addWidget(self.version_label)

        self.set_status(status)

    def set_status(self, status: str) -> None:
        normalized = (status or "OFFLINE").upper()
        color = COLOR_ONLINE if normalized == "ONLINE" else COLOR_ERROR

        self.dot.setStyleSheet(
            f"background-color: {color};"
            "border: none;"
            "border-radius: 4px;"
        )
        self.status_label.setText(normalized)
        self.status_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {color};"
            f"font-family: {FONT_FAMILY};"
            f"font-size: {FONT_FOOTER}px;"
            "font-weight: 700;"
        )

    def set_version(self, version: str) -> None:
        self.version_label.setText(version)