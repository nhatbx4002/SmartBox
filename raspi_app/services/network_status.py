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
        self.current_status = self._evaluate_status()
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.refresh)
        self.timer.setInterval(max(1000, int(poll_interval_ms)))

    def start(self) -> None:
        self.refresh()
        self.timer.start()

    def stop(self) -> None:
        self.timer.stop()

    def refresh(self) -> None:
        status = self._evaluate_status()
        if status != self.current_status:
            self.current_status = status
            self.status_changed.emit(status)
        elif not self.timer.isActive():
            self.status_changed.emit(status)

    def _evaluate_status(self) -> str:
        for interface in self.interfaces:
            if self._interface_is_online(interface):
                return "ONLINE"
        return "OFFLINE"

    def _interface_is_online(self, interface: str) -> bool:
        if not self._interface_is_up(interface):
            return False
        if self._interface_has_ipv4(interface):
            return True
        return False

    def _interface_is_up(self, interface: str) -> bool:
        operstate = Path("/sys/class/net") / interface / "operstate"
        try:
            state = operstate.read_text(encoding="utf-8").strip().lower()
        except OSError:
            return False
        return state in {"up", "unknown"}

    def _interface_has_ipv4(self, interface: str) -> bool:
        try:
            result = subprocess.run(
                ["ip", "-4", "-o", "addr", "show", "dev", interface, "scope", "global"],
                capture_output=True,
                text=True,
                timeout=1,
                check=False,
            )
        except (FileNotFoundError, subprocess.SubprocessError, OSError):
            return False
        return bool(result.stdout.strip())

