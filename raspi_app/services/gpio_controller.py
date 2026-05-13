from __future__ import annotations

import time

try:
    from smbus2 import SMBus
except ImportError:
    SMBus = None


class GpioController:
    """Mock-safe GPIO facade for local kiosk development."""

    def __init__(self, mock: bool = True, bus: int = 1, address: int = 0x20):
        self.mock = mock
        self.bus = bus
        self.address = address
        self.lock_state: dict[str, str] = {}
        self.pin_map: dict[str, int] = {}

    def load_from_backend(self, api_client, cabinet_id: str) -> None:
        cabinets = api_client.get_cabinets_provisioning(cabinet_id)
        if not cabinets:
            raise RuntimeError(f"No provisioning data found for cabinet {cabinet_id}")

        self.pin_map = {
            str(compartment["name"]): int(compartment["mcp23017PinLock"])
            for compartment in cabinets[0].get("compartments", [])
            if compartment.get("mcp23017PinLock") is not None
        }

    def unlock(self, compartment_id: str, duration: int = 3) -> bool:
        if self.mock:
            self.lock_state[compartment_id] = "UNLOCKED"
            print(f"[GPIO MOCK] unlock {compartment_id}")
            return True

        if SMBus is None:
            print("[GPIO ERROR] smbus2 is not installed")
            return False

        try:
            pin = self.pin_map.get(compartment_id, 0)
            with SMBus(self.bus) as bus:
                bus.write_byte_data(self.address, 0x00, 0xFF)
                bus.write_byte_data(self.address, 0x12, 0xFF & ~(1 << pin))
                time.sleep(duration)
                bus.write_byte_data(self.address, 0x12, 0xFF)
            return True
        except Exception as error:
            print(f"[GPIO ERROR] unlock failed: {error}")
            return False

    def lock(self, compartment_id: str) -> bool:
        if self.mock:
            self.lock_state[compartment_id] = "LOCKED"
            print(f"[GPIO MOCK] lock {compartment_id}")
            return True

        if SMBus is None:
            print("[GPIO ERROR] smbus2 is not installed")
            return False

        try:
            with SMBus(self.bus) as bus:
                bus.write_byte_data(self.address, 0x12, 0xFF)
            return True
        except Exception as error:
            print(f"[GPIO ERROR] lock failed: {error}")
            return False

    def get_door_status(self, compartment_id: str) -> str:
        return "CLOSED"
