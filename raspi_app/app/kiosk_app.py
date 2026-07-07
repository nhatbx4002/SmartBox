from __future__ import annotations

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QStackedWidget, QVBoxLayout, QWidget

from screens.error import ErrorController
from screens.home import HomeController
from screens.locker_open import LockerOpenController
from screens.loading import LoadingController
from screens.otp import OtpController, OtpPickupController
from screens.pairing_screen import PairingController
from screens.pairing_success_screen import PairingSuccessController
from screens.payment import PaymentController
from screens.pickup_method import PickupMethodController
from screens.qr_payment import QRPaymentController
from screens.qr_scan import QRScanController
from screens.rent_phone import RentPhoneController
from screens.rent_plan import RentPlanController
from screens.rent_plan_options import RentPlanOptionsController
from screens.rent_size import RentSizeController
from screens.rent_success import RentSuccessController
from screens.support import SupportController
from services.api_client import ApiClient
from services.app_state import AppState
from services.config_loader import (
    get_config_value,
    is_paired,
    is_pairing_in_progress,
    load_config,
    save_config,
)
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
        self.startup_route = "/"
        self.startup_data: dict = {}

        try:
            self.config = load_config()
            raw_ifaces = get_config_value(self.config, "network.interfaces", None)
            self.network_monitor = NetworkStatusMonitor(
                self,
                poll_interval_ms=get_config_value(self.config, "network.poll_interval_ms", 5000),
                interfaces=tuple(raw_ifaces) if raw_ifaces else None,
            )
            self.network_monitor.start()
            self.api_client = ApiClient(
                base_url=get_config_value(self.config, "api.base_url", "http://localhost:3001"),
                timeout=get_config_value(self.config, "api.timeout", 10),
            )
            self.gpio_controller = GpioController()
            self.mqtt_client = MqttClient(self.config, cabinet_id="demo")
            camera_stream_url = str(get_config_value(self.config, "camera.stream_url", "") or "").strip()
            camera_source = (
                camera_stream_url
                if camera_stream_url
                else int(get_config_value(self.config, "camera.device_index", 0))
            )
            self.qr_scanner = QrCameraScanner(
                stream_url=camera_source,
                backend=str(get_config_value(self.config, "camera.backend", "opencv")),
                size=(
                    int(get_config_value(self.config, "camera.preview_width", 640)),
                    int(get_config_value(self.config, "camera.preview_height", 480)),
                ),
            )

            from app.pairing_manager import PairingManager
            self.pairing = PairingManager(self)

            self._load_normal_config()
            if is_paired(self.config):
                self._start_paired_runtime()
                self.startup_route = "/"
            elif is_pairing_in_progress(self.config):
                self.startup_route = "/pairing"
                self.startup_data = self.pairing.resume_pairing_flow()
            else:
                self.startup_route = "/pairing"
                self.startup_data = self.pairing.start_pairing_flow()
        except Exception as error:
            print(f"[FATAL STARTUP ERROR] {error}")
            self.startup_error = error

            if not hasattr(self, "api_client"):
                self.api_client = ApiClient()
            if not hasattr(self, "gpio_controller"):
                self.gpio_controller = GpioController()
            if not hasattr(self, "mqtt_client"):
                self.mqtt_client = MqttClient(self.config, cabinet_id="demo")
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
            self.navigate(
                "/error",
                {
                    "title": "Không thể khởi động tủ",
                    "message": str(self.startup_error),
                    "retry_route": "/",
                },
                replace=True,
            )
        elif self.startup_route == "/pairing":
            self.navigate("/pairing", self.startup_data, replace=True)
        else:
            self.navigate("/", replace=True)

    def _is_provisioning_mode(self) -> bool:
        return False

    def _provision_cabinet(self) -> dict:
        return self.pairing.start_pairing_flow()

    def apply_pairing_result(self, result: dict) -> None:
        self.pairing.apply_pairing_result(result)

    def restart_pairing_flow(self) -> dict:
        return self.pairing.restart_pairing_flow()

    def _start_pairing_flow(self) -> dict:
        return self.pairing.start_pairing_flow()

    def _resume_pairing_flow(self) -> dict:
        return self.pairing.resume_pairing_flow()

    def _load_normal_config(self) -> None:
        self.cabinet_id = self.config.get("cabinet_id") or get_config_value(
            self.config, "hardware.cabinet_id", "cabinet-a"
        )
        self.jwt_token = self.config.get("jwt_token", "")

    def _start_paired_runtime(self) -> None:
        self.api_client.jwt_token = self.jwt_token
        self.gpio_controller._config = self.config
        from screens.base import run_in_thread

        run_in_thread(
            lambda: self.gpio_controller.load_from_backend(self.api_client, self.cabinet_id),
            lambda _: None,
            lambda e: print(f"[GPIO] load_from_backend failed: {e}"),
        )

        if hasattr(self, "mqtt_client") and self.mqtt_client:
            try:
                self.mqtt_client.disconnect()
            except Exception:
                pass

        self.mqtt_client = MqttClient(self.config, cabinet_id=self.cabinet_id)
        self.mqtt_client.set_unlock_callback(self._handle_unlock_command)
        self.mqtt_client.set_config_reload_callback(self._on_config_reload)
        self.mqtt_client.set_payment_callback(self._handle_payment_paid)
        self.mqtt_client.connect()

        if not hasattr(self, "heartbeat_timer"):
            self.heartbeat_timer = QTimer(self)
            self.heartbeat_timer.timeout.connect(self._publish_heartbeat)
        self.heartbeat_timer.start(int(get_config_value(self.config, "mqtt.heartbeat_interval_ms", 30000)))
        self._publish_heartbeat()

        if not hasattr(self, "config_poll_timer"):
            self.config_poll_timer = QTimer(self)
            self.config_poll_timer.timeout.connect(self._poll_config)
        self.config_poll_timer.start(30000)
        self._poll_config(force=True)

    def _handle_payment_paid(self, order_code, payload) -> None:
        controller = self.controllers.get(self.current_route)
        if controller is not None and hasattr(controller, "on_payment_paid"):
            controller.on_payment_paid(order_code, payload)

    def _poll_config(self, force: bool = False) -> None:
        if not force and hasattr(self, "mqtt_client") and self.mqtt_client.connected:
            return

        from screens.base import run_in_thread

        def _fetch():
            current_version = int(self.config.get("config_version", 0) or 0) or None
            return self.api_client.get_cabinet_config(self.cabinet_id, version=current_version)

        def _on_done(result):
            self._on_config_reload(
                result.get("configVersion"),
                result.get("compartments", []),
                mcp_devices=None,
                cabinet_status=result.get("status"),
            )

        run_in_thread(_fetch, _on_done, lambda e: print(f"[CONFIG POLL] failed: {e}"))

    def _on_config_reload(self, config_version: int | None, compartments: list, mcp_devices: list | None = None, cabinet_status: str | None = None) -> None:
        if config_version is None and cabinet_status is None:
            return

        if config_version is not None:
            current_version = int(self.config.get("config_version", 0) or 0)
            if int(config_version) > current_version:
                self._apply_config_snapshot(int(config_version), compartments, mcp_devices, cabinet_status)
                return

        if cabinet_status is not None and cabinet_status != self.config.get("cabinet_status"):
            self.config["cabinet_status"] = cabinet_status
            self.gpio_controller._config["cabinet_status"] = cabinet_status
            save_config(self.config)
            controller = self.controllers.get(self.current_route)
            if controller is not None:
                controller.on_config_updated()

    def _apply_config_snapshot(self, config_version: int, compartments: list, mcp_devices: list | None = None, cabinet_status: str | None = None) -> None:
        if mcp_devices is not None:
            self.gpio_controller._cache_mcp_devices(mcp_devices)
            self.config["mcpDevices"] = mcp_devices
            self.config["mcp_devices"] = mcp_devices
        if cabinet_status is not None:
            self.config["cabinet_status"] = cabinet_status
            self.gpio_controller._config["cabinet_status"] = cabinet_status
        self.gpio_controller.reload_config(compartments)
        self.config["config_version"] = int(config_version)
        self.config["compartments"] = compartments
        save_config(self.config)

        controller = self.controllers.get(self.current_route)
        if controller is not None:
            controller.on_config_updated()

    def _handle_unlock_command(self, compartment_id: str) -> bool:
        if compartment_id not in self.gpio_controller.lock_targets:
            self._reload_config_from_backend()
        return self.gpio_controller.unlock(compartment_id)

    def _reload_config_from_backend(self) -> bool:
        try:
            result = self.api_client.get_cabinet_config(self.cabinet_id)
            version = int(result.get("configVersion", self.config.get("config_version", 0)) or 0)
            self._apply_config_snapshot(
                version, result.get("compartments", []), result.get("mcpDevices", []), cabinet_status=result.get("status")
            )
            return True
        except Exception as error:
            print(f"[CONFIG] backend reload failed: {error}")
            return False

    def _register_controllers(self) -> None:
        controller_types = [
            HomeController,
            PickupMethodController,
            OtpController,
            OtpPickupController,
            RentSizeController,
            RentPlanController,
            RentPlanOptionsController,
            RentPhoneController,
            PaymentController,
            QRPaymentController,
            QRScanController,
            RentSuccessController,
            LockerOpenController,
            SupportController,
            LoadingController,
            ErrorController,
            PairingController,
            PairingSuccessController,
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
            self.mqtt_client.disconnect()
            self.mqtt_client.connect()
            if self.mqtt_client.connected:
                if self.current_route and self.current_route in self.controllers:
                    self.controllers[self.current_route].hide_error_dialog()
            else:
                raise RuntimeError("Khong the ket noi MQTT broker.")
        except Exception as error:
            print(f"[MQTT Watchdog retry error] {error}")
            self._on_mqtt_failure()
