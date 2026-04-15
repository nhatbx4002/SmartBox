from __future__ import annotations

from typing import Callable, Optional

from .base import HardwareBase


class LockerController:
    def __init__(self, hw: HardwareBase) -> None:
        self.hw = hw
        self._current_compartment: Optional[str] = None
        self._door_closed_callback: Optional[Callable[[str], None]] = None
        self.hw.on_door_closed(self._handle_door_closed)

    def _handle_door_closed(self, compartment_id: str) -> None:
        if self._door_closed_callback:
            self._door_closed_callback(compartment_id)

    def on_door_closed(self, callback: Callable[[str], None]) -> None:
        self._door_closed_callback = callback

    def open_compartment(self, compartment_id: str) -> None:
        self._current_compartment = compartment_id
        self.hw.open_locker(compartment_id)

    def close_compartment(self, compartment_id: Optional[str] = None) -> None:
        target = compartment_id or self._current_compartment
        if target is None:
            return
        self.hw.close_locker(target)

    def get_sensor_state(self, compartment_id: str) -> str:
        return "CLOSED" if self.hw.is_door_closed(compartment_id) else "OPEN"
