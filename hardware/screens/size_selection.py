from __future__ import annotations

from screens.base_screen import BaseScreen


class SizeSelectionScreen(BaseScreen):
    def __init__(self, app) -> None:
        super().__init__(app, "SizeSelection.ui", title="Thuê tủ", show_back=True)
        self._reg(self.find("cardSize1"), lambda: self._select_size("SMALL"))
        self._reg(self.find("cardSize2"), lambda: self._select_size("LARGE"))

    def _select_size(self, size: str) -> None:
        if size == "LARGE":
            self.app.show_error("Hien tai da het tu size lon.")
            return
        self.app.state.selected_size = size
        self.app.show_screen("plan")
