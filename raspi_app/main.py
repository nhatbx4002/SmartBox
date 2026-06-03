import sys
from pathlib import Path
from urllib.parse import urlparse

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication, QStackedWidget, QVBoxLayout, QWidget
import yaml

import resources_rc
from screens.error import ErrorController
from screens.home import HomeController
from screens.locker_open import LockerOpenController
from screens.loading import LoadingController
from screens.otp import OtpController, OtpPickupController
from screens.payment import PaymentController
from screens.pickup_method import PickupMethodController
from screens.qr_payment import QRPaymentController
from screens.qr_scan import QRScanController
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
from services.network_status import NetworkStatusMonitor
from services.qr_camera import QrCameraScanner


class KioskApp(QWidget):
    def __init__(self):
        super().__init__()
        self.config = {}
        self.state = AppState()
        self.startup_error = None

        try:
            self.config = load_config()
            if self._is_provisioning_mode():
                self._provision_cabinet()
                self.config = load_config()

            self._load_normal_config()
            self.network_monitor = NetworkStatusMonitor(
                self,
                poll_interval_ms=get_config_value(self.config, "network.poll_interval_ms", 5000),
                interfaces=tuple(get_config_value(self.config, "network.interfaces", ["eth0", "wlan0"])),
            )
            self.network_monitor.start()
            self.api_client = ApiClient(
                base_url=get_config_value(self.config, "api.base_url", "http://localhost:5000"),
                timeout=get_config_value(self.config, "api.timeout", 10),
                mock=False,
            )
            self.api_client.jwt_token = self.jwt_token
            self.qr_scanner = QrCameraScanner(
                stream_url=get_config_value(self.config, "camera.stream_url", ""),
                size=(
                    int(get_config_value(self.config, "camera.preview_width", 640)),
                    int(get_config_value(self.config, "camera.preview_height", 480)),
                ),
            )

            # Assert hardware check (must find at least 1 I2C expander)
            discovery = GpioController(mock=False).discover_hardware(self.config)
            if not discovery.get("mcpDevices") or len(discovery["mcpDevices"]) == 0:
                raise RuntimeError("Không tìm thấy thiết bị I2C MCP23017 nào để điều khiển mạch khóa.")

            self.gpio_controller = GpioController(mock=False)
            self.gpio_controller.load_from_backend(self.api_client, self.cabinet_id)
            self.mqtt_client = MqttClient(self.config, cabinet_id=self.cabinet_id, mock=False)
            self.mqtt_client.connect(
                username=self.config.get("mqtt_username") or get_config_value(self.config, "mqtt.username", None),
                password=self.config.get("mqtt_password") or get_config_value(self.config, "mqtt.password", None),
            )
            self.mqtt_client.subscribe_unlock(self.cabinet_id, self.gpio_controller.unlock)
            self.mqtt_client.subscribe_lock(self.cabinet_id, self.gpio_controller.lock)
            self.mqtt_client.subscribe_config_reload(self.cabinet_id, self._on_config_reload)
            
            # Register watchdog failure callback
            self.mqtt_client.disconnect_callback = self._on_mqtt_failure

            self.heartbeat_timer = QTimer(self)
            self.heartbeat_timer.timeout.connect(self._publish_heartbeat)
            self.heartbeat_timer.start(int(get_config_value(self.config, "mqtt.heartbeat_interval_ms", 30000)))
            self._publish_heartbeat()
        except Exception as error:
            print(f"[FATAL STARTUP ERROR] {error}")
            self.startup_error = error

            # Provide fallback stubs so controllers registration works safely
            if not hasattr(self, "api_client"):
                self.api_client = ApiClient(mock=True)
            if not hasattr(self, "gpio_controller"):
                self.gpio_controller = GpioController(mock=True)
            if not hasattr(self, "mqtt_client"):
                self.mqtt_client = MqttClient(self.config, mock=True)
            if not hasattr(self, "network_monitor"):
                self.network_monitor = NetworkStatusMonitor(self)
                self.network_monitor.start()

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
        
        if self.startup_error:
            self.navigate("/error", {
                "title": "Không thể khởi động tủ",
                "message": str(self.startup_error),
                "retry_route": "/",
            }, replace=True)
        else:
            self.navigate("/", replace=True)

    def _is_provisioning_mode(self) -> bool:
        return bool(get_config_value(self.config, "provision.key"))

    def _provision_cabinet(self) -> None:
        gpio = GpioController(mock=False)
        discovery = gpio.discover_hardware(self.config)
        payload = {
            "provisionKey": get_config_value(self.config, "provision.key"),
            "hardwareSerial": discovery["hardwareSerial"],
            "deviceName": get_config_value(self.config, "provision.device_name"),
            "discoveredMcpDevices": discovery.get("mcpDevices", []),
            "firmwareVersion": discovery.get("firmwareVersion"),
            "piModel": discovery.get("piModel"),
        }
        provision_secret = get_config_value(self.config, "provision.secret")
        if provision_secret:
            payload["provisionSecret"] = provision_secret
        provision_code = get_config_value(self.config, "provision.code")
        if provision_code:
            payload["provisionCode"] = provision_code

        api_client = ApiClient(
            base_url=get_config_value(self.config, "api.base_url", "http://localhost:5000"),
            timeout=get_config_value(self.config, "api.timeout", 10),
            mock=False,
        )
        result = api_client.provision_cabinet(payload)
        self._save_provisioned_config(
            cabinet_id=result["cabinetId"],
            jwt_token=result["jwtToken"],
            mqtt_config=result.get("mqttConfig", {}),
            config_version=result.get("configVersion", 1),
        )
        print(f"[PROVISION] Registered: {result['cabinetId']}")

    def _save_provisioned_config(self, cabinet_id: str, jwt_token: str, mqtt_config: dict, config_version: int) -> None:
        config_path = Path(__file__).resolve().parent / "config.yaml"
        with config_path.open("r", encoding="utf-8") as file:
            cfg = yaml.safe_load(file) or {}

        for key in [
            "provision_key",
            "provision_secret",
            "provision_code",
            "location_id",
            "cabinet_name",
            "mcp_devices",
            "compartment_layout",
        ]:
            cfg.pop(key, None)
        cfg.pop("provision", None)

        cfg["cabinet_id"] = cabinet_id
        cfg["jwt_token"] = jwt_token
        cfg["config_version"] = int(config_version)

        hardware = cfg.setdefault("hardware", {})
        hardware["cabinet_id"] = cabinet_id

        mqtt_cfg = cfg.setdefault("mqtt", {})
        if mqtt_config.get("username"):
            mqtt_cfg["username"] = mqtt_config["username"]
        if mqtt_config.get("password"):
            mqtt_cfg["password"] = mqtt_config["password"]
        if mqtt_config.get("brokerUrl"):
            parsed = urlparse(str(mqtt_config["brokerUrl"]))
            if parsed.hostname:
                mqtt_cfg["broker"] = parsed.hostname
            if parsed.port:
                mqtt_cfg["port"] = parsed.port

        with config_path.open("w", encoding="utf-8") as file:
            yaml.safe_dump(cfg, file, default_flow_style=False, allow_unicode=True, sort_keys=False)

    def _load_normal_config(self) -> None:
        self.cabinet_id = self.config.get("cabinet_id") or get_config_value(self.config, "hardware.cabinet_id", "cabinet-a")
        self.jwt_token = self.config.get("jwt_token", "")

    def _on_config_reload(self, config_version: int | None, compartments: list) -> None:
        if config_version is None:
            return

        current_version = int(self.config.get("config_version", 0) or 0)
        if int(config_version) <= current_version:
            return

        print(f"[CONFIG] Reloading v{config_version} (from v{current_version})")
        self.gpio_controller.reload_config(compartments)
        self.config["config_version"] = int(config_version)
        try:
            self.api_client.confirm_config_applied(self.cabinet_id, int(config_version))
        except Exception as error:
            print(f"[CONFIG] confirm failed: {error}")
        print(f"[CONFIG] Applied v{config_version}")

    def _register_controllers(self) -> None:
        controller_types = [
            HomeController,
            PickupMethodController,
            OtpController,
            OtpPickupController,
            RentSizeController,
            RentPlanController,
            RentPhoneController,
            PaymentController,
            QRPaymentController,
            QRScanController,
            RentSuccessController,
            LockerOpenController,
            SupportController,
            LoadingController,
            ErrorController,
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

    def _publish_heartbeat(self) -> None:
        try:
            self.mqtt_client.publish_heartbeat()
            print(f"[heartbeat] published for cabinet={self.cabinet_id}")
        except Exception as error:
            print(f"[heartbeat] publish failed: {error}")

    def closeEvent(self, event) -> None:
        if hasattr(self, "heartbeat_timer"):
            self.heartbeat_timer.stop()
        if hasattr(self, "network_monitor"):
            self.network_monitor.stop()
        if hasattr(self, "mqtt_client"):
            self.mqtt_client.disconnect()
        super().closeEvent(event)

    def _on_mqtt_failure(self) -> None:
        print("[MQTT] Watchdog reconnect failure triggered")
        if self.current_route and self.current_route in self.controllers:
            controller = self.controllers[self.current_route]
            controller.show_error_dialog(
                message="Mất kết nối với máy chủ điều khiển MQTT. Đang tự động kết nối lại...",
                title="LỖI MẤT KẾT NỐI",
                on_retry=self._retry_mqtt,
            )

    def _retry_mqtt(self) -> None:
        try:
            self.mqtt_client.reconnect_attempts = 0
            self.mqtt_client._try_reconnect()
            if self.mqtt_client.connected:
                print("[MQTT] Watchdog retry successfully reconnected")
                if self.current_route and self.current_route in self.controllers:
                    self.controllers[self.current_route].hide_error_dialog()
            else:
                raise RuntimeError("Không thể kết nối đến MQTT broker.")
        except Exception as error:
            print(f"[MQTT Watchdog retry error] {error}")
            self._on_mqtt_failure()


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
