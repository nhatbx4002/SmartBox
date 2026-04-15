from __future__ import annotations

from PySide6.QtWidgets import QLabel, QPushButton

from screens.base_screen import BaseScreen


class RentSuccessScreen(BaseScreen):
    def __init__(self, app) -> None:
        super().__init__(app, "RentSuccessfull.ui", title="", show_back=True)
        self.label_subtitle = self.find("labelSubtitle", QLabel)
        self.label_pin = self.find("labelPinShow", QLabel)
        self.use_later = self.find("useLater", QPushButton)
        self.use_now = self.find("useNow", QPushButton)

        if self.use_later is not None:
            self._reg(self.use_later, self.app.go_home)
        if self.use_now is not None:
            self._reg(self.use_now, self._open_now)

    def on_enter(self, **kwargs) -> None:
        super().on_enter(**kwargs)
        size_label = "Tu Size 1" if self.app.state.selected_size == "SMALL" else "Tu Size 2"
        if self.label_subtitle is not None:
            self.label_subtitle.setText(size_label)
        if self.label_pin is not None:
            self.label_pin.setText(self.app.state.rental_pin or "------")

    def _open_now(self) -> None:
        compartment = self.app.state.rental_compartment
        if not compartment:
            self.app.show_error("Chua co thong tin ngan tu de mo.")
            return
        self.app.open_compartment(compartment, source="rental")
