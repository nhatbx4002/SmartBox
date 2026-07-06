from __future__ import annotations

from pathlib import Path
import threading

try:
    import board
    import busio
    import digitalio
    from adafruit_mcp230xx.mcp23017 import MCP23017
except ImportError:
    board = None
    busio = None
    digitalio = None
    MCP23017 = None


class GpioController:
    def __init__(self):
        self.lock_targets: dict[str, tuple[int, int, int]] = {}
        self.sensor_targets: dict[str, tuple[int, int, int]] = {}
        self.mcp_devices: dict[str, tuple[int, int]] = {}
        self.mcps: dict[tuple[int, int], MCP23017] = {}
        self._config: dict = {}

    def discover_hardware(self, config: dict) -> dict:
        self._config = config
        found_addresses = self._scan_i2c_bus()

        return {
            "hardwareSerial": self._read_cpuinfo_serial(),
            "firmwareVersion": self._read_firmware_version(),
            "piModel": self._read_pi_model(),
            "mcpDevices": [
                {"bus": 1, "address": address, "name": "MCP"}
                for address in found_addresses
            ],
        }

    def load_from_backend(self, api_client, cabinet_id: str) -> None:
        try:
            api_config = api_client.get_cabinet_config(cabinet_id)
            compartments = api_config.get("compartments", [])
            mcp_devices = api_config.get("mcpDevices", [])
            self._config["cabinet_status"] = api_config.get("status")
        except Exception:
            mcp_devices = self._config.get(
                "mcpDevices",
                self._config.get("mcp_devices", self._config.get("discovered_mcp_devices", [])),
            )
            compartments = self._config.get("compartments", [])

        if not mcp_devices and not compartments:
            return

        self._cache_mcp_devices(mcp_devices)
        self.reload_config(compartments)

    def reload_config(self, compartments: list[dict]) -> None:
        self.lock_targets.clear()
        self.sensor_targets.clear()

        for compartment in compartments:
            keys = self._compartment_keys(compartment)

            if compartment.get("mcp23017PinLock") is not None:
                bus, address = self._device_target(compartment, "lock")
                pin = int(compartment["mcp23017PinLock"])

                for key in keys:
                    self.lock_targets[key] = (bus, address, pin)

                self._configure_lock_pin(bus, address, pin)

            if compartment.get("mcp23017PinSensor") is not None:
                bus, address = self._device_target(compartment, "sensor", fallback_to_lock=True)
                pin = int(compartment["mcp23017PinSensor"])

                for key in keys:
                    self.sensor_targets[key] = (bus, address, pin)

    def unlock(self, compartment_id: str, duration: int = 3) -> bool:
        ok = self._write_lock(compartment_id, True)
        if ok:
            threading.Timer(duration, lambda: self._write_lock(compartment_id, False)).start()
        return ok

    def lock(self, compartment_id: str) -> bool:
        return self._write_lock(compartment_id, False)

    def get_door_status(self, compartment_id: str) -> str:
        try:
            bus, address, pin_number = self._get_target(
                self.sensor_targets,
                compartment_id,
                "sensor",
            )

            pin = self._get_mcp(bus, address).get_pin(pin_number)
            pin.switch_to_input(pull=digitalio.Pull.UP)

            return "CLOSED" if pin.value else "OPEN"
        except Exception as error:
            print(f"[GPIO ERROR] get door status failed: {error}")
            return "UNKNOWN"

    def _write_lock(self, compartment_id: str, value: bool) -> bool:
        try:
            bus, address, pin_number = self._get_target(
                self.lock_targets,
                compartment_id,
                "lock",
            )

            pin = self._get_mcp(bus, address).get_pin(pin_number)
            pin.switch_to_output(value=False)
            pin.value = value
            return True
        except Exception as error:
            print(f"[GPIO ERROR] write lock failed: {error}")
            return False

    def _configure_lock_pin(self, bus: int, address: int, pin_number: int) -> None:
        try:
            pin = self._get_mcp(bus, address).get_pin(pin_number)
            pin.switch_to_output(value=False)
        except Exception as error:
            print(f"[GPIO ERROR] configure lock pin failed: {error}")

    def _get_mcp(self, bus: int, address: int):
        if MCP23017 is None:
            raise RuntimeError("Adafruit MCP23017 library is not installed")

        if bus != 1:
            raise RuntimeError(
                f"Adafruit version currently supports only default I2C bus 1, got bus {bus}"
            )

        key = (bus, address)

        if key not in self.mcps:
            i2c = busio.I2C(board.SCL, board.SDA)
            self.mcps[key] = MCP23017(i2c, address=address)

        return self.mcps[key]

    def _cache_mcp_devices(self, mcp_devices: list[dict]) -> None:
        self.mcp_devices.clear()

        for device in mcp_devices:
            device_id = device.get("id")
            bus = device.get("bus")
            address = device.get("address")

            if device_id is None or bus is None or address is None:
                continue

            self.mcp_devices[str(device_id)] = (int(bus), int(address))

    def _device_target(
        self,
        compartment: dict,
        kind: str,
        fallback_to_lock: bool = False,
    ) -> tuple[int, int]:
        device = compartment.get(f"{kind}McpDevice")
        if isinstance(device, dict) and device.get("bus") is not None and device.get("address") is not None:
            return int(device["bus"]), int(device["address"])

        device_id = compartment.get(f"{kind}McpDeviceId")
        if device_id is not None and str(device_id) in self.mcp_devices:
            return self.mcp_devices[str(device_id)]

        if fallback_to_lock:
            return self._device_target(compartment, "lock")

        name = compartment.get("name", compartment.get("id", "unknown"))
        raise RuntimeError(f"Missing {kind} MCP device for compartment {name}")

    def _compartment_keys(self, compartment: dict) -> list[str]:
        keys = []

        for field in ("id", "name"):
            value = compartment.get(field)
            if value:
                keys.append(str(value))

        return keys

    def _get_target(
        self,
        targets: dict[str, tuple[int, int, int]],
        compartment_id: str,
        kind: str,
    ) -> tuple[int, int, int]:
        target = targets.get(compartment_id)

        if target is None:
            raise RuntimeError(f"No MCP {kind} mapping loaded for compartment {compartment_id}")

        return target

    def _scan_i2c_bus(self) -> list[int]:
        if busio is None:
            return []

        found = []

        try:
            i2c = busio.I2C(board.SCL, board.SDA)

            while not i2c.try_lock():
                pass

            try:
                found = [address for address in i2c.scan() if 0x20 <= address <= 0x27]
            finally:
                i2c.unlock()

        except Exception as error:
            print(f"[GPIO ERROR] I2C scan failed: {error}")

        return found

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
            return Path("/sys/firmware/devicetree/base/model").read_text(
                encoding="utf-8"
            ).strip("\x00\n ")
        except Exception:
            return "Raspberry Pi"

    def _read_firmware_version(self) -> str:
        try:
            return Path(__file__).resolve().parents[1].joinpath("VERSION").read_text(
                encoding="utf-8"
            ).strip()
        except Exception:
            return "dev"