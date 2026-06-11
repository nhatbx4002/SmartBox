from __future__ import annotations
from pathlib import Path
import time

from services.config_loader import save_config

try:
    from smbus2 import SMBus
except ImportError:
    SMBus = None


class GpioController:
    """Mock-safe GPIO facade for local kiosk development."""

    _IODIRA = 0x00
    _IODIRB = 0x01
    _GPPUA = 0x0C
    _GPPUB = 0x0D
    _GPIOA = 0x12
    _GPIOB = 0x13
    _OLATA = 0x14
    _OLATB = 0x15

    def __init__(self, mock: bool = True, bus: int | None = None, address: int | None = None):
        self.mock = mock
        self.bus = bus
        self.address = address
        self.lock_state: dict[str, str] = {}
        self.pin_map: dict[str, int] = {}
        self.pin_target_map: dict[str, tuple[int, int, int]] = {}
        self.sensor_pin_map: dict[str, int] = {}
        self.sensor_target_map: dict[str, tuple[int, int, int]] = {}
        self._mcp_device_registry: dict[str, tuple[int, int]] = {}
        self._config: dict = {}

    def load_from_backend(self, api_client, cabinet_id: str) -> None:
        # Try API first (gets latest compartments), fall back to persisted config
        compartments = []
        mcp_devices = []

        try:
            api_config = api_client.get_cabinet_config(cabinet_id)
            compartments = api_config.get("compartments", [])
            mcp_devices = api_config.get("mcpDevices", [])
            print(f"[GPIO] loaded config from API: {len(compartments)} compartments")
        except Exception as api_error:
            if hasattr(api_client, "get_cabinets_provisioning"):
                try:
                    cabinets = api_client.get_cabinets_provisioning(cabinet_id)
                    cabinet = cabinets[0] if cabinets else {}
                    compartments = cabinet.get("compartments", [])
                    mcp_devices = cabinet.get("mcpDevices", [])
                    print(f"[GPIO] loaded legacy provisioning config: {len(compartments)} compartments")
                except Exception as legacy_error:
                    print(f"[GPIO] API config fetch failed ({api_error}; legacy: {legacy_error}), using persisted config")
                    config = self._config
                    mcp_devices = config.get("mcpDevices", config.get("mcp_devices", config.get("discovered_mcp_devices", [])))
                    compartments = config.get("compartments", [])
            else:
                print(f"[GPIO] API config fetch failed ({api_error}), using persisted config")
                config = self._config
                mcp_devices = config.get("mcpDevices", config.get("mcp_devices", config.get("discovered_mcp_devices", [])))
                compartments = config.get("compartments", [])

        if not mcp_devices and not compartments:
            print(f"[GPIO] WARNING: no compartments or mcpDevices — cabinet {cabinet_id} may not be fully configured yet")
            return

        self._cache_mcp_devices(mcp_devices)
        self.reload_config(compartments)

        print(f"[GPIO] loaded MCP pin targets from backend: {self.pin_target_map}")

    def discover_hardware(self, config: dict) -> dict:
        self._config = config
        found_addresses = self._scan_i2c_bus(bus=1)
        discovered_mcp = [{"bus": 1, "address": int(address), "name": "MCP"} for address in found_addresses]

        return {
            "hardwareSerial": self._read_cpuinfo_serial(),
            "firmwareVersion": self._read_firmware_version(),
            "piModel": self._read_pi_model(),
            "mcpDevices": discovered_mcp,
        }

    def reload_config(self, compartments: list[dict]) -> None:
        self.pin_map = {}
        self.pin_target_map = {}
        self.sensor_pin_map = {}
        self.sensor_target_map = {}

        for compartment in compartments:
            if compartment.get("mcp23017PinLock") is not None:
                pin = int(compartment["mcp23017PinLock"])
                bus_number, address = self._lock_device_target(compartment, self._mcp_device_registry)
                for key_field in ("name", "id"):
                    key = str(compartment.get(key_field, ""))
                    if key:
                        self.pin_map[key] = pin
                        self.pin_target_map[key] = (bus_number, address, pin)

                if not self.mock and SMBus is not None:
                    try:
                        with SMBus(bus_number) as bus:
                            self._configure_output(bus, address, pin)
                    except Exception as error:
                        print(f"[GPIO ERROR] configure output failed for {compartment.get('name')}: {error}")

            if compartment.get("mcp23017PinSensor") is not None:
                sensor_pin = int(compartment["mcp23017PinSensor"])
                sensor_bus, sensor_address = self._sensor_device_target(compartment, self._mcp_device_registry)
                for key_field in ("name", "id"):
                    key = str(compartment.get(key_field, ""))
                    if key:
                        self.sensor_pin_map[key] = sensor_pin
                        self.sensor_target_map[key] = (sensor_bus, sensor_address, sensor_pin)

    def _save_discovered_devices(self, devices: list[dict]) -> None:
        self._config["discovered_mcp_devices"] = devices
        try:
            save_config(self._config)
        except Exception as error:
            print(f"[GPIO ERROR] failed to persist discovered devices: {error}")

    def _cache_mcp_devices(self, mcp_devices: list[dict]) -> None:
        self._mcp_device_registry = {}
        for device in mcp_devices:
            device_id = device.get("id")
            if device_id is None or device.get("bus") is None or device.get("address") is None:
                continue
            self._mcp_device_registry[str(device_id)] = (int(device["bus"]), int(device["address"]))

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
        if self.mock:
            return "CLOSED"

        if SMBus is None:
            print("[GPIO ERROR] smbus2 is not installed")
            return "UNKNOWN"

        try:
            bus_number, address, pin = self._sensor_target_for_compartment(compartment_id)
            with SMBus(bus_number) as bus:
                self._configure_input_pullup(bus, address, pin)
                _iodir_register, _pullup_register, gpio_register, bit = self._input_registers_for_pin(pin)
                value = bus.read_byte_data(address, gpio_register)
                return "CLOSED" if value & (1 << bit) else "OPEN"
        except Exception as error:
            print(f"[GPIO ERROR] get door status failed: {error}")
            return "UNKNOWN"

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

    def _sensor_device_target(self, compartment: dict, mcp_devices: dict[str, tuple[int, int]]) -> tuple[int, int]:
        sensor_device = compartment.get("sensorMcpDevice")
        if isinstance(sensor_device, dict) and sensor_device.get("bus") is not None and sensor_device.get("address") is not None:
            return int(sensor_device["bus"]), int(sensor_device["address"])

        sensor_device_id = compartment.get("sensorMcpDeviceId")
        if sensor_device_id is not None and str(sensor_device_id) in mcp_devices:
            return mcp_devices[str(sensor_device_id)]

        return self._lock_device_target(compartment, mcp_devices)

    def _read_cpuinfo_serial(self) -> str:
        try:
            for line in Path("/proc/cpuinfo").read_text(encoding="utf-8").splitlines():
                if line.startswith("Serial"):
                    return line.split(":", 1)[1].strip()
        except Exception:
            pass
        return "UNKNOWN-SERIAL"

    def _read_pi_model(self) -> str:
        try:
            return Path("/sys/firmware/devicetree/base/model").read_text(encoding="utf-8").strip("\x00\n ")
        except Exception:
            return "Raspberry Pi"

    def _read_firmware_version(self) -> str:
        try:
            return Path(__file__).resolve().parents[1].joinpath("VERSION").read_text(encoding="utf-8").strip()
        except Exception:
            return "dev"

    def _scan_i2c_bus(self, bus: int = 1) -> list[int]:
        if self.mock:
            provision = self._config.get("provision", {})
            mock_addresses = provision.get("mock_mcp_addresses", [])
            if mock_addresses:
                return [int(address) for address in mock_addresses]
            return [int(device["address"]) for device in self._config.get("mcp_devices", []) if device.get("address") is not None]

        if SMBus is None:
            print("[GPIO ERROR] smbus2 is not installed")
            return []

        found: list[int] = []
        try:
            with SMBus(bus) as i2c_bus:
                for address in range(0x20, 0x28):
                    try:
                        i2c_bus.read_byte(address)
                        found.append(address)
                    except Exception:
                        pass
        except Exception as error:
            print(f"[GPIO ERROR] I2C scan failed: {error}")
        return found

    def _target_for_compartment(self, compartment_id: str) -> tuple[int, int, int]:
        target = self.pin_target_map.get(compartment_id)
        if target is not None:
            return target
        raise RuntimeError(f"No MCP pin mapping loaded for compartment {compartment_id}")

    def _sensor_target_for_compartment(self, compartment_id: str) -> tuple[int, int, int]:
        target = self.sensor_target_map.get(compartment_id)
        if target is not None:
            return target
        raise RuntimeError(f"No MCP sensor mapping loaded for compartment {compartment_id}")

    def _input_registers_for_pin(self, pin: int) -> tuple[int, int, int, int]:
        if not 0 <= pin <= 15:
            raise ValueError(f"Unsupported MCP23017 pin: {pin}")

        if pin < 8:
            return self._IODIRA, self._GPPUA, self._GPIOA, pin
        return self._IODIRB, self._GPPUB, self._GPIOB, pin - 8

    def _configure_output(self, bus, address: int, pin: int) -> None:
        iodir_register, _olat_register, bit = self._registers_for_pin(pin)
        iodir = bus.read_byte_data(address, iodir_register)
        bus.write_byte_data(address, iodir_register, iodir & ~(1 << bit))

    def _configure_input_pullup(self, bus, address: int, pin: int) -> None:
        iodir_register, pullup_register, _gpio_register, bit = self._input_registers_for_pin(pin)
        iodir = bus.read_byte_data(address, iodir_register)
        bus.write_byte_data(address, iodir_register, iodir | (1 << bit))
        pullup = bus.read_byte_data(address, pullup_register)
        bus.write_byte_data(address, pullup_register, pullup | (1 << bit))

    def _write_pin(self, bus, address: int, pin: int, high: bool) -> None:
        _iodir_register, olat_register, bit = self._registers_for_pin(pin)
        olat = bus.read_byte_data(address, olat_register)
        if high:
            value = olat | (1 << bit)
        else:
            value = olat & ~(1 << bit)
        bus.write_byte_data(address, olat_register, value)
