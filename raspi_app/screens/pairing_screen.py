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
            self._show_error("Không tìm thấy phiên ghép.")
            return

        self.title_label.setText("ĐANG CHỜ DUYỆT")
        self.code_label.setText(self._pairing_code or "------")
        self.mcp_label.setText(self._format_mcp_devices(mcp_devices))
        self.status_label.setText("Đang kết nối đến máy chủ phê duyệt...")
        
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
        # Nhận tin nhắn từ background thread của MQTT, dùng QTimer để chuyển sang main UI thread
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
            self.status_label.setText("Ghép thành công. Đang cấu hình thiết bị...")
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
            self.status_label.setText("Phiên ghép đã bị huỷ hoặc hết hạn.")
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
            self.countdown_label.setText("Hết hạn sau: --:--")
            return

        remaining = int((self._expires_at - datetime.now(timezone.utc)).total_seconds())
        if remaining <= 0:
            self.countdown_label.setText("Mã đã hết hạn")
            self.status_label.setText("Phiên ghép đã hết hạn.")
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
            return "Chưa phát hiện MCP23017 nào."

        lines = [f"Phát hiện {len(devices)} MCP23017:"]
        for device in devices[:4]:
            bus = device.get("bus", "?")
            address = device.get("address", "?")
            lines.append(f"Bus {bus} @ 0x{int(address):02X}" if isinstance(address, int) else f"Bus {bus} @ {address}")
        return "\n".join(lines)
