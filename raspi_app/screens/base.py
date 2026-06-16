from __future__ import annotations

from pathlib import Path
from typing import Any, Callable, TypeVar
from xml.etree import ElementTree

from PySide6.QtCore import QEvent, QObject, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QApplication, QLabel, QWidget

from services.config_loader import get_config_value

WidgetT = TypeVar("WidgetT", bound=QWidget)


class BaseController:
    def __init__(self, app: Any, route: str, ui_file: str):
        self.app = app
        self.route = route
        self.ui_file = ui_file
        self._click_filters: list[QObject] = []
        self._network_status = "OFFLINE"
        self._footer_widget: QWidget | None = None
        self._footer_status_label: QLabel | None = None
        self._footer_status_dot: QWidget | None = None
        self.widget = self._load_ui(ui_file)
        self._attach_footer()
        self._bind_network_monitor()

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

    @property
    def network_status(self) -> str:
        monitor = getattr(self.app, "network_monitor", None)
        if monitor is not None:
            return getattr(monitor, "current_status", "OFFLINE")
        return self._network_status

    def on_enter(self, data: dict | None = None) -> None:
        pass

    def on_exit(self) -> None:
        pass

    def on_config_updated(self) -> None:
        """Called when cabinet config is reloaded (via MQTT or polling)."""
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

        # Scale stylesheets to increase font sizes for buttons and cards (1.25 factor)
        import re
        def scale_stylesheet_fonts(stylesheet: str, factor: float = 1.25) -> str:
            if not stylesheet:
                return stylesheet
            def repl(match):
                size = int(match.group(1))
                scaled = int(round(size * factor))
                return f"font-size: {scaled}px"
            return re.sub(r"font-size:\s*(\d+)\s*px", repl, stylesheet)

        widgets = [widget] + widget.findChildren(QWidget)
        for w in widgets:
            ss = w.styleSheet()
            if ss:
                w.setStyleSheet(scale_stylesheet_fonts(ss, 1.25))

        return widget

    def _attach_footer(self) -> None:
        footer = self.widget.findChild(QWidget, "DashboardFooterFrame")
        if footer is None:
            footer_path = Path(__file__).resolve().parents[1] / "ui" / "components" / "Footers.ui"
            if not footer_path.exists():
                return

            loader = QUiLoader()
            footer = loader.load(str(footer_path), self.widget)
            if footer is None:
                return

        footer.setParent(self.widget)
        footer.setAttribute(Qt.WA_TransparentForMouseEvents, True)
        footer.setGeometry(0, self.widget.height() - 48, self.widget.width(), 48)
        footer.raise_()
        self._footer_widget = footer
        version_label = footer.findChild(QLabel, "FooterVersionLabel")
        if version_label is not None:
            version_label.setText("Version v1.0")
        self._footer_status_label = footer.findChild(QLabel, "FooterStatusLabel")
        self._footer_status_dot = footer.findChild(QWidget, "FooterStatusDot")
        self._apply_network_status(self.network_status)

    def _bind_network_monitor(self) -> None:
        monitor = getattr(self.app, "network_monitor", None)
        if monitor is None:
            self._apply_network_status(self.network_status)
            return

        try:
            monitor.status_changed.connect(self._apply_network_status)
        except Exception:
            pass
        self._apply_network_status(getattr(monitor, "current_status", "OFFLINE"))

    def _apply_network_status(self, status: str) -> None:
        normalized = (status or "OFFLINE").upper()
        self._network_status = normalized

        color = "#00FF41" if normalized == "ONLINE" else "#EF4444"

        if self._footer_status_label is not None:
            self._footer_status_label.setText(normalized)
            self._footer_status_label.setStyleSheet(
                "background-color: transparent; border: none; "
                f"color: {color}; font-family: 'Be Vietnam Pro', 'Arial', sans-serif; "
                "font-size: 12px; font-weight: 700;"
            )

        if self._footer_status_dot is not None:
            self._footer_status_dot.setStyleSheet(
                f"background-color: {color}; border: none; border-radius: 4px;"
            )

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

    def show_error_dialog(
        self,
        message: str,
        title: str = "ĐÃ XẢY RA LỖI",
        on_retry: Callable[[], None] | None = None,
        on_gohome: Callable[[], None] | None = None,
    ) -> None:
        from screens.error_dialog import ErrorDialog

        if hasattr(self, "_error_dialog") and self._error_dialog:
            try:
                self._error_dialog.hide()
                self._error_dialog.deleteLater()
            except Exception:
                pass

        self._error_dialog = ErrorDialog(
            self.widget,
            retry_callback=on_retry,
            go_home_callback=on_gohome or self.go_home,
        )
        hotline = get_config_value(self.config, "support.hotline", "1900 1234")
        status = self.network_status
        detail_message = message
        if status == "OFFLINE" and "OFFLINE" not in detail_message.upper():
            detail_message = f"{message}\nTrạng thái mạng: {status}"
        self._error_dialog.show_error(
            detail_message,
            title=title,
            hotline=f"Hotline: {hotline} • {status}",
        )

    def hide_error_dialog(self) -> None:
        if hasattr(self, "_error_dialog") and self._error_dialog:
            try:
                self._error_dialog.hide()
            except Exception:
                pass



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
