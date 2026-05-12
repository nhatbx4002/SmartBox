from __future__ import annotations

from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.config_loader import get_config_value


class SupportController(BaseController):
    route = "/support"

    def __init__(self, app):
        super().__init__(app, self.route, "Support.ui")
        self.child("btnBack", QPushButton).clicked.connect(self.go_home)
        self.hotline_label = self.child("lblHotline", QLabel)
        self.answers = {
            1: self.child("lblFaq1Answer", QLabel),
            2: self.child("lblFaq2Answer", QLabel),
            3: self.child("lblFaq3Answer", QLabel),
            4: self.child("lblFaq4Answer", QLabel),
        }
        for index in self.answers:
            self.set_clickable(self.child(f"faqItem{index}"), lambda value=index: self._expand(value))

    def on_enter(self, data: dict | None = None) -> None:
        self.hotline_label.setText(get_config_value(self.config, "support.hotline", "1900 1234"))
        self._expand(1)

    def _expand(self, active_index: int) -> None:
        for index, label in self.answers.items():
            label.setVisible(index == active_index)
