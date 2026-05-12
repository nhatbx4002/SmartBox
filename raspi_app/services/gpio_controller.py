from __future__ import annotations


class GpioController:
    """Mock-safe GPIO facade for local kiosk development."""

    def __init__(self, mock: bool = True):
        self.mock = mock
        self.lock_state: dict[str, str] = {}

    def unlock(self, compartment_id: str, duration: int = 3) -> bool:
        self.lock_state[compartment_id] = "UNLOCKED"
        return True

    def lock(self, compartment_id: str) -> bool:
        self.lock_state[compartment_id] = "LOCKED"
        return True

    def get_door_status(self, compartment_id: str) -> str:
        return "CLOSED"
