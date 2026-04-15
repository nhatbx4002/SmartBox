from __future__ import annotations

import abc
import os
import platform
from typing import Callable, Optional


class HardwareBase(abc.ABC):
    def __init__(self) -> None:
        self._keypad_callback: Optional[Callable[[str], None]] = None
        self._door_callback: Optional[Callable[[str], None]] = None

    @abc.abstractmethod
    def open_locker(self, locker_id: str) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def close_locker(self, locker_id: str) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def is_door_closed(self, locker_id: str) -> bool:
        raise NotImplementedError

    def on_keypad(self, callback: Callable[[str], None]) -> None:
        self._keypad_callback = callback

    def on_door_closed(self, callback: Callable[[str], None]) -> None:
        self._door_callback = callback

    def emit_keypad(self, key: str) -> None:
        if self._keypad_callback:
            self._keypad_callback(key)

    def emit_door_closed(self, locker_id: str) -> None:
        if self._door_callback:
            self._door_callback(locker_id)

    def show_keypad(self, parent: Optional[object] = None) -> None:
        del parent

    def hide_keypad(self) -> None:
        return None

    @staticmethod
    def is_pi_environment() -> bool:
        if platform.system() != "Linux":
            return False
        cpuinfo_path = "/proc/cpuinfo"
        if not os.path.exists(cpuinfo_path):
            return False
        try:
            with open(cpuinfo_path, "r", encoding="utf-8") as handle:
                cpuinfo = handle.read()
        except OSError:
            return False
        markers = ("Raspberry Pi", "BCM", "ARMv7", "ARMv8")
        return any(marker in cpuinfo for marker in markers)
