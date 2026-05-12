from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QProgressBar

from screens.base import BaseController


class LoadingController(BaseController):
    route = "/loading"

    def __init__(self, app):
        super().__init__(app, self.route, "Loading.ui")
        self.message_label = self.child("lblProcessingText", QLabel)
        self.progress = self.child("progressVerify", QProgressBar)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.value = 0

    def on_enter(self, data: dict | None = None) -> None:
        self.message_label.setText((data or {}).get("message", "Đang xử lý..."))
        self.value = 0
        self.progress.setValue(0)
        self.timer.start(80)

    def on_exit(self) -> None:
        self.timer.stop()

    def _tick(self) -> None:
        self.value = (self.value + 3) % 101
        self.progress.setValue(self.value)
