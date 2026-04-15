from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

import requests
import yaml
import resources_rc  # noqa: F401
from PySide6.QtCore import QEvent, QTimer, Qt
from PySide6.QtUiTools import QUiLoader
from PySide6.QtWidgets import QApplication, QMainWindow, QMessageBox, QStackedWidget

from api_client import ApiClient
from app_state import AppState
from hardware import HardwareManager, LockerController
from screens import (
    HomeScreen,
    LoadingScreen,
    OpenBoxScreen,
    OtpInputScreen,
    PhoneInputScreen,
    RentPlanScreen,
    RentSuccessScreen,
    SizeSelectionScreen,
)


class SmartBoxApp(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self._qt_resources = resources_rc
        self.setWindowTitle("SmartBox")
        self.setFixedSize(800, 480)

        self.config = self._load_config()
        self.loader = QUiLoader()
        self.state = AppState()
        self.state.configure(
            countdown_default=int(self.config.get("app", {}).get("countdown_default", 60)),
            countdown_open=int(self.config.get("app", {}).get("countdown_open", 60)),
        )

        self.api = ApiClient(self.config.get("api", {}))
        self.hw = HardwareManager(self.config, parent=self)
        self.locker = LockerController(self.hw)
        self._click_map: Dict[int, object] = {}
        self._history = []
        self.current_screen_name: Optional[str] = None

        self.stack = QStackedWidget()
        self.setCentralWidget(self.stack)

        self.screens = {
            "home": HomeScreen(self),
            "otp_send": OtpInputScreen(self, flow_type="send"),
            "otp_receive": OtpInputScreen(self, flow_type="receive"),
            "size": SizeSelectionScreen(self),
            "plan": RentPlanScreen(self),
            "phone": PhoneInputScreen(self),
            "success": RentSuccessScreen(self),
            "open_box": OpenBoxScreen(self),
            "loading": LoadingScreen(self),
        }

        for screen in self.screens.values():
            self.stack.addWidget(screen.get_widget())

        self.hw.on_keypad(self._handle_keypad)
        self.locker.on_door_closed(self._on_door_closed)

        self._clock_timer = QTimer(self)
        self._clock_timer.timeout.connect(self._refresh_headers)
        self._clock_timer.start(1000)

        self.show_screen("home", remember=False)

    def _load_config(self) -> dict:
        config_path = Path(__file__).resolve().parent / "config.yaml"
        with open(config_path, "r", encoding="utf-8") as handle:
            return yaml.safe_load(handle) or {}

    def current_time_label(self) -> str:
        return datetime.now().strftime("%H:%M")

    def _refresh_headers(self) -> None:
        for screen in self.screens.values():
            screen.update_header_time()

    def eventFilter(self, watched, event):  # noqa: N802
        if id(watched) in self._click_map and event.type() == QEvent.MouseButtonRelease:
            if getattr(event, "button", lambda: None)() == Qt.LeftButton:
                handler = self._click_map[id(watched)]
                handler()
                return True
        return super().eventFilter(watched, event)

    def show_screen(self, name: str, *, remember: bool = True, **kwargs) -> None:
        if name not in self.screens:
            raise KeyError(f"Unknown screen: {name}")

        if self.current_screen_name is not None:
            current = self.screens[self.current_screen_name]
            current.on_exit()
            if remember and self.current_screen_name != name:
                self._history.append(self.current_screen_name)

        screen = self.screens[name]
        self.current_screen_name = name
        self.stack.setCurrentWidget(screen.get_widget())
        screen.on_enter(**kwargs)

    def go_back(self) -> None:
        if not self._history:
            self.go_home()
            return
        previous = self._history.pop()
        self.show_screen(previous, remember=False)

    def go_home(self) -> None:
        self._history.clear()
        self.state.reset_navigation_context()
        self.show_screen("home", remember=False)

    def show_error(self, message: str, title: str = "Loi") -> None:
        QMessageBox.warning(self, title, message)

    def show_support_dialog(self) -> None:
        hotline = self.config.get("support", {}).get("hotline", "1900 1234")
        QMessageBox.information(
            self,
            "Ho tro",
            f"Hotline ho tro: {hotline}\nTinh nang man hinh ho tro rieng se bo sung sau.",
        )

    def start_otp_flow(self, flow_type: str) -> None:
        self.state.reset_otp_flow()
        self.state.current_flow = flow_type
        route = "otp_send" if flow_type == "send" else "otp_receive"
        self.show_screen(route)

    def verify_otp(self, pin: str, flow_type: str) -> None:
        def _task():
            return self.api.verify_pin(pin, flow_type)

        def _success(payload) -> None:
            compartment = payload.get("compartmentId")
            if not compartment:
                self.show_error("Backend khong tra ve ngan tu.")
                self.go_home()
                return
            self.state.otp_compartment = compartment
            self.state.current_flow = flow_type
            self.open_compartment(compartment, source=flow_type)

        self.run_with_loading(
            title="Dang xac minh ma mo tu...",
            subtitle="He thong dang kiem tra thong tin.",
            task=_task,
            on_success=_success,
        )

    def create_rental(self, phone: str) -> None:
        size = self.state.selected_size
        plan = self.state.selected_plan
        if not size or not plan:
            self.show_error("Thieu thong tin size hoac goi thue.")
            return

        def _task():
            return self.api.create_rental(phone=phone, size=size, plan=plan)

        def _success(payload) -> None:
            self.state.rental_id = payload.get("rentalId")
            self.state.rental_pin = payload.get("pin")
            self.state.rental_compartment = payload.get("compartmentId")
            self.state.rental_expires_at = payload.get("expiresAt")
            self.show_screen("success", remember=False)

        self.run_with_loading(
            title="Dang tao phien thue...",
            subtitle="He thong dang cap ma mo tu cho ban.",
            task=_task,
            on_success=_success,
        )

    def open_compartment(self, compartment_id: str, *, source: str) -> None:
        self.state.current_flow = source
        self.state.prepare_open_box(compartment_id)
        self.show_screen("open_box", remember=False, compartment_id=compartment_id)

    def trigger_locker_open(self, compartment_id: str) -> None:
        try:
            self.api.open_locker(compartment_id)
        except requests.RequestException as exc:
            print(f"[API] open_locker failed for {compartment_id}: {exc}")
        self.locker.open_compartment(compartment_id)

    def complete_open_box(self) -> None:
        compartment_id = self.state.active_compartment
        if compartment_id:
            try:
                self.api.close_locker(compartment_id)
            except requests.RequestException as exc:
                print(f"[API] close_locker failed for {compartment_id}: {exc}")
            self.locker.close_compartment(compartment_id)
        self.state.reset_navigation_context()
        self.go_home()

    def _on_door_closed(self, compartment_id: str) -> None:
        if self.current_screen_name == "open_box" and compartment_id == self.state.active_compartment:
            open_box_screen: OpenBoxScreen = self.screens["open_box"]
            open_box_screen.handle_door_closed(compartment_id)

    def _handle_keypad(self, key: str) -> None:
        if self.current_screen_name is None:
            return
        screen = self.screens[self.current_screen_name]
        handled = screen.handle_keypad_input(key)
        if not handled:
            print(f"[KEYPAD] Unhandled key {key} on screen {self.current_screen_name}")

    def run_with_loading(self, *, title: str, subtitle: str, task, on_success) -> None:
        self.show_screen("loading", remember=False)
        loading_screen: LoadingScreen = self.screens["loading"]
        loading_screen.start_task(title=title, subtitle=subtitle, task=task, on_success=on_success)

    def handle_async_error(self, exc: Exception) -> None:
        if isinstance(exc, requests.HTTPError) and exc.response is not None:
            try:
                payload = exc.response.json()
            except ValueError:
                payload = {}
            message = payload.get("error") or f"Yeu cau that bai ({exc.response.status_code})."
        elif isinstance(exc, requests.RequestException):
            message = "Khong the ket noi backend mock server."
        else:
            message = str(exc) or exc.__class__.__name__
        self.show_error(message)
        self.go_home()


def main() -> int:
    app = QApplication(sys.argv)
    window = SmartBoxApp()
    window.show()
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
