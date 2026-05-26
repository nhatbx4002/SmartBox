from __future__ import annotations

from PySide6.QtWidgets import QLabel

from screens.base import BaseController
from services.formatters import format_pin


class RentSuccessController(BaseController):
    route = "/rent-success"

    def __init__(self, app):
        super().__init__(app, self.route, "RentSuccess.ui")
        self.pin_label = self.child("lblPinCode", QLabel)
        self.locker_label = self.child("lblLockerInfo", QLabel)
        self.warning_label = self.child("lblPinWarning", QLabel)
        self.set_clickable(self.child("btnOpenNow"), lambda: self.navigate("/locker-open"))
        self.set_clickable(self.child("btnUseLater"), self.go_home)

    def on_enter(self, data: dict | None = None) -> None:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if rental is None or compartment is None:
            self.go_home()
            return

        self.pin_label.setText(format_pin(rental.pin))
        size_text = "Size 1 (Nhỏ)" if compartment.size == "SMALL" else "Size 2 (Lớn)"
        self.locker_label.setText(f"{self._locker_text()} - {size_text}")
        self.warning_label.setText(f"Mã này chỉ có hiệu lực đến {rental.expires_at}")

    def _locker_text(self) -> str:
        rental = self.state.rental_data
        compartment = self.state.compartment_data
        if compartment is None:
            return ""

        compartment_name = rental.compartment_name if rental and rental.compartment_name else compartment.name
        if "Ngăn" in compartment_name or compartment.locker_name in compartment_name:
            return compartment_name
        return f"{compartment.locker_name} - Ngăn {compartment_name}"
