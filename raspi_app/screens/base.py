from __future__ import annotations

from typing import Any, Callable, TypeVar

from PySide6.QtCore import QEvent, QObject, Qt
from PySide6.QtWidgets import QApplication, QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from services.config_loader import get_config_value

WidgetT = TypeVar("WidgetT", bound=QWidget)


class BaseController:
    def __init__(self, app: Any, route: str, *, widget: QWidget):
        self.app = app
        self.route = route
        self._click_filters: list[QObject] = []
        self._network_status = "OFFLINE"
        self._footer_widget: QWidget | None = None
        self._footer_status_label: QLabel | None = None
        self._footer_status_dot: QWidget | None = None
        self.widget = widget
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
            raise AttributeError(f"{self.route} does not contain widget {name!r}")
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

    def _build_footer(self) -> QFrame:
        footer = QFrame(self.widget)
        footer.setObjectName("DashboardFooterFrame")
        footer.setFixedHeight(48)
        footer.setStyleSheet("""
            QFrame#DashboardFooterFrame {
                background-color: #111111;
                border: none;
                border-top: 1px solid #222;
            }
        """)

        f_layout = QHBoxLayout(footer)
        f_layout.setContentsMargins(16, 0, 16, 0)

        self._footer_status_dot = QWidget(footer)
        self._footer_status_dot.setObjectName("FooterStatusDot")
        self._footer_status_dot.setFixedSize(8, 8)

        self._footer_status_label = QLabel(footer)
        self._footer_status_label.setObjectName("FooterStatusLabel")
        self._footer_status_label.setStyleSheet(
            "background: transparent; border: none; color: #EF4444;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 12px; font-weight: 700;"
        )

        version_label = QLabel("Version v1.0", footer)
        version_label.setObjectName("FooterVersionLabel")
        version_label.setStyleSheet(
            "background: transparent; border: none; color: #555;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 12px;"
        )
        version_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)

        f_layout.addWidget(self._footer_status_dot)
        f_layout.addSpacing(6)
        f_layout.addWidget(self._footer_status_label)
        f_layout.addStretch()
        f_layout.addWidget(version_label)

        return footer

    def _make_header(self, title: str, back_fn: Callable[[], None] | None = None) -> QFrame:
        header = QFrame(self.widget)
        header.setObjectName("headerFrame")
        header.setFixedHeight(80)
        header.setStyleSheet("""
            QFrame#headerFrame {
                background-color: #0A0A0A;
                border: none;
                border-bottom: 1px solid #222;
            }
        """)

        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(16, 0, 16, 0)

        if back_fn is not None:
            btn_back = QPushButton("\u2190", header)
            btn_back.setObjectName("btnBack")
            btn_back.setFixedSize(60, 60)
            btn_back.setCursor(Qt.PointingHandCursor)
            btn_back.setStyleSheet("""
                QPushButton {
                    background: transparent;
                    border: none;
                    color: #E8E8E8;
                    font-size: 32px;
                }
                QPushButton:pressed {
                    color: #FF6600;
                }
            """)
            btn_back.clicked.connect(back_fn)
            h_layout.addWidget(btn_back)

        title_label = QLabel(title, header)
        title_label.setStyleSheet(
            "background: transparent; border: none; color: #E8E8E8;"
            "font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            "font-size: 26px; font-weight: 900;"
        )
        h_layout.addWidget(title_label)
        h_layout.addStretch()

        return header

    def _make_btn(
        self, text: str, bg: str = "#FF6600", text_color: str = "#FFF",
        height: int = 88, radius: int = 18,
    ) -> QPushButton:
        btn = QPushButton(text)
        btn.setFixedHeight(height)
        btn.setCursor(Qt.PointingHandCursor)
        btn.setStyleSheet(
            f"QPushButton {{"
            f"  background-color: {bg}; color: {text_color};"
            f"  border: none; border-radius: {radius}px;"
            f"  font-family: 'Be Vietnam Pro', Arial, sans-serif;"
            f"  font-size: 24px; font-weight: 800;"
            f"}}"
            f"QPushButton:disabled {{"
            f"  background-color: #333; color: #777;"
            f"}}"
        )
        return btn

    def _make_card(
        self, bg: str = "#1C1B1B", border_color: str | None = None,
        radius: int = 20, min_height: int = 160,
    ) -> QFrame:
        card = QFrame()
        border = f"border: 3px solid {border_color};" if border_color else "border: 3px solid #2A2A2A;"
        card.setMinimumHeight(min_height)
        card.setStyleSheet(
            f"QFrame {{"
            f"  background-color: {bg}; {border}"
            f"  border-radius: {radius}px;"
            f"}}"
            f"QLabel {{ background: transparent; }}"
        )
        return card

    def _attach_footer(self) -> None:
        footer = self._build_footer()
        footer.setParent(self.widget)
        footer.setAttribute(Qt.WA_TransparentForMouseEvents, True)
        footer.setGeometry(0, self.widget.height() - 48, self.widget.width(), 48)
        footer.raise_()
        self._footer_widget = footer
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
                "background: transparent; border: none;"
                f"color: {color}; font-family: 'Be Vietnam Pro', 'Arial', sans-serif;"
                "font-size: 12px; font-weight: 700;"
            )

        if self._footer_status_dot is not None:
            self._footer_status_dot.setStyleSheet(
                f"background-color: {color}; border: none; border-radius: 4px;"
            )

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
            hotline=f"Hotline: {hotline} \u2022 {status}",
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
