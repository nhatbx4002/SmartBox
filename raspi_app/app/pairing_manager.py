from __future__ import annotations

from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

from services.config_loader import (
    get_config_value,
    get_pairing_session_id,
    load_config,
    save_config,
)


class PairingManager:
    def __init__(self, app):
        self.app = app

    def start_pairing_flow(self) -> dict:
        discovery = self.app.gpio_controller.discover_hardware(self.app.config)
        result = self.app.api_client.start_pairing(
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
        self.app.state.pairing_status = "PAIRING"
        self.app.state.pairing_session_id = pairing_data["sessionId"]
        self.app.state.pairing_code = pairing_data["pairingCode"]
        self.app.state.pairing_expires_at = self._parse_datetime(pairing_data["expiresAt"])
        self.app.state.discovered_mcp_devices = list(pairing_data["mcpDevices"] or [])

        return pairing_data

    def resume_pairing_flow(self) -> dict:
        session_id = get_pairing_session_id(self.app.config)
        if not session_id:
            return self.start_pairing_flow()

        pairing_data = {
            "sessionId": session_id,
            "pairingCode": get_config_value(self.app.config, "pairing_code", ""),
            "expiresAt": get_config_value(self.app.config, "pairing_expires_at", ""),
            "hardwareSerial": get_config_value(self.app.config, "hardware_serial", ""),
            "mcpDevices": get_config_value(self.app.config, "discovered_mcp_devices", []),
        }
        self.app.state.pairing_status = "PAIRING"
        self.app.state.pairing_session_id = session_id
        self.app.state.pairing_code = pairing_data["pairingCode"]
        self.app.state.pairing_expires_at = self._parse_datetime(pairing_data["expiresAt"])
        self.app.state.discovered_mcp_devices = list(pairing_data["mcpDevices"] or [])

        return pairing_data

    def apply_pairing_result(self, result: dict) -> None:
        new_cabinet_id = str(result.get("cabinetId") or result.get("cabinet_id") or "")
        existing_cabinet_id = str(self.app.config.get("cabinet_id") or "")
        if existing_cabinet_id and new_cabinet_id and existing_cabinet_id == new_cabinet_id:
            print(f"[PAIRING] Already paired with cabinet {new_cabinet_id}, skipping apply_pairing_result")
            return

        updated_config = dict(self.app.config)
        mqtt_config = result.get("mqttConfig", {})
        cabinet_id = new_cabinet_id or str(updated_config.get("cabinet_id") or "")
        jwt_token = str(
            result.get("jwt")
            or result.get("jwtToken")
            or result.get("jwt_token")
            or updated_config.get("jwt_token")
            or ""
        )

        updated_config["cabinet_id"] = cabinet_id
        updated_config["jwt_token"] = jwt_token
        updated_config["config_version"] = int(
            result.get("configVersion", result.get("config_version", updated_config.get("config_version", 1)))
        )
        updated_config["pairing_session_id"] = get_pairing_session_id(self.app.config) or result.get("id") or ""
        updated_config["pairing_code"] = self.app.state.pairing_code or updated_config.get("pairing_code", "")
        if self.app.state.pairing_expires_at is not None:
            updated_config["pairing_expires_at"] = self.app.state.pairing_expires_at.isoformat()
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
        self.app.config = load_config()
        self.app.state.reset_pairing_flow()
        self.app._load_normal_config()

        self.app.cabinet_id = cabinet_id
        self.app.jwt_token = jwt_token
        self.app.api_client.jwt_token = jwt_token
        self.app.gpio_controller._config = self.app.config

        try:
            self.app._start_paired_runtime()
        except Exception as error:
            print(f"[PAIRING] MQTT connect failed (will retry): {error}")

    def restart_pairing_flow(self) -> dict:
        self.app.state.reset_pairing_flow()
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
            self.app.config.pop(key, None)
        save_config(self.app.config)
        data = self.start_pairing_flow()
        if hasattr(self.app, "controllers") and "/pairing" in self.app.controllers:
            self.app.navigate("/pairing", data, replace=True)
        return data

    def _save_pairing_state(self, pairing_data: dict, discovery: dict) -> None:
        self.app.config["pairing_session_id"] = pairing_data.get("sessionId", "")
        self.app.config["pairing_code"] = pairing_data.get("pairingCode", "")
        self.app.config["pairing_expires_at"] = pairing_data.get("expiresAt", "")
        self.app.config["pairing_status"] = "PAIRING"
        self.app.config["hardware_serial"] = discovery.get("hardwareSerial", "")
        self.app.config["firmware_version"] = discovery.get("firmwareVersion", "")
        self.app.config["pi_model"] = discovery.get("piModel", "")
        self.app.config["discovered_mcp_devices"] = pairing_data.get("mcpDevices", [])
        save_config(self.app.config)

    def _parse_datetime(self, value: str | None):
        if not value:
            return None
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except ValueError:
            return None
