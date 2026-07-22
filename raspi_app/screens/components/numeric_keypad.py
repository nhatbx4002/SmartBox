from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import QGridLayout, QPushButton, QWidget

from screens.components.theme import COLOR_BORDER, COLOR_CARD, COLOR_DISABLED_BG, COLOR_TEXT, FONT_FAMILY


class KeypadButton(QPushButton):
    def __init__(
        self,
        text: str,
        *,
        parent: QWidget | None = None,
        object_name: str | None = None,
        variant: str = "digit",
        width: int = 200,
        height: int = 96,
    ):
        super().__init__(text, parent)
        if object_name:
            self.setObjectName(object_name)
        self.setFixedSize(width, height)
        self.setCursor(Qt.PointingHandCursor)

        if variant == "action":
            self.setStyleSheet(
                "QPushButton {"
                f"background-color: {COLOR_DISABLED_BG};"
                "color: white;"
                "border: none;"
                "border-radius: 20px;"
                f"font-family: {FONT_FAMILY};"
                "font-size: 28px;"
                "font-weight: 700;"
                "}"
                "QPushButton:pressed {"
                "background-color: #555555;"
                "}"
            )
        else:
            self.setStyleSheet(
                "QPushButton {"
                f"background-color: {COLOR_CARD};"
                f"color: {COLOR_TEXT};"
                f"border: 2px solid {COLOR_BORDER};"
                "border-radius: 20px;"
                f"font-family: {FONT_FAMILY};"
                "font-size: 34px;"
                "font-weight: 700;"
                "}"
                "QPushButton:pressed {"
                "background-color: #2A2A2A;"
                "border-color: #2E7D32;"
                "}"
            )


class NumericKeypad(QWidget):
    digit_pressed = Signal(str)
    clear_pressed = Signal()
    backspace_pressed = Signal()

    def __init__(
        self,
        *,
        parent: QWidget | None = None,
        button_width: int = 200,
        button_height: int = 96,
        h_spacing: int = 18,
        v_spacing: int = 16,
        object_prefix: str = "btnKey",
        clear_object_name: str = "btnClear",
        backspace_object_name: str = "btnBackspace",
    ):
        super().__init__(parent)
        self.setObjectName("numericKeypad")
        self.setStyleSheet("background: transparent;")

        layout = QGridLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setHorizontalSpacing(h_spacing)
        layout.setVerticalSpacing(v_spacing)

        keys = [
            ("1", "digit"), ("2", "digit"), ("3", "digit"),
            ("4", "digit"), ("5", "digit"), ("6", "digit"),
            ("7", "digit"), ("8", "digit"), ("9", "digit"),
            ("C", "action"), ("0", "digit"), ("⌫", "action"),
        ]

        for index, (text, variant) in enumerate(keys):
            row = index // 3
            col = index % 3

            if text == "C":
                object_name = clear_object_name
            elif text == "⌫":
                object_name = backspace_object_name
            else:
                object_name = f"{object_prefix}{text}"

            button = KeypadButton(
                text,
                parent=self,
                object_name=object_name,
                variant=variant,
                width=button_width,
                height=button_height,
            )

            if text == "C":
                button.clicked.connect(self.clear_pressed.emit)
            elif text == "⌫":
                button.clicked.connect(self.backspace_pressed.emit)
            else:
                button.clicked.connect(lambda _checked=False, digit=text: self.digit_pressed.emit(digit))

            layout.addWidget(button, row, col)
