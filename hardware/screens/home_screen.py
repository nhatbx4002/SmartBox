from __future__ import annotations

from screens.base_screen import BaseScreen


class HomeScreen(BaseScreen):
    def __init__(self, app) -> None:
        super().__init__(app, "Home.ui", title="Trang chinh", show_back=False)
        self._reg(self.find("cardSend"), lambda: self.app.start_otp_flow("send"))
        self._reg(self.find("cardReceive"), lambda: self.app.start_otp_flow("receive"))
        self._reg(self.find("cardRent"), lambda: self.app.show_screen("size"))
        self._reg(self.find("cardSupport"), self.app.show_support_dialog)
