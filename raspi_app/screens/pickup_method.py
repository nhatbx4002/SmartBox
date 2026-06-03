from __future__ import annotations

from PySide6.QtWidgets import QPushButton

from screens.base import BaseController


class PickupMethodController(BaseController):
    route = "/pickup-method"

    def __init__(self, app):
        super().__init__(app, self.route, "PickupMethod.ui")
        self.child("btnBack", QPushButton).clicked.connect(self.go_back)
        self.set_clickable(self.child("pinCard"), self._open_pin)
        self.set_clickable(self.child("qrCard"), self._open_qr)

    def on_enter(self, data: dict | None = None) -> None:
        self.state.mode = "pickup"

    def _open_pin(self) -> None:
        self.state.mode = "pickup"
        self.navigate("/otp-pickup")

    def _open_qr(self) -> None:
        self.state.mode = "pickup"
        self.navigate("/qr-scan")
