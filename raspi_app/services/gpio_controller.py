from __future__ import annotations

import time

try:
    from smbus2 import SMBus
except ImportError:
    SMBus = None


class GpioController:
    """Mock-safe GPIO facade for local kiosk development."""

    _IODIRA = 0x00
    _IODIRB = 0x01
    _OLATA = 0x14
    _OLATB = 0x15

    def __init__(self, mock: bool = True, bus: int | None = None, address: int | None = None):
        self.mock = mock
        self.bus = bus
        self.address = address
        self.lock_state: dict[str, str] = {}
        self.pin_map: dict[str, int] = {}
        self.pin_target_map: dict[str, tuple[int, int, int]] = {}

    def load_from_backend(self, api_client, cabinet_id: str) -> None:
        cabinets = api_client.get_cabinets_provisioning(cabinet_id)
        if not cabinets:
            raise RuntimeError(f"No provisioning data found for cabinet {cabinet_id}")

        cabinet = cabinets[0]
        mcp_devices = {
            str(device["id"]): (int(device["bus"]), int(device["address"]))
            for device in cabinet.get("mcpDevices", [])
            if device.get("id") is not None and device.get("bus") is not None and device.get("address") is not None
        }

        self.pin_map = {}
        self.pin_target_map = {}
        for compartment in cabinet.get("compartments", []):
            if compartment.get("mcp23017PinLock") is None:
                continue

            pin = int(compartment["mcp23017PinLock"])
            bus, address = self._lock_device_target(compartment, mcp_devices)
            if compartment.get("name"):
                key = str(compartment["name"])
                self.pin_map[key] = pin
                self.pin_target_map[key] = (bus, address, pin)
            if compartment.get("id"):
                key = str(compartment["id"])
                self.pin_map[key] = pin
                self.pin_target_map[key] = (bus, address, pin)

        print(f"[GPIO] loaded MCP pin targets from backend: {self.pin_target_map}")

    def unlock(self, compartment_id: str, duration: int = 3) -> bool:
        if self.mock:
            self.lock_state[compartment_id] = "UNLOCKED"
            print(f"[GPIO MOCK] unlock {compartment_id}")
            return True

        if SMBus is None:
            print("[GPIO ERROR] smbus2 is not installed")
            return False

        try:
            bus_number, address, pin = self._target_for_compartment(compartment_id)
            print(f"[GPIO] unlock target compartment={compartment_id} bus={bus_number} address={address} pin={pin}")
            with SMBus(bus_number) as bus:
                self._configure_output(bus, address, pin)
                self._write_pin(bus, address, pin, high=True)
                time.sleep(duration)
                self._write_pin(bus, address, pin, high=False)
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
            bus_number, address, pin = self._target_for_compartment(compartment_id)
            print(f"[GPIO] lock target compartment={compartment_id} bus={bus_number} address={address} pin={pin}")
            with SMBus(bus_number) as bus:
                self._configure_output(bus, address, pin)
                self._write_pin(bus, address, pin, high=False)
            return True
        except Exception as error:
            print(f"[GPIO ERROR] lock failed: {error}")
            return False

    def get_door_status(self, compartment_id: str) -> str:
        return "CLOSED"

    def _registers_for_pin(self, pin: int) -> tuple[int, int, int]:
        if not 0 <= pin <= 15:
            raise ValueError(f"Unsupported MCP23017 pin: {pin}")

        if pin < 8:
            return self._IODIRA, self._OLATA, pin
        return self._IODIRB, self._OLATB, pin - 8

    def _lock_device_target(self, compartment: dict, mcp_devices: dict[str, tuple[int, int]]) -> tuple[int, int]:
        lock_device = compartment.get("lockMcpDevice")
        if isinstance(lock_device, dict) and lock_device.get("bus") is not None and lock_device.get("address") is not None:
            return int(lock_device["bus"]), int(lock_device["address"])

        lock_device_id = compartment.get("lockMcpDeviceId")
        if lock_device_id is not None and str(lock_device_id) in mcp_devices:
            return mcp_devices[str(lock_device_id)]

        raise RuntimeError(f"Missing lock MCP device for compartment {compartment.get('name', compartment.get('id', 'unknown'))}")

    def _target_for_compartment(self, compartment_id: str) -> tuple[int, int, int]:
        target = self.pin_target_map.get(compartment_id)
        if target is not None:
            return target
        raise RuntimeError(f"No MCP pin mapping loaded for compartment {compartment_id}")

    def _configure_output(self, bus, address: int, pin: int) -> None:
        iodir_register, _olat_register, bit = self._registers_for_pin(pin)
        iodir = bus.read_byte_data(address, iodir_register)
        bus.write_byte_data(address, iodir_register, iodir & ~(1 << bit))

    def _write_pin(self, bus, address: int, pin: int, high: bool) -> None:
        _iodir_register, olat_register, bit = self._registers_for_pin(pin)
        olat = bus.read_byte_data(address, olat_register)
        if high:
            value = olat | (1 << bit)
        else:
            value = olat & ~(1 << bit)
        bus.write_byte_data(address, olat_register, value)
