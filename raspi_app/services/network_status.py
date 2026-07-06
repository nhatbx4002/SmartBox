from __future__ import annotations

import subprocess
from pathlib import Path

from PySide6.QtCore import QObject, QTimer, Signal


class NetworkStatusMonitor(QObject):
    status_changed = Signal(str)

    def __init__(
        self,
        parent: QObject | None = None,
        *,
        poll_interval_ms: int = 5000,
        interfaces: tuple[str, ...] = ("eth0", "wlan0"),
    ):
        super().__init__(parent)
        self.interfaces = interfaces
        self.current_status = "UNKNOWN"

        self.timer = QTimer(self)
        self.timer.setInterval(max(1000, poll_interval_ms))
        self.timer.timeout.connect(self.refresh)

    def start(self) -> None:
        self.refresh()
        self.timer.start()

    def stop(self) -> None:
        self.timer.stop()

    def refresh(self) -> None:
        status = "ONLINE" if any(self._interface_is_online(i) for i in self.interfaces) else "OFFLINE"

        if status != self.current_status:
            self.current_status = status
            self.status_changed.emit(status)

    def _interface_is_online(self, interface: str) -> bool:
        return self._interface_is_up(interface) and self._interface_has_ipv4(interface)

    def _interface_is_up(self, interface: str) -> bool:
        try:
            state = (Path("/sys/class/net") / interface / "operstate").read_text(
                encoding="utf-8"
            ).strip().lower()
            return state in {"up", "unknown"}
        except OSError:
            return False

    def _interface_has_ipv4(self, interface: str) -> bool:
        try:
            result = subprocess.run(
                ["ip", "-4", "-o", "addr", "show", "dev", interface, "scope", "global"],
                capture_output=True,
                text=True,
                timeout=1,
                check=False,
            )
            return bool(result.stdout.strip())
        except (FileNotFoundError, subprocess.SubprocessError, OSError):
            return False