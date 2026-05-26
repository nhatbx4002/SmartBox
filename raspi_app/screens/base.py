from __future__ import annotations

from pathlib import Path
from typing import Any, Callable, TypeVar
from xml.etree import ElementTree

from PySide6.QtCore import QEvent, QObject, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QApplication, QLabel, QWidget

WidgetT = TypeVar("WidgetT", bound=QWidget)


class BaseController:
    def __init__(self, app: Any, route: str, ui_file: str):
        self.app = app
        self.route = route
        self.ui_file = ui_file
        self._click_filters: list[QObject] = []
        self.widget = self._load_ui(ui_file)

    @property
    def state(self):
        return self.app.state

    @property
    def config(self) -> dict:
        return self.app.config

    @property
    def api_client(self):
        return self.app.api_client

    @property
    def mqtt_client(self):
        return self.app.mqtt_client

    @property
    def gpio_controller(self):
        return self.app.gpio_controller

    def on_enter(self, data: dict | None = None) -> None:
        pass

    def on_exit(self) -> None:
        pass

    def navigate(self, route: str, data: dict | None = None, replace: bool = False) -> None:
        self.app.navigate(route, data=data, replace=replace)

    def go_home(self) -> None:
        self.navigate("/", replace=True)

    def go_back(self) -> None:
        self.app.go_back()

    def child(self, name: str, widget_type: type[WidgetT] | None = None) -> WidgetT | QWidget:
        found = self.widget.findChild(widget_type or QWidget, name)
        if found is None:
            raise AttributeError(f"{self.ui_file} does not contain widget {name!r}")
        return found

    def optional_child(self, name: str, widget_type: type[WidgetT] | None = None) -> WidgetT | QWidget | None:
        return self.widget.findChild(widget_type or QWidget, name)

    def set_clickable(self, widget: QWidget, callback: Callable[[], None]) -> None:
        click_filter = _ClickFilter(callback, widget)
        self._click_filters.append(click_filter)

        targets = [widget, *widget.findChildren(QWidget)]
        for target in targets:
            target.setCursor(Qt.PointingHandCursor)
            target.installEventFilter(click_filter)

    def refresh_style(self, widget: QWidget) -> None:
        widget.style().unpolish(widget)
        widget.style().polish(widget)
        widget.update()

    def set_selected_style(self, widget: QWidget, selected: bool) -> None:
        widget.setProperty("selected", "true" if selected else "false")
        self.refresh_style(widget)

    def _load_ui(self, ui_file: str) -> QWidget:
        loader = QUiLoader()
        path = Path(__file__).resolve().parents[1] / "ui" / ui_file
        widget = loader.load(str(path))
        if widget is None:
            raise RuntimeError(f"Could not load UI file: {path}")
        widget.setFixedSize(720, 1280)
        self._restore_file_pixmaps(widget, path)
        return widget

    def _restore_file_pixmaps(self, root_widget: QWidget, ui_path: Path) -> None:
        tree = ElementTree.parse(ui_path)
        for widget_node in tree.findall(".//widget[@class='QLabel']"):
            name = widget_node.attrib.get("name")
            pixmap_node = widget_node.find("./property[@name='pixmap']/pixmap")
            if not name or pixmap_node is None or not pixmap_node.text:
                continue

            pixmap_ref = pixmap_node.text.strip()
            if not pixmap_ref.startswith(":/assets/"):
                continue

            label = root_widget.findChild(QLabel, name)
            if label is None:
                continue

            pixmap = QPixmap(pixmap_ref)
            if pixmap.isNull():
                asset_name = pixmap_ref.removeprefix(":/assets/")
                asset_path = Path(__file__).resolve().parents[1] / "assets" / asset_name
                if asset_path.exists():
                    pixmap = QPixmap(str(asset_path))

            if not pixmap.isNull():
                label.setPixmap(pixmap)


def process_events() -> None:
    app = QApplication.instance()
    if app is not None:
        app.processEvents()


class _ClickFilter(QObject):
    def __init__(self, callback: Callable[[], None], parent: QObject | None = None):
        super().__init__(parent)
        self.callback = callback

    def eventFilter(self, watched: QObject, event: QEvent) -> bool:
        if event.type() == QEvent.MouseButtonRelease and event.button() == Qt.LeftButton:
            self.callback()
            return True
        return False
