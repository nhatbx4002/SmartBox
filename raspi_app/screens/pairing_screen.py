from __future__ import annotations

from datetime import datetime, timezone

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QLabel, QPushButton

from screens.base import BaseController
from services.config_loader import get_config_value, get_pairing_session_id, save_config


class PairingController(BaseController):
    route = "/pairing"

    def __init__(self, app):
        super().__init__(app, self.route, "PairingScreen.ui")
        self.network_label = self.child("lblNetworkStatus", QLabel)
        self.network_dot = self.child("lblNetworkDot", QLabel)
        self.title_label = self.child("lblTitle", QLabel)
        self.code_label = self.child("lblPairingCode", QLabel)
        self.countdown_label = self.child("lblCountdown", QLabel)
        self.mcp_label = self.child("lblMcpSummary", QLabel)
        self.status_label = self.child("lblStatus", QLabel)
        self.retry_button = self.child("btnRetry", QPushButton)
        self.retry_button.clicked.connect(self._retry)

        self._session_id: str | None = None
        self._pairing_code: str = ""
        self._expires_at: datetime | None = None

        self.countdown_timer = QTimer(self.widget)
        self.countdown_timer.timeout.connect(self._tick_countdown)

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        self._session_id = data.get("sessionId") or get_pairing_session_id(self.config) or self.state.pairing_session_id
        self._pairing_code = str(data.get("pairingCode") or get_config_value(self.config, "pairing_code", ""))
        self._expires_at = self._parse_datetime(data.get("expiresAt") or get_config_value(self.config, "pairing_expires_at", ""))
        mcp_devices = data.get("mcpDevices") or get_config_value(self.config, "discovered_mcp_devices", [])

        self.retry_button.hide()
        self._apply_network_status_display()

        if not self._session_id:
            self._show_error("Kh?ng t?m th?y phi?n gh?p.")
            return

        self.title_label.setText("?ANG CH? DUY?T")
        self.code_label.setText(self._pairing_code or "------")
        self.mcp_label.setText(self._format_mcp_devices(mcp_devices))
        self.status_label.setText("?ang k?t n?i ??n m?y ch? ph? duy?t...")
        
        # Start listening to MQTT pairing pushes
        if self.app.mqtt_client:
            self.app.mqtt_client.start_pairing_listen(self._session_id, self._on_mqtt_pairing_message)

        self._tick_countdown()
        self.countdown_timer.start(1000)

    def on_exit(self) -> None:
        self.countdown_timer.stop()
        if self.app.mqtt_client:
            self.app.mqtt_client.stop_pairing_listen()

    def _on_mqtt_pairing_message(self, payload: dict) -> None:
        # Nh?n tin nh?n t? background thread c?a MQTT, d?ng QTimer ?? chuy?n sang main UI thread
        QTimer.singleShot(0, lambda: self._handle_mqtt_pairing(payload))

    def _handle_mqtt_pairing(self, payload: dict) -> None:
        if not payload or not self._session_id:
            return

        status = str(payload.get("status", "")).upper()
        if payload.get("pairingCode"):
            self._pairing_code = str(payload["pairingCode"])
            self.code_label.setText(self._pairing_code)
        if payload.get("expiresAt"):
            self._expires_at = self._parse_datetime(str(payload["expiresAt"]))
        if payload.get("discoveredMcpDevices") is not None:
            self.mcp_label.setText(self._format_mcp_devices(payload.get("discoveredMcpDevices", [])))

        if status == "APPROVED":
            self.countdown_timer.stop()
            if self.app.mqtt_client:
                self.app.mqtt_client.stop_pairing_listen()
            self.status_label.setText("Gh?p th?nh c?ng. ?ang c?u h?nh thi?t b?...")
            try:
                self.app.apply_pairing_result(payload)
            except Exception as error:
                print(f"[PAIRING SCREEN] apply_pairing_result warning: {error}")
            self.navigate("/pairing-success", {"cabinetId": payload.get("cabinetId", "")}, replace=True)
            return

        if status in {"EXPIRED", "CANCELLED"}:
            self.countdown_timer.stop()
            if self.app.mqtt_client:
                self.app.mqtt_client.stop_pairing_listen()
            self.status_label.setText("Phi?n gh?p ?? b? hu? ho?c h?t h?n.")
            self.retry_button.show()
            return

    def _apply_network_status_display(self) -> None:
        status = self.network_status.upper()
        color = "#00FF41" if status == "ONLINE" else "#EF4444"
        self.network_label.setText(status)
        self.network_label.setStyleSheet(
            "background-color: transparent; border: none; "
            f"color: {color}; font-family: 'Be Vietnam Pro', 'Arial', sans-serif; "
            "font-size: 15px; font-weight: 800;"
        )
        self.network_dot.setStyleSheet(f"background-color: {color}; border-radius: 7px;")

    def _tick_countdown(self) -> None:
        if self._expires_at is None:
            self.countdown_label.setText("H?t h?n sau: --:--")
            return

        remaining = int((self._expires_at - datetime.now(timezone.utc)).total_seconds())
        if remaining <= 0:
            self.countdown_label.setText("M? ?? h?t h?n")
            self.status_label.setText("Phi?n gh?p ?? h?t h?n.")
            self.retry_button.show()
            if self.app.mqtt_client:
                self.app.mqtt_client.stop_pairing_listen()
            return

        minutes, seconds = divmod(remaining, 60)
        self.countdown_label.setText(f"H?t h?n sau: {minutes:02d}:{seconds:02d}")

    def _retry(self) -> None:
        self.countdown_timer.stop()
        if self.app.mqtt_client:
            self.app.mqtt_client.stop_pairing_listen()
        self.app.restart_pairing_flow()

    def _show_error(self, message: str) -> None:
        self.status_label.setText(message)
        self.retry_button.show()

    def _parse_datetime(self, value: str | None) -> datetime | None:
        if not value:
            return None
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except ValueError:
            return None

    def _format_mcp_devices(self, devices: list[dict]) -> str:
        if not devices:
            return "Ch?a ph?t hi?n MCP23017 n?o."

        lines = [f"Ph?t hi?n {len(devices)} MCP23017:"]
        for device in devices[:4]:
            bus = device.get("bus", "?")
            address = device.get("address", "?")
            lines.append(f"Bus {bus} @ 0x{int(address):02X}" if isinstance(address, int) else f"Bus {bus} @ {address}")
        return "
".join(lines)
