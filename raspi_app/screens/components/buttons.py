from PySide6.QtCore import Qt
from PySide6.QtWidgets import QPushButton, QWidget

from screens.components.theme import (
    BUTTON_HEIGHT,
    BUTTON_RADIUS,
    COLOR_DISABLED_BG,
    COLOR_DISABLED_TEXT,
    COLOR_PRIMARY,
    COLOR_PRIMARY_PRESSED,
    COLOR_SUCCESS,
    COLOR_SUCCESS_PRESSED,
    COLOR_TEXT_WHITE,
    FONT_BUTTON,
    FONT_FAMILY,
)


class PrimaryButton(QPushButton):
    def __init__(
        self,
        text: str,
        *,
        parent: QWidget | None = None,
        object_name: str | None = None,
        height: int = BUTTON_HEIGHT,
        radius: int = BUTTON_RADIUS,
        color: str = "orange",
    ):
        super().__init__(text, parent)
        if object_name:
            self.setObjectName(object_name)
        self.setFixedHeight(height)
        self.setCursor(Qt.PointingHandCursor)

        if color == "green":
            bg = COLOR_SUCCESS
            pressed_bg = COLOR_SUCCESS_PRESSED
        else:
            bg = COLOR_PRIMARY
            pressed_bg = COLOR_PRIMARY_PRESSED

        self.setStyleSheet(
            "QPushButton {"
            f"background-color: {bg};"
            f"color: {COLOR_TEXT_WHITE};"
            "border: none;"
            f"border-radius: {radius}px;"
            f"font-family: {FONT_FAMILY};"
            f"font-size: {FONT_BUTTON}px;"
            "font-weight: 900;"
            "}"
            "QPushButton:pressed:enabled {"
            f"background-color: {pressed_bg};"
            "}"
            "QPushButton:disabled {"
            f"background-color: {COLOR_DISABLED_BG};"
            f"color: {COLOR_DISABLED_TEXT};"
            "}"
        )


class SecondaryButton(QPushButton):
    def __init__(
        self,
        text: str,
        *,
        parent: QWidget | None = None,
        object_name: str | None = None,
        height: int = BUTTON_HEIGHT,
        radius: int = BUTTON_RADIUS,
    ):
        super().__init__(text, parent)
        if object_name:
            self.setObjectName(object_name)
        self.setFixedHeight(height)
        self.setCursor(Qt.PointingHandCursor)
        self.setStyleSheet(
            "QPushButton {"
            "background-color: #333333;"
            "color: #FFFFFF;"
            "border: none;"
            f"border-radius: {radius}px;"
            f"font-family: {FONT_FAMILY};"
            "font-size: 30px;"
            "font-weight: 800;"
            "}"
            "QPushButton:pressed {"
            "background-color: #555555;"
            "}"
        )
