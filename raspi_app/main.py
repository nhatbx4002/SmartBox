from __future__ import annotations

import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication, QStackedWidget, QVBoxLayout, QWidget

import resources_rc
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
from screens.rent_size import RentSizeController
from screens.rent_success import RentSuccessController
from screens.support import SupportController
from services.api_client import ApiClient
from services.app_state import AppState
from services.config_loader import (
    get_config_value,
    get_pairing_session_id,
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
            self.network_monitor = NetworkStatusMonitor(
                self,
                poll_interval_ms=get_config_value(self.config, "network.poll_interval_ms", 5000),
                interfaces=tuple(get_config_value(self.config, "network.interfaces", ["eth0", "wlan0"])),
            )
            self.network_monitor.start()
            self.api_client = ApiClient(
                base_url=get_config_value(self.config, "api.base_url", "http://localhost:3001"),
                timeout=get_config_value(self.config, "api.timeout", 10),
                mock=False,
            )
            self.gpio_controller = GpioController(mock=False)
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

            self._load_normal_config()
            if is_paired(self.config):
                self._start_paired_runtime()
                self.startup_route = "/"
            elif is_pairing_in_progress(self.config):
                self.startup_route = "/pairing"
                self.startup_data = self._resume_pairing_flow()
            else:
                self.startup_route = "/pairing"
                self.startup_data = self._start_pairing_flow()
        except Exception as error:
            print(f"[FATAL STARTUP ERROR] {error}")
            self.startup_error = error

            if not hasattr(self, "api_client"):
                self.api_client = ApiClient(mock=False)
            if not hasattr(self, "gpio_controller"):
                self.gpio_controller = GpioController(mock=False)
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
                    "title": "KhĂ´ng thá»ƒ khá»Ÿi Ä‘á»™ng tá»§",
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
        return self._start_pairing_flow()

    def _start_pairing_flow(self) -> dict:
        discovery = self.gpio_controller.discover_hardware(self.config)
        result = self.api_client.start_pairing(
            hardwareSerial=discovery["hardwareSerial"],
            discoveredMcpDevices=discovery.get("mcpDevices", []),
        )

        expires_at = result.get("expiresAt")
        if not expires_at:
            expires_seconds = int(result.get("expiresInSeconds", 600))
            expires_at = (datetime.now(timezone.utc) + timedelta(seconds=expires_seconds)).isoformat()

        pairing_data = {
            "sessionId": result.get("sessionId") or result.get("id"),
            "pairingCode": result.get("pairingCode", ""),
            "expiresAt": expires_at,
            "hardwareSerial": discovery.get("hardwareSerial", ""),
            "mcpDevices": discovery.get("mcpDevices", []),
        }
        self._save_pairing_state(pairing_data, discovery)
        self.state.pairing_status = "PAIRING"
        self.state.pairing_session_id = pairing_data["sessionId"]
        self.state.pairing_code = pairing_data["pairingCode"]
        self.state.pairing_expires_at = self._parse_datetime(pairing_data["expiresAt"])
        self.state.discovered_mcp_devices = list(pairing_data["mcpDevices"] or [])

        # Start MQTT for pairing
        if hasattr(self, "mqtt_client") and self.mqtt_client:
            try:
                self.mqtt_client.disconnect()
            except Exception:
                pass
        self.mqtt_client = MqttClient(self.config, cabinet_id=pairing_data["sessionId"])
        self.mqtt_client.connect()

        return pairing_data

    def _resume_pairing_flow(self) -> dict:
        session_id = get_pairing_session_id(self.config)
        if not session_id:
            return self._start_pairing_flow()

        pairing_data = {
            "sessionId": session_id,
            "pairingCode": get_config_value(self.config, "pairing_code", ""),
            "expiresAt": get_config_value(self.config, "pairing_expires_at", ""),
            "hardwareSerial": get_config_value(self.config, "hardware_serial", ""),
            "mcpDevices": get_config_value(self.config, "discovered_mcp_devices", []),
        }
        self.state.pairing_status = "PAIRING"
        self.state.pairing_session_id = session_id
        self.state.pairing_code = pairing_data["pairingCode"]
        self.state.pairing_expires_at = self._parse_datetime(pairing_data["expiresAt"])
        self.state.discovered_mcp_devices = list(pairing_data["mcpDevices"] or [])

        # Start MQTT for pairing
        if hasattr(self, "mqtt_client") and self.mqtt_client:
            try:
                self.mqtt_client.disconnect()
            except Exception:
                pass
        self.mqtt_client = MqttClient(self.config, cabinet_id=session_id)
        self.mqtt_client.connect()

        return pairing_data

    def apply_pairing_result(self, result: dict) -> None:
        # Idempotency: skip if already paired with the same cabinet_id
        new_cabinet_id = str(result.get("cabinetId") or result.get("cabinet_id") or "")
        existing_cabinet_id = str(self.config.get("cabinet_id") or "")
        if existing_cabinet_id and new_cabinet_id and existing_cabinet_id == new_cabinet_id:
            print(f"[PAIRING] Already paired with cabinet {new_cabinet_id}, skipping apply_pairing_result")
            return

        updated_config = dict(self.config)
        mqtt_config = result.get("mqttConfig", {})
        cabinet_id = new_cabinet_id or str(updated_config.get("cabinet_id") or "")
        jwt_token = str(result.get("jwt") or result.get("jwtToken") or result.get("jwt_token") or updated_config.get("jwt_token") or "")

        updated_config["cabinet_id"] = cabinet_id
        updated_config["jwt_token"] = jwt_token
        updated_config["config_version"] = int(
            result.get("configVersion", result.get("config_version", updated_config.get("config_version", 1)))
        )
        updated_config["pairing_session_id"] = get_pairing_session_id(self.config) or result.get("id") or ""
        updated_config["pairing_code"] = self.state.pairing_code or updated_config.get("pairing_code", "")
        if self.state.pairing_expires_at is not None:
            updated_config["pairing_expires_at"] = self.state.pairing_expires_at.isoformat()
        updated_config["pairing_status"] = "APPROVED"

        if result.get("compartments") is not None:
            updated_config["compartments"] = result.get("compartments", [])
        if result.get("mcpDevices") is not None:
            devices = result.get("mcpDevices", [])
            updated_config["mcpDevices"] = devices
            updated_config["mcp_devices"] = devices
            updated_config["discovered_mcp_devices"] = devices
        if result.get("hardwareSerial"):
            updated_config["hardware_serial"] = result["hardwareSerial"]

        hardware = updated_config.setdefault("hardware", {})
        hardware["cabinet_id"] = cabinet_id

        mqtt_cfg = updated_config.setdefault("mqtt", {})
        if mqtt_config.get("brokerUrl"):
            parsed = urlparse(str(mqtt_config["brokerUrl"]))
            if parsed.hostname:
                mqtt_cfg["broker"] = parsed.hostname
            if parsed.port:
                mqtt_cfg["port"] = parsed.port
        if mqtt_config.get("username"):
            mqtt_cfg["username"] = mqtt_config["username"]
        if mqtt_config.get("password"):
            mqtt_cfg["password"] = mqtt_config["password"]

        save_config(updated_config)
        self.config = load_config()
        self.state.reset_pairing_flow()
        self._load_normal_config()

        # Set up API client and GPIO before MQTT (so polling works even if MQTT fails)
        self.cabinet_id = cabinet_id
        self.jwt_token = jwt_token
        self.api_client.jwt_token = jwt_token
        print(f"[PAIRING] jwt_token set: {jwt_token[:20]}...")
        self.gpio_controller._config = self.config

        # Start config polling even if MQTT is not ready yet (delay first poll by 5s to avoid firing before paired_runtime sets things up)
        if not hasattr(self, "config_poll_timer"):
            self.config_poll_timer = QTimer(self)
            self.config_poll_timer.timeout.connect(self._poll_config)
        self.config_poll_timer.start(30000)
        # Only poll if cabinet_id is available; otherwise wait for paired_runtime
        if cabinet_id:
            self._poll_config()

        try:
            self._start_paired_runtime()
        except Exception as error:
            print(f"[PAIRING] MQTT connect failed (will retry): {error}")
            # Pi still works without MQTT — config polling handles updates

    def restart_pairing_flow(self) -> dict:
        self.state.reset_pairing_flow()
        for key in [
            "pairing_session_id",
            "pairing_code",
            "pairing_expires_at",
            "pairing_status",
            "hardware_serial",
            "firmware_version",
            "pi_model",
            "discovered_mcp_devices",
        ]:
            self.config.pop(key, None)
        save_config(self.config)
        data = self._start_pairing_flow()
        if hasattr(self, "controllers") and "/pairing" in self.controllers:
            self.navigate("/pairing", data, replace=True)
        return data

    def _save_pairing_state(self, pairing_data: dict, discovery: dict) -> None:
        self.config["pairing_session_id"] = pairing_data.get("sessionId", "")
        self.config["pairing_code"] = pairing_data.get("pairingCode", "")
        self.config["pairing_expires_at"] = pairing_data.get("expiresAt", "")
        self.config["pairing_status"] = "PAIRING"
        self.config["hardware_serial"] = discovery.get("hardwareSerial", "")
        self.config["firmware_version"] = discovery.get("firmwareVersion", "")
        self.config["pi_model"] = discovery.get("piModel", "")
        self.config["discovered_mcp_devices"] = pairing_data.get("mcpDevices", [])
        save_config(self.config)

    def _parse_datetime(self, value: str | None):
        if not value:
            return None
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except ValueError:
            return None

    def _load_normal_config(self) -> None:
        self.cabinet_id = self.config.get("cabinet_id") or get_config_value(self.config, "hardware.cabinet_id", "cabinet-a")
        self.jwt_token = self.config.get("jwt_token", "")

    def _start_paired_runtime(self) -> None:
        self.api_client.jwt_token = self.jwt_token
        self.gpio_controller._config = self.config
        self.gpio_controller.load_from_backend(self.api_client, self.cabinet_id)

        if hasattr(self, "mqtt_client") and self.mqtt_client:
            try:
                self.mqtt_client.disconnect()
            except Exception:
                pass

        self.mqtt_client = MqttClient(self.config, cabinet_id=self.cabinet_id)
        self.mqtt_client.set_unlock_callback(self._handle_unlock_command)
        self.mqtt_client.set_lock_callback(self._handle_lock_command)
        self.mqtt_client.set_config_reload_callback(self._on_config_reload)
        self.mqtt_client.connect()

        if not hasattr(self, "heartbeat_timer"):
            self.heartbeat_timer = QTimer(self)
            self.heartbeat_timer.timeout.connect(self._publish_heartbeat)
        self.heartbeat_timer.start(int(get_config_value(self.config, "mqtt.heartbeat_interval_ms", 30000)))
        self._publish_heartbeat()

        # Periodic config polling as MQTT fallback (every 30s)
        if not hasattr(self, "config_poll_timer"):
            self.config_poll_timer = QTimer(self)
            self.config_poll_timer.timeout.connect(self._poll_config)
        self.config_poll_timer.start(30000)
        self._poll_config()

    def _poll_config(self) -> None:
        """Poll backend for cabinet config version. Triggers reload if version changed."""
        print(f"[CONFIG POLL] cabinet_id={self.cabinet_id} jwt={self.api_client.jwt_token[:20] if self.api_client.jwt_token else 'NONE'}...")
        try:
            result = self.api_client.get_cabinet_config(self.cabinet_id)
            version = int(result.get("configVersion", 0) or 0)
            current_version = int(self.config.get("config_version", 0) or 0)
            if version > current_version:
                print(f"[CONFIG POLL] detected version change: v{current_version} -> v{version}")
                self._on_config_reload(version, result.get("compartments", []))
        except Exception as error:
            print(f"[CONFIG POLL] failed: {error}")

    def _reload_config_from_backend(self) -> bool:
        try:
            result = self.api_client.get_cabinet_config(self.cabinet_id)
            version = int(result.get("configVersion", self.config.get("config_version", 0)) or 0)
            self._apply_config_snapshot(version, result.get("compartments", []), result.get("mcpDevices", []))
            return True
        except Exception as error:
            print(f"[CONFIG] backend reload failed: {error}")
            return False

    def _on_config_reload(self, config_version: int | None, compartments: list) -> None:
        if config_version is None:
            return

        current_version = int(self.config.get("config_version", 0) or 0)
        if int(config_version) <= current_version:
            return

        self._apply_config_snapshot(int(config_version), compartments)

    def _apply_config_snapshot(self, config_version: int, compartments: list, mcp_devices: list | None = None) -> None:
        current_version = int(self.config.get("config_version", 0) or 0)
        print(f"[CONFIG] Reloading v{config_version} (from v{current_version})")
        if mcp_devices is not None:
            self.gpio_controller._cache_mcp_devices(mcp_devices)
            self.config["mcpDevices"] = mcp_devices
            self.config["mcp_devices"] = mcp_devices
        self.gpio_controller.reload_config(compartments)
        self.config["config_version"] = int(config_version)
        self.config["compartments"] = compartments
        save_config(self.config)
        print(f"[CONFIG] Applied v{config_version}")

        # Notify current screen so it can update (e.g., hide not-configured overlay)
        controller = self.controllers.get(self.current_route)
        if controller is not None:
            controller.on_config_updated()

    def _handle_unlock_command(self, compartment_id: str) -> bool:
        if compartment_id not in self.gpio_controller.pin_target_map:
            print(f"[MQTT] missing mapping for unlock {compartment_id}; reloading config")
            self._reload_config_from_backend()
        return self.gpio_controller.unlock(compartment_id)

    def _handle_lock_command(self, compartment_id: str) -> bool:
        if compartment_id not in self.gpio_controller.pin_target_map:
            print(f"[MQTT] missing mapping for lock {compartment_id}; reloading config")
            self._reload_config_from_backend()
        return self.gpio_controller.lock(compartment_id)

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
                message="Máº¥t káº¿t ná»‘i vá»›i mĂ¡y chá»§ Ä‘iá»u khiá»ƒn MQTT. Äang tá»± Ä‘á»™ng káº¿t ná»‘i láº¡i...",
                title="Lá»–I Máº¤T Káº¾T Ná»I",
                on_retry=self._retry_mqtt,
            )

    def _retry_mqtt(self) -> None:
        try:
            self.mqtt_client.disconnect()
            self.mqtt_client.connect()
            if self.mqtt_client.connected:
                print("[MQTT] Watchdog retry successfully reconnected")
                if self.current_route and self.current_route in self.controllers:
                    self.controllers[self.current_route].hide_error_dialog()
            else:
                raise RuntimeError("Khong the ket noi MQTT broker.")
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
