from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QVBoxLayout, QWidget

from screens.components.theme import (
    BOTTOM_ACTION_HEIGHT,
    BOTTOM_ACTION_PADDING_BOTTOM,
    BOTTOM_ACTION_PADDING_TOP,
    PAGE_MARGIN_X,
)


class BottomActionBar(QFrame):
    def __init__(
        self,
        button: QWidget,
        *,
        parent: QWidget | None = None,
        height: int = BOTTOM_ACTION_HEIGHT,
        margin_x: int = PAGE_MARGIN_X,
        padding_top: int = BOTTOM_ACTION_PADDING_TOP,
        padding_bottom: int = BOTTOM_ACTION_PADDING_BOTTOM,
    ):
        super().__init__(parent)
        self.setObjectName("bottomActionBar")
        self.setFixedHeight(height)
        self.setStyleSheet(
            "QFrame#bottomActionBar {"
            "background: transparent;"
            "border: none;"
            "}"
        )

        layout = QVBoxLayout(self)
        layout.setContentsMargins(margin_x, padding_top, margin_x, padding_bottom)
        layout.setSpacing(0)
        layout.setAlignment(Qt.AlignBottom)

        layout.addWidget(button)