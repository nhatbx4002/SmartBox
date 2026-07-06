from collections.abc import Callable

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QWidget

from screens.components.theme import (
    BACK_BUTTON_SIZE,
    COLOR_BG,
    COLOR_BORDER_SOFT,
    COLOR_PRIMARY,
    COLOR_TEXT,
    COLOR_TEXT_BRIGHT,
    FONT_FAMILY,
    HEADER_HEIGHT,
)


class HeaderBar(QFrame):
    def __init__(
        self,
        title: str,
        *,
        on_back: Callable[[], None] | None = None,
        parent: QWidget | None = None,
        object_name: str = "headerFrame",
        back_object_name: str = "btnBack",
        title_object_name: str = "lblHeaderTitle",
    ):
        super().__init__(parent)
        self.setObjectName(object_name)
        self.setFixedHeight(HEADER_HEIGHT)
        self.setStyleSheet(
            f"QFrame#{object_name} {{"
            f"background-color: {COLOR_BG};"
            "border: none;"
            f"border-bottom: 1px solid {COLOR_BORDER_SOFT};"
            "}"
        )

        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 0, 24, 0)
        layout.setSpacing(12)

        self.back_button: QPushButton | None = None

        if on_back is not None:
            self.back_button = QPushButton("←", self)
            self.back_button.setObjectName(back_object_name)
            self.back_button.setFixedSize(BACK_BUTTON_SIZE, BACK_BUTTON_SIZE)
            self.back_button.setCursor(Qt.PointingHandCursor)
            self.back_button.setStyleSheet(
                "QPushButton {"
                "background: transparent;"
                "border: none;"
                f"color: {COLOR_TEXT};"
                "font-size: 34px;"
                "font-weight: 700;"
                f"font-family: {FONT_FAMILY};"
                "}"
                "QPushButton:pressed {"
                f"color: {COLOR_PRIMARY};"
                "}"
            )
            self.back_button.clicked.connect(on_back)
            layout.addWidget(self.back_button)

        self.title_label = QLabel(title, self)
        self.title_label.setObjectName(title_object_name)
        self.title_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {COLOR_TEXT_BRIGHT};"
            f"font-family: {FONT_FAMILY};"
            "font-size: 28px;"
            "font-weight: 900;"
        )
        layout.addWidget(self.title_label)
        layout.addStretch()

    def set_title(self, title: str) -> None:
        self.title_label.setText(title)
