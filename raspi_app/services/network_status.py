from __future__ import annotations

import logging
import subprocess
from pathlib import Path

from PySide6.QtCore import QObject, QTimer, Signal

logger = logging.getLogger(__name__)

_WIRELESS_PREFIXES = ("wl",)
_SKIP_INTERFACES = {"lo", "docker", "br-", "veth", "virbr", "tun", "tap", "vboxnet"}


class NetworkStatusMonitor(QObject):
    status_changed = Signal(str)

    def __init__(
        self,
        parent: QObject | None = None,
        *,
        poll_interval_ms: int = 5000,
        interfaces: tuple[str, ...] | None = None,
    ):
        super().__init__(parent)
        self._explicit_interfaces = interfaces
        self._cached_interfaces: tuple[str, ...] = ()
        self.current_status = "UNKNOWN"

        self.timer = QTimer(self)
        self.timer.setInterval(max(1000, poll_interval_ms))
        self.timer.timeout.connect(self.refresh)

    def start(self) -> None:
        self.refresh()
        self.timer.start()

    def stop(self) -> None:
        self.timer.stop()

    def _discover_interfaces(self) -> tuple[str, ...]:
        if self._explicit_interfaces:
            return self._explicit_interfaces

        net_dir = Path("/sys/class/net")
        if not net_dir.is_dir():
            return ("eth0", "wlan0")

        found: list[str] = []
        try:
            for iface_path in net_dir.iterdir():
                name = iface_path.name
                if any(name.startswith(p) for p in _SKIP_INTERFACES):
                    continue
                if name.startswith(_WIRELESS_PREFIXES):
                    found.append(name)
                elif name.startswith("e"):
                    found.append(name)
                else:
                    found.append(name)
        except OSError:
            return ("eth0", "wlan0")

        if not found:
            return ("eth0", "wlan0")
        return tuple(found)

    def refresh(self) -> None:
        self._cached_interfaces = self._discover_interfaces()
        status = "ONLINE" if any(self._interface_is_online(i) for i in self._cached_interfaces) else "OFFLINE"

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
            return state in {"up", "unknown", "dormant"}
        except OSError:
            return False

    _IP_PATHS = ("ip", "/sbin/ip", "/usr/sbin/ip", "/bin/ip", "/usr/bin/ip")

    def _find_ip_binary(self) -> str:
        for path in self._IP_PATHS:
            if Path(path).is_file() or path == "ip":
                return path
        return "ip"

    def _interface_has_ipv4(self, interface: str) -> bool:
        ip_bin = self._find_ip_binary()
        try:
            result = subprocess.run(
                [ip_bin, "-4", "-o", "addr", "show", "dev", interface, "scope", "global"],
                capture_output=True,
                text=True,
                timeout=1,
                check=False,
            )
            has_ip = bool(result.stdout.strip())
            if not has_ip:
                logger.debug("Interface %s up but no global IPv4", interface)
            return has_ip
        except FileNotFoundError:
            logger.warning("ip command not found (tried %s)", ip_bin)
            return False
        except (subprocess.SubprocessError, OSError) as e:
            logger.debug("IPv4 check failed for %s: %s", interface, e)
            return False