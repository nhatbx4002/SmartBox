from __future__ import annotations

from pathlib import Path
from typing import Callable

from PySide6.QtCore import QEvent, QObject, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QLabel, QPushButton, QWidget


class ErrorDialog(QWidget):
    """Full-screen overlay dialog for displaying errors without leaving the current screen."""

    def __init__(
        self,
        parent: QWidget,
        retry_callback: Callable[[], None] | None = None,
        go_home_callback: Callable[[], None] | None = None,
    ):
        super().__init__(parent)
        self.retry_callback = retry_callback
        self.go_home_callback = go_home_callback

        # Load the UI
        loader = QUiLoader()
        ui_path = Path(__file__).resolve().parents[1] / "ui" / "ErrorDialog.ui"
        self.ui = loader.load(str(ui_path), self)
        if self.ui is None:
            raise RuntimeError(f"Could not load UI file: {ui_path}")

        # Scale overlay to fill the parent widget
        parent_width = parent.width() if parent.width() > 0 else 720
        parent_height = parent.height() if parent.height() > 0 else 1280
        self.setGeometry(0, 0, parent_width, parent_height)
        self.ui.setGeometry(0, 0, parent_width, parent_height)

        # Get child widgets by object name
        self.dialog_card = self.ui.findChild(QWidget, "dialogCard")
        self.lbl_icon = self.ui.findChild(QLabel, "lblDialogIcon")
        self.lbl_title = self.ui.findChild(QLabel, "lblDialogTitle")
        self.lbl_message = self.ui.findChild(QLabel, "lblDialogMessage")
        self.lbl_hotline = self.ui.findChild(QLabel, "lblHotline")
        self.btn_retry = self.ui.findChild(QPushButton, "btnRetry")
        self.btn_gohome = self.ui.findChild(QPushButton, "btnGoHome")

        # Install event filter to capture touch/mouse events and prevent them from leaking through
        self.installEventFilter(self)

        # Connect button signals
        if self.btn_retry:
            self.btn_retry.setCursor(Qt.PointingHandCursor)
            self.btn_retry.clicked.connect(self._on_retry)
            if not self.retry_callback:
                self.btn_retry.setVisible(False)
                # If retry is hidden, center the Go Home button horizontally
                if self.btn_gohome:
                    card_width = self.dialog_card.width()
                    btn_width = self.btn_gohome.width()
                    new_x = (card_width - btn_width) // 2
                    self.btn_gohome.move(new_x, self.btn_gohome.y())

        if self.btn_gohome:
            self.btn_gohome.setCursor(Qt.PointingHandCursor)
            self.btn_gohome.clicked.connect(self._on_gohome)

        self.hide()

    def show_error(
        self,
        message: str,
        title: str = "ĐÃ XẢY RA LỖI",
        icon: str = "⚠️",
        hotline: str = "Hotline: 1900 1234",
    ) -> None:
        """Populates dialog labels and raises the overlay to the top."""
        if self.lbl_title:
            self.lbl_title.setText(title.upper())
        if self.lbl_message:
            self.lbl_message.setText(message)
        if self.lbl_icon:
            if icon.startswith(":/") or icon.endswith(".svg") or icon.endswith(".png"):
                self.lbl_icon.setPixmap(QPixmap(icon))
            elif icon == "⚠️":
                self.lbl_icon.setPixmap(QPixmap(":/assets/warning.svg"))
            elif icon in ("❌", "error"):
                self.lbl_icon.setPixmap(QPixmap(":/assets/error.svg"))
            else:
                self.lbl_icon.setText(icon)
        if self.lbl_hotline:
            self.lbl_hotline.setText(hotline)

        # Enable interactive buttons
        if self.btn_retry:
            self.btn_retry.setEnabled(True)
            self.btn_retry.setText("THỬ LẠI")
        if self.btn_gohome:
            self.btn_gohome.setEnabled(True)

        self.raise_()
        self.show()

    def set_loading_state(self, is_loading: bool) -> None:
        """Disables buttons and shows a loading text on retry when executing a callback."""
        if self.btn_retry:
            self.btn_retry.setEnabled(not is_loading)
            self.btn_retry.setText("ĐANG THỬ..." if is_loading else "THỬ LẠI")
        if self.btn_gohome:
            self.btn_gohome.setEnabled(not is_loading)

    def _on_retry(self) -> None:
        if self.retry_callback:
            self.set_loading_state(True)
            self.retry_callback()

    def _on_gohome(self) -> None:
        self.hide()
        if self.go_home_callback:
            self.go_home_callback()

    def eventFilter(self, watched: QObject, event: QEvent) -> bool:
        # Block all touch, mouse presses, and releases from leaking to widgets behind
        if event.type() in (
            QEvent.MouseButtonPress,
            QEvent.MouseButtonRelease,
            QEvent.MouseButtonDblClick,
            QEvent.MouseMove,
            QEvent.TouchBegin,
            QEvent.TouchUpdate,
            QEvent.TouchEnd,
        ):
            # If the user clicked inside the dialog card, let the event propagate normally
            if self.dialog_card:
                pos = self.mapToGlobal(event.pos() if hasattr(event, "pos") else self.dialog_card.pos())
                local_pos = self.dialog_card.mapFromGlobal(pos)
                if self.dialog_card.rect().contains(local_pos):
                    return False
            # Block interactions with the background (outside dialogCard)
            return True
        return super().eventFilter(watched, event)
