from __future__ import annotations

from PySide6.QtWidgets import QPushButton, QWidget

from screens.base import BaseController
from screens.inline_error import InlineError


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

        self.error_banner = InlineError(self.widget)
        self.error_banner.setGeometry(60, 940, 600, 64)

        self.child("btnBack", QPushButton).clicked.connect(self.go_home)
        self.set_clickable(self.card_small, lambda: self._select_size("SMALL"))
        self.set_clickable(self.card_large, lambda: self._select_size("LARGE"))
        self.continue_button.clicked.connect(lambda: self.navigate("/rent-plan"))

    def on_enter(self, data: dict | None = None) -> None:
        self.error_banner.clear()
        self._apply_selection(self.state.selected_size)

    def _select_size(self, size: str) -> None:
        self.error_banner.clear()
        self._apply_selection(size)

        try:
            result = self.api_client.check_availability(size)
        except Exception:
            # Backend unreachable: don't block the flow on a check that already
            # repeats at /payment via create_rental.
            self.state.selected_size = size
            self.state.selected_plan = None
            self.state.selected_plan_group = None
            self.state.available_plans = []
            self.state.phone = None
            self.state.payment_method = None
            self.state.rental_data = None
            self.state.compartment_data = None
            return

        if not result.get("available"):
            size_label = "Size 1 (Nhỏ)" if size == "SMALL" else "Size 2 (Lớn)"
            self.error_banner.show_error(f"Hiện không còn ngăn trống cho {size_label}")
            self.continue_button.setEnabled(False)
            return

        self.state.selected_size = size
        self.state.selected_plan = None
        self.state.selected_plan_group = None
        self.state.available_plans = []
        self.state.phone = None
        self.state.payment_method = None
        self.state.rental_data = None
        self.state.compartment_data = None

    def _apply_selection(self, size: str | None) -> None:
        self._style_card(self.card_small, "SMALL", size == "SMALL")
        self._style_card(self.card_large, "LARGE", size == "LARGE")
        self.continue_button.setEnabled(size in {"SMALL", "LARGE"})

    def _style_card(self, card: QWidget, key: str, selected: bool) -> None:
        card.setStyleSheet(self._base_styles[key])
        if selected:
            name = card.objectName()
            card.setStyleSheet(
                f"QFrame#{name} {{ border: 4px solid #FF6A00; background-color: #1C1400; }}\n"
                + self._base_styles[key]
            )
