from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QVBoxLayout, QWidget

from screens.components.theme import (
    COLOR_BORDER,
    COLOR_PRIMARY,
    COLOR_SUCCESS,
    COLOR_SURFACE,
    COLOR_TEXT,
    COLOR_MUTED,
    FONT_FAMILY,
)


class SelectableCard(QFrame):
    def __init__(
        self,
        *,
        title: str,
        subtitle: str = "",
        trailing: str = "",
        parent: QWidget | None = None,
        object_name: str | None = None,
        min_height: int = 190,
        radius: int = 24,
        selected_color: str = "orange",
        horizontal: bool = False,
    ):
        super().__init__(parent)

        if object_name:
            self.setObjectName(object_name)

        self._radius = radius
        self._selected_color = selected_color
        self._selected = False

        self.setCursor(Qt.PointingHandCursor)
        self.setMinimumHeight(min_height)

        if horizontal:
            root_layout = QHBoxLayout(self)
            root_layout.setContentsMargins(36, 28, 36, 28)

            text_layout = QVBoxLayout()
            text_layout.setSpacing(12)

            self.title_label = QLabel(title, self)
            self.subtitle_label = QLabel(subtitle, self)

            text_layout.addWidget(self.title_label)
            if subtitle:
                text_layout.addWidget(self.subtitle_label)

            self.trailing_label = QLabel(trailing, self)
            self.trailing_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)

            root_layout.addLayout(text_layout)
            root_layout.addStretch()
            if trailing:
                root_layout.addWidget(self.trailing_label)
        else:
            root_layout = QVBoxLayout(self)
            root_layout.setContentsMargins(36, 32, 36, 32)
            root_layout.setSpacing(14)

            self.title_label = QLabel(title, self)
            self.subtitle_label = QLabel(subtitle, self)
            self.trailing_label = QLabel(trailing, self)

            root_layout.addWidget(self.title_label)
            if subtitle:
                root_layout.addWidget(self.subtitle_label)
            if trailing:
                root_layout.addWidget(self.trailing_label)

        self.title_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {COLOR_TEXT};"
            f"font-family: {FONT_FAMILY};"
            "font-size: 32px;"
            "font-weight: 800;"
        )

        self.subtitle_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {COLOR_MUTED};"
            f"font-family: {FONT_FAMILY};"
            "font-size: 20px;"
            "font-weight: 500;"
        )

        self.trailing_label.setStyleSheet(
            "background: transparent;"
            "border: none;"
            f"color: {COLOR_PRIMARY};"
            f"font-family: {FONT_FAMILY};"
            "font-size: 34px;"
            "font-weight: 900;"
        )

        self.set_selected(False)

    def set_selected(self, selected: bool) -> None:
        self._selected = selected

        if selected:
            if self._selected_color == "green":
                border = COLOR_SUCCESS
                bg = "#1A3A1A"
            else:
                border = COLOR_PRIMARY
                bg = "#1C1400"
        else:
            border = COLOR_BORDER
            bg = COLOR_SURFACE

        self.setStyleSheet(
            "QFrame {"
            f"background-color: {bg};"
            f"border: 3px solid {border};"
            f"border-radius: {self._radius}px;"
            "}"
            "QLabel {"
            "background-color: transparent;"
            "border: none;"
            "}"
            "QFrame:hover {"
            f"border: 3px solid {COLOR_PRIMARY};"
            "background-color: #1A1A1A;"
            "}"
        )

    def is_selected(self) -> bool:
        return self._selected

    def set_trailing(self, text: str) -> None:
        self.trailing_label.setText(text)

    def set_subtitle(self, text: str) -> None:
        self.subtitle_label.setText(text)

    def set_title(self, text: str) -> None:
        self.title_label.setText(text)