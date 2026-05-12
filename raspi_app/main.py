import sys

from PySide6.QtWidgets import QApplication, QStackedWidget, QVBoxLayout, QWidget

import resources_rc
from screens.home import HomeController
from screens.locker_open import LockerOpenController
from screens.loading import LoadingController
from screens.otp import OtpController
from screens.payment import PaymentController
from screens.qr_payment import QRPaymentController
from screens.rent_phone import RentPhoneController
from screens.rent_plan import RentPlanController
from screens.rent_size import RentSizeController
from screens.rent_success import RentSuccessController
from screens.support import SupportController
from services.api_client import ApiClient
from services.app_state import AppState
from services.config_loader import get_config_value, load_config
from services.gpio_controller import GpioController
from services.mqtt_client import MqttClient


class KioskApp(QWidget):
    def __init__(self):
        super().__init__()
        self.config = load_config()
        self.state = AppState()
        self.api_client = ApiClient(
            base_url=get_config_value(self.config, "api.base_url", "http://localhost:5000"),
            timeout=get_config_value(self.config, "api.timeout", 10),
            mock=True,
        )
        self.mqtt_client = MqttClient(mock=True)
        self.gpio_controller = GpioController(mock=True)
        self.stack = QStackedWidget(self)
        self.controllers = {}
        self.history: list[str] = []
        self.current_route: str | None = None

        width = get_config_value(self.config, "app.screen_width", 720)
        height = get_config_value(self.config, "app.screen_height", 1280)
        self.setFixedSize(width, height)
        self.setWindowTitle("SmartBox Kiosk")

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.stack)

        self._register_controllers()
        self.navigate("/", replace=True)

    def _register_controllers(self) -> None:
        controller_types = [
            HomeController,
            OtpController,
            RentSizeController,
            RentPlanController,
            RentPhoneController,
            PaymentController,
            QRPaymentController,
            RentSuccessController,
            LockerOpenController,
            SupportController,
            LoadingController,
        ]
        for controller_type in controller_types:
            controller = controller_type(self)
            self.controllers[controller.route] = controller
            self.stack.addWidget(controller.widget)

    def navigate(self, route: str, data: dict | None = None, replace: bool = False) -> None:
        if route not in self.controllers:
            raise KeyError(f"Unknown route: {route}")

        if self.current_route is not None:
            self.controllers[self.current_route].on_exit()
            if not replace and self.current_route != route:
                self.history.append(self.current_route)

        controller = self.controllers[route]
        self.current_route = route
        self.stack.setCurrentWidget(controller.widget)
        controller.on_enter(data or {})

    def go_back(self) -> None:
        if not self.history:
            self.navigate("/", replace=True)
            return
        route = self.history.pop()
        self.navigate(route, replace=True)


def main():
    app = QApplication(sys.argv)

    app.setStyleSheet("""
        * {
            background-color: #0A0A0A;
            font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
        }
        QLabel, QPushButton, QFrame {
            background-color: transparent;
        }
    """)

    window = KioskApp()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
