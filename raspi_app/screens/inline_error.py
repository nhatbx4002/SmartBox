from __future__ import annotations

from pathlib import Path

from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QLabel, QWidget


class InlineError(QWidget):
    """Reusable inline error banner that can be embedded directly in other screens."""

    def __init__(self, parent: QWidget):
        super().__init__(parent)

        # Load the UI
        loader = QUiLoader()
        ui_path = Path(__file__).resolve().parents[1] / "ui" / "InlineError.ui"
        self.ui = loader.load(str(ui_path), self)
        if self.ui is None:
            raise RuntimeError(f"Could not load UI file: {ui_path}")

        # Get label widgets
        self.lbl_icon = self.ui.findChild(QLabel, "lblErrorIcon")
        self.lbl_message = self.ui.findChild(QLabel, "lblErrorMessage")

        self.hide()

    def show_error(self, message: str, icon: str = "⚠️") -> None:
        """Sets the error message and displays the banner."""
        if self.lbl_message:
            self.lbl_message.setText(message)
        if self.lbl_icon:
            self.lbl_icon.setText(icon)
        self.show()

    def clear(self) -> None:
        """Hides the error banner."""
        self.hide()

    def setGeometry(self, *args) -> None:
        """Overrides setGeometry to ensure the underlying UI widget stretches with the QWidget wrapper."""
        super().setGeometry(*args)
        if len(args) == 4:
            self.ui.setGeometry(0, 0, args[2], args[3])
        elif len(args) == 1 and hasattr(args[0], "width"):
            rect = args[0]
            self.ui.setGeometry(0, 0, rect.width(), rect.height())

