from __future__ import annotations

from PySide6.QtWidgets import QPushButton, QWidget

from screens.base import BaseController


class RentSizeController(BaseController):
    route = "/rent-size"

    def __init__(self, app):
        super().__init__(app, self.route, "RentSizeSelection.ui")
        self.card_small = self.child("cardSize1", QWidget)
        self.card_large = self.child("cardSize2", QWidget)
        self.continue_button = self.child("btnContinue", QPushButton)
        self._base_styles = {
            "SMALL": self.card_small.styleSheet(),
            "LARGE": self.card_large.styleSheet(),
        }

        self.child("btnBack", QPushButton).clicked.connect(self.go_home)
        self.set_clickable(self.card_small, lambda: self._select_size("SMALL"))
        self.set_clickable(self.card_large, lambda: self._select_size("LARGE"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-plan"))

    def on_enter(self, data: dict | None = None) -> None:
        self._apply_selection(self.state.selected_size)

    def _select_size(self, size: str) -> None:
        self.state.selected_size = size
        self.state.selected_plan = None
        self.state.phone = None
        self.state.payment_method = None
        self.state.rental_data = None
        self.state.compartment_data = None
        self._apply_selection(size)

    def _apply_selection(self, size: str | None) -> None:
        self._style_card(self.card_small, "SMALL", size == "SMALL")
        self._style_card(self.card_large, "LARGE", size == "LARGE")
        self.continue_button.setEnabled(size in {"SMALL", "LARGE"})

    def _style_card(self, card: QWidget, key: str, selected: bool) -> None:
        style = self._base_styles[key]
        if selected:
            style += "\nborder: 4px solid #FF6600;"
        card.setStyleSheet(style)
