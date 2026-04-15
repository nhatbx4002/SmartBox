from __future__ import annotations

from typing import Callable, Optional

from PySide6.QtCore import QTimer, Qt
from PySide6.QtWidgets import QLabel, QProgressBar, QVBoxLayout

from screens.base_screen import BaseScreen


class LoadingScreen(BaseScreen):
    def __init__(self, app) -> None:
        super().__init__(app, "LoadingScreen.ui", title="Dang xu ly", show_back=False)
        self.label_title = QLabel("Dang xu ly...")
        self.label_title.setAlignment(Qt.AlignCenter)
        self.label_title.setStyleSheet("color: white; font-size: 28px; font-weight: bold;")

        self.label_subtitle = QLabel("Vui long cho trong giay lat.")
        self.label_subtitle.setAlignment(Qt.AlignCenter)
        self.label_subtitle.setStyleSheet("color: #AAAAAA; font-size: 14px;")

        self.progress = QProgressBar()
        self.progress.setRange(0, 0)
        self.progress.setTextVisible(False)
        self.progress.setFixedHeight(12)

        layout = self.content.layout()
        if layout is None:
            layout = QVBoxLayout(self.content)
        layout.setContentsMargins(80, 80, 80, 80)
        layout.setSpacing(20)
        layout.addStretch()
        layout.addWidget(self.label_title)
        layout.addWidget(self.label_subtitle)
        layout.addWidget(self.progress)
        layout.addStretch()

    def start_task(
        self,
        *,
        title: str,
        subtitle: str,
        task: Callable[[], object],
        on_success: Callable[[object], None],
        on_error: Optional[Callable[[Exception], None]] = None,
    ) -> None:
        self.label_title.setText(title)
        self.label_subtitle.setText(subtitle)

        def _run() -> None:
            try:
                result = task()
            except Exception as exc:  # noqa: BLE001
                if on_error is not None:
                    on_error(exc)
                else:
                    self.app.handle_async_error(exc)
                return
            on_success(result)

        QTimer.singleShot(120, _run)
