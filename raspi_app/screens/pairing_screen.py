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

        self.poll_timer = QTimer(self.widget)
        self.poll_timer.timeout.connect(self._poll_pairing_status)

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
        self.status_label.setText("Đang chờ máy chủ duyệt...")

        self._tick_countdown()
        self.countdown_timer.start(1000)
        self.poll_timer.start(3000)

    def on_exit(self) -> None:
        self.countdown_timer.stop()
        self.poll_timer.stop()

    def _poll_pairing_status(self) -> None:
        if not self._session_id:
            self.poll_timer.stop()
            return

        try:
            response = self.api_client.get_pairing_session(self._session_id)
            self._handle_pairing_status(response)
        except Exception as error:
            print(f"[PAIRING] poll error: {error}")
            self.status_label.setText(f"Lỗi kết nối: {error}")
            self.poll_timer.stop()

    def _handle_pairing_status(self, data: dict) -> None:
        status = str(data.get("status", "")).upper()

        if status == "APPROVED":
            self.poll_timer.stop()
            self.countdown_timer.stop()
            self.status_label.setText("Ghép thành công. Đang cấu hình thiết bị...")
            try:
                self.app.apply_pairing_result(data)
            except Exception as error:
                print(f"[PAIRING SCREEN] apply_pairing_result warning: {error}")
            self.navigate("/pairing-success", {"cabinetId": data.get("cabinetId", "")}, replace=True)
            return

        if status in {"EXPIRED", "CANCELLED"}:
            self.poll_timer.stop()
            self.countdown_timer.stop()
            self.status_label.setText("Phiên ghép đã bị huỷ hoặc hết hạn.")
            self.retry_button.show()
            return

        # PENDING — keep polling, update countdown display
        self.status_label.setText("Đang chờ máy chủ duyệt...")

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
            self.poll_timer.stop()
            self.retry_button.show()
            return

        minutes, seconds = divmod(remaining, 60)
        self.countdown_label.setText(f"Hết hạn sau: {minutes:02d}:{seconds:02d}")

    def _retry(self) -> None:
        self.countdown_timer.stop()
        self.poll_timer.stop()
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
