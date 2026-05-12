from __future__ import annotations

from screens.base import BaseController


class HomeController(BaseController):
    route = "/"

    def __init__(self, app):
        super().__init__(app, self.route, "Dashboard.ui")
        self.set_clickable(self.child("SendCard"), self._deposit)
        self.set_clickable(self.child("ReceiveCard"), self._pickup)
        self.set_clickable(self.child("RentCard"), self._rent)
        self.set_clickable(self.child("SupportCard"), lambda: self.navigate("/support"))

    def _deposit(self) -> None:
        self.state.mode = "deposit"
        self.navigate("/otp")

    def _pickup(self) -> None:
        self.state.mode = "pickup"
        self.navigate("/otp")

    def _rent(self) -> None:
        self.state.mode = "rent"
        self.state.reset_rent_flow()
        self.navigate("/rent-size")
