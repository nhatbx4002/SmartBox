from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QLabel, QProgressBar, QVBoxLayout, QWidget

from screens.base import BaseController


class LoadingController(BaseController):
    route = "/loading"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

        self.message_label = self.child("lblProcessingText", QLabel)
        self.progress = self.child("progressVerify", QProgressBar)
        self.timer = QTimer(self.widget)
        self.timer.timeout.connect(self._tick)
        self.value = 0

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setSpacing(24)
        body.setAlignment(Qt.AlignCenter)

        spinner = QLabel("🔄", root)
        spinner.setAlignment(Qt.AlignCenter)
        spinner.setFixedHeight(100)
        spinner.setStyleSheet("background: transparent; border: none; font-size: 64px;")
        body.addWidget(spinner)

        self.lbl_msg = QLabel("Đang xử lý", root)
        self.lbl_msg.setObjectName("lblProcessingText")
        self.lbl_msg.setAlignment(Qt.AlignCenter)
        self.lbl_msg.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 24px; font-weight: 700;")
        body.addWidget(self.lbl_msg)

        progress = QProgressBar(root)
        progress.setObjectName("progressVerify")
        progress.setFixedSize(400, 12)
        progress.setRange(0, 100)
        progress.setValue(0)
        progress.setTextVisible(False)
        progress.setStyleSheet(
            "QProgressBar { background-color: #1C1B1B; border: none; border-radius: 6px; }"
            "QProgressBar::chunk { background-color: #FF6600; border-radius: 6px; }"
        )
        body.addWidget(progress, alignment=Qt.AlignCenter)

        layout.addLayout(body)
        return root

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
