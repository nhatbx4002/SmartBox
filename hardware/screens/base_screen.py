from __future__ import annotations

from pathlib import Path
from typing import Callable, Optional

from PySide6.QtCore import QFile, Qt
from PySide6.QtWidgets import QLabel, QPushButton, QVBoxLayout, QWidget


class BaseScreen:
    uses_keypad = False

    def __init__(self, app, ui_filename: str, *, title: str = "", show_back: bool = False) -> None:
        self.app = app
        self.loader = app.loader
        self.ui_filename = ui_filename
        self.title = title
        self.show_back = show_back

        self._container = QWidget()
        self._container.setObjectName(f"{self.__class__.__name__}Container")
        self._container.setObjectName("screenContainer")
        self._container.setStyleSheet("#screenContainer { background-color: #0A0A0A; }")

        layout = QVBoxLayout(self._container)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        self.header = self._load_ui("ui/Components/Headers.ui")
        self.content = self._load_ui(f"ui/{ui_filename}")
        self.footer = self._load_ui("ui/Components/Footer2.ui" if show_back else "ui/Components/Footer.ui")

        if self.header is not None:
            layout.addWidget(self.header)
            self._configure_header()
        if self.content is not None:
            layout.addWidget(self.content, 1)
        else:
            placeholder = QWidget()
            layout.addWidget(placeholder, 1)
            self.content = placeholder
        if self.footer is not None:
            layout.addWidget(self.footer)
            self._configure_footer()

    def _project_root(self) -> Path:
        return Path(__file__).resolve().parent.parent

    def _load_ui(self, relative_path: str) -> Optional[QWidget]:
        file_path = self._project_root() / relative_path
        qfile = QFile(str(file_path))
        if not qfile.open(QFile.ReadOnly):
            return None
        try:
            return self.loader.load(qfile)
        finally:
            qfile.close()

    def _configure_header(self) -> None:
        if self.header is None:
            return
        label_system = self.header.findChild(QLabel, "labelSystem")
        if label_system is not None and self.title:
            label_system.setText(self.title.upper())
        self.update_header_time()

    def _configure_footer(self) -> None:
        if not self.show_back or self.footer is None:
            return
        btn_back = self.footer.findChild(QPushButton, "btnBack")
        btn_home = self.footer.findChild(QPushButton, "btnHome")
        if btn_back is not None:
            self._reg(btn_back, self.app.go_back)
        if btn_home is not None:
            self._reg(btn_home, self.app.go_home)

    def _reg(self, widget: QWidget, handler: Callable[[], None]) -> None:
        if widget is None:
            return
        widget.setCursor(Qt.PointingHandCursor)
        widget.installEventFilter(self.app)
        self.app._click_map[id(widget)] = handler

    def find(self, name: str, widget_type=None):
        return self.content.findChild(widget_type, name) if widget_type else self.content.findChild(QWidget, name)

    def update_header_time(self) -> None:
        if self.header is None:
            return
        label_time = self.header.findChild(QLabel, "labelTime")
        if label_time is not None:
            label_time.setText(self.app.current_time_label())

    def on_enter(self, **_kwargs) -> None:
        self.update_header_time()
        if self.uses_keypad:
            self.app.hw.show_keypad(self.app)

    def on_exit(self) -> None:
        if self.uses_keypad:
            self.app.hw.hide_keypad()

    def handle_keypad_input(self, key: str) -> bool:
        del key
        return False

    def get_widget(self) -> QWidget:
        return self._container
