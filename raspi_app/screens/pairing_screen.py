from __future__ import annotations

from datetime import datetime, timezone

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton, QVBoxLayout, QWidget

from screens.base import BaseController
from services.config_loader import get_config_value, get_pairing_session_id, save_config


class PairingController(BaseController):
    route = "/pairing"

    def __init__(self, app):
        widget = self._build_ui()
        super().__init__(app, self.route, widget=widget)

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

    def _build_ui(self) -> QWidget:
        root = QWidget()
        root.setFixedSize(720, 1280)
        root.setStyleSheet("background-color: #0A0A0A;")

        layout = QVBoxLayout(root)
        layout.setContentsMargins(0, 0, 0, 48)
        layout.setSpacing(0)

        body = QVBoxLayout()
        body.setContentsMargins(40, 60, 40, 0)
        body.setSpacing(12)
        body.setAlignment(Qt.AlignTop)

        logo = QLabel("SmartBox", root)
        logo.setAlignment(Qt.AlignCenter)
        logo.setStyleSheet("background: transparent; border: none; color: #E8E8E8; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 48px; font-weight: 900;")
        body.addWidget(logo)

        network_row = QHBoxLayout()
        network_row.setAlignment(Qt.AlignCenter)
        network_row.setSpacing(8)

        self.lbl_network_dot = QLabel(root)
        self.lbl_network_dot.setObjectName("lblNetworkDot")
        self.lbl_network_dot.setFixedSize(14, 14)

        self.lbl_network = QLabel("OFFLINE", root)
        self.lbl_network.setObjectName("lblNetworkStatus")
        self.lbl_network.setStyleSheet("background: transparent; border: none; color: #EF4444; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 14px; font-weight: 800;")

        network_row.addWidget(self.lbl_network_dot)
        network_row.addWidget(self.lbl_network)
        body.addLayout(network_row)

        body.addSpacing(32)

        self.title = QLabel("\u0110ANG CH\u1edc DUY\u1ec6T", root)
        self.title.setObjectName("lblTitle")
        self.title.setAlignment(Qt.AlignCenter)
        self.title.setStyleSheet("background: transparent; border: none; color: #FF6600; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 30px; font-weight: 900;")
        body.addWidget(self.title)

        code_card = QFrame(root)
        code_card.setFixedHeight(140)
        code_card.setStyleSheet("QFrame { background-color: #1C1B1B; border: 2px solid #FF6600; border-radius: 24px; } QLabel { background: transparent; }")
        c_layout = QVBoxLayout(code_card)
        c_layout.setAlignment(Qt.AlignCenter)

        self.code = QLabel("------", code_card)
        self.code.setObjectName("lblPairingCode")
        self.code.setAlignment(Qt.AlignCenter)
        self.code.setStyleSheet("border: none; color: #FF6600; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 56px; font-weight: 900; letter-spacing: 8px;")

        c_layout.addWidget(self.code)
        body.addWidget(code_card)

        self.countdown = QLabel("", root)
        self.countdown.setObjectName("lblCountdown")
        self.countdown.setAlignment(Qt.AlignCenter)
        self.countdown.setStyleSheet("background: transparent; border: none; color: #FFB596; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 22px; font-weight: 700;")
        body.addWidget(self.countdown)

        mcp_card = QFrame(root)
        mcp_card.setFixedHeight(120)
        mcp_card.setStyleSheet("QFrame { background-color: #111111; border: 2px solid #2A2A2A; border-radius: 18px; } QLabel { background: transparent; }")
        m_layout = QVBoxLayout(mcp_card)
        m_layout.setContentsMargins(20, 12, 20, 12)

        self.mcp = QLabel("", mcp_card)
        self.mcp.setObjectName("lblMcpSummary")
        self.mcp.setWordWrap(True)
        self.mcp.setStyleSheet("border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; font-weight: 500;")

        m_layout.addWidget(self.mcp)
        body.addWidget(mcp_card)

        self.status = QLabel("Đang chờ quản trị viên phê duyệt...", root)
        self.status.setObjectName("lblStatus")
        self.status.setAlignment(Qt.AlignCenter)
        self.status.setStyleSheet("background: transparent; border: none; color: #888; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 18px; font-weight: 600;")
        body.addWidget(self.status)

        body.addStretch()

        btn_retry = QPushButton("TH\u1eec L\u1ea0I")
        btn_retry.setObjectName("btnRetry")
        btn_retry.setFixedHeight(80)
        btn_retry.setCursor(Qt.PointingHandCursor)
        btn_retry.setStyleSheet("QPushButton { background-color: #FF6600; color: white; border: none; border-radius: 18px; font-size: 22px; font-weight: 800; font-family: 'Be Vietnam Pro', Arial, sans-serif; }")
        btn_retry.hide()
        body.addWidget(btn_retry)

        layout.addLayout(body)
        return root

    def on_enter(self, data: dict | None = None) -> None:
        data = data or {}
        self._session_id = data.get("sessionId") or get_pairing_session_id(self.config) or self.state.pairing_session_id
        self._pairing_code = str(data.get("pairingCode") or get_config_value(self.config, "pairing_code", ""))
        self._expires_at = self._parse_datetime(data.get("expiresAt") or get_config_value(self.config, "pairing_expires_at", ""))
        mcp_devices = data.get("mcpDevices") or get_config_value(self.config, "discovered_mcp_devices", [])

        self.retry_button.hide()
        self._apply_network_status_display()

        if not self._session_id:
            self._show_error("Kh\xf4ng t\xecm th\u1ea5y phi\xean gh\xe9p.")
            return

        self.title_label.setText("\u0110ANG CH\u1edc DUY\u1ec6T")
        self.code_label.setText(self._pairing_code or "------")
        self.mcp_label.setText(self._format_mcp_devices(mcp_devices))
        self.status_label.setText("\u0110ang ch\u1edd m\xe1y ch\u1ee7 duy\u1ec7t...")

        self._tick_countdown()
        self.countdown_timer.start(1000)
        self.poll_timer.start(3000)

    def on_exit(self) -> None:
        self.countdown_timer.stop()
        self.poll_timer.stop()

    def _apply_network_status_display(self) -> None:
        status = self.network_status.upper()
        color = "#00FF41" if status == "ONLINE" else "#EF4444"
        self.network_label.setText(status)
        self.network_label.setStyleSheet(
            "background: transparent; border: none; "
            f"color: {color}; font-family: 'Be Vietnam Pro', 'Arial', sans-serif; "
            "font-size: 15px; font-weight: 800;"
        )
        self.network_dot.setStyleSheet(f"background-color: {color}; border-radius: 7px;")

    def _tick_countdown(self) -> None:
        if self._expires_at is None:
            self.countdown_label.setText("H\u1ebft h\u1ea1n sau: --:--")
            return

        remaining = int((self._expires_at - datetime.now(timezone.utc)).total_seconds())
        if remaining <= 0:
            self.countdown_label.setText("M\xe3 \u0111\xe3 h\u1ebft h\u1ea1n")
            self.status_label.setText("Phi\xean gh\xe9p \u0111\xe3 h\u1ebft h\u1ea1n.")
            self.countdown_timer.stop()
            self.poll_timer.stop()
            self.retry_button.show()
            return

        minutes, seconds = divmod(remaining, 60)
        self.countdown_label.setText(f"H\u1ebft h\u1ea1n sau: {minutes:02d}:{seconds:02d}")

    def _retry(self) -> None:
        self.countdown_timer.stop()
        self.poll_timer.stop()
        self.app.restart_pairing_flow()

    def _poll_pairing_status(self) -> None:
        if not self._session_id:
            self.poll_timer.stop()
            return
        try:
            response = self.api_client.get_pairing_session(self._session_id)
            self._handle_pairing_status(response)
        except Exception as error:
            print(f"[PAIRING] poll error: {error}")
            self.status_label.setText(f"L\u1ed7i k\u1ebft n\u1ed1i: {error}")
            self.poll_timer.stop()

    def _handle_pairing_status(self, data: dict) -> None:
        status = str(data.get("status", "")).upper()
        if status == "APPROVED":
            self.poll_timer.stop()
            self.countdown_timer.stop()
            self.status_label.setText("Ghép nối thành công. Đang cấu hình thiết bị...")
            try:
                self.app.apply_pairing_result(data)
            except Exception as error:
                print(f"[PAIRING SCREEN] apply_pairing_result warning: {error}")
            self.navigate("/pairing-success", {"cabinetId": data.get("cabinetId", "")}, replace=True)
            return
        if status in {"EXPIRED", "CANCELLED"}:
            self.poll_timer.stop()
            self.countdown_timer.stop()
            self.status_label.setText("Phiên ghép nối đã bị hủy hoặc đã hết hạn.")
            self.retry_button.show()
            return
        self.status_label.setText("Đang chờ quản trị viên xác nhận...")

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
            return "Chưa phát hiện thiết bị MCP23017 nào."

        lines = [f"Phát hiện {len(devices)} MCP23017:"]
        for device in devices[:4]:
            bus = device.get("bus", "?")
            address = device.get("address", "?")
            lines.append(f"Bus {bus} @ 0x{int(address):02X}" if isinstance(address, int) else f"Bus {bus} @ {address}")
        return "\n".join(lines)
