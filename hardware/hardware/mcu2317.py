from __future__ import annotations

import threading
import time
from typing import Any, Dict, Optional

from .base import HardwareBase
from .keypad_4x4 import Keypad4x4


class MCU2317Driver(HardwareBase):
    def __init__(self, config: Optional[Dict[str, Any]] = None, parent: Optional[object] = None) -> None:
        super().__init__()
        del parent
        self.config = config or {}
        self._gpio = self._import_gpio()
        self._addr = self._parse_int(self.config.get("mcu2317", {}).get("address", 0x20), default=0x20)
        self._mcp = None
        self._led_pins: Dict[str, int] = {}
        self._led_outputs: Dict[str, Any] = {}
        self._sensor_pins: Dict[str, int] = {}
        self._row_pins: list[int] = []
        self._col_pins: list[int] = []
        self._keypad_thread: Optional[threading.Thread] = None
        self._i2c_lock = threading.Lock()
        self._last_key: Optional[str] = None
        self._setup()

    def _import_gpio(self):
        try:
            import RPi.GPIO as gpio  # type: ignore
        except ImportError as exc:
            raise RuntimeError("RPi.GPIO is required for the MCU2317 driver.") from exc
        return gpio

    @staticmethod
    def _parse_int(value: Any, *, default: int) -> int:
        if value is None:
            return default
        if isinstance(value, int):
            return value
        try:
            return int(str(value), 0)
        except (TypeError, ValueError):
            return default

    def _setup(self) -> None:
        gpio = self._gpio
        gpio.setmode(gpio.BCM)
        gpio.setwarnings(False)

        sensor_config = self.config.get("gpio", {})
        self._sensor_pins = {
            "A1": self._parse_int(sensor_config.get("sensor_1", 22), default=22),
            "B1": self._parse_int(sensor_config.get("sensor_2", 23), default=23),
        }
        for sensor_pin in set(self._sensor_pins.values()):
            gpio.setup(sensor_pin, gpio.IN, pull_up_down=gpio.PUD_UP)

        mcu_config = self.config.get("mcu2317", {})
        led_pins = mcu_config.get("led_pins", {}) or {"A1": 0}
        self._led_pins = {
            str(locker_id): self._parse_int(pin_index, default=0)
            for locker_id, pin_index in led_pins.items()
        }
        self._setup_mcp23017()

        keypad_config = self.config.get("keypad", {})
        self._row_pins = [self._parse_int(pin, default=0) for pin in keypad_config.get("rows", [21, 20, 16, 12])]
        self._col_pins = [self._parse_int(pin, default=0) for pin in keypad_config.get("cols", [26, 19, 13, 6])]
        self._configure_keypad()
        self._start_keypad_reader()

    def _setup_mcp23017(self) -> None:
        try:
            import board  # type: ignore
            import busio  # type: ignore
            from adafruit_mcp230xx.mcp23017 import MCP23017  # type: ignore
        except ImportError:
            print("[MCU2317] MCP23017 libraries are not installed; LED control over I2C is disabled.")
            return

        try:
            i2c = busio.I2C(board.SCL, board.SDA)
            self._mcp = MCP23017(i2c, address=self._addr)
            for locker_id, pin_index in self._led_pins.items():
                pin = self._mcp.get_pin(pin_index)
                pin.switch_to_output(value=False)
                self._led_outputs[locker_id] = pin
        except Exception as exc:
            self._mcp = None
            self._led_outputs = {}
            print(f"[MCU2317] MCP23017 setup failed at 0x{self._addr:02X}: {exc}")
            return

        lockers = ", ".join(sorted(self._led_outputs))
        print(f"[MCU2317] MCP23017 ready at 0x{self._addr:02X} with lockers: {lockers}")

    def _configure_keypad(self) -> None:
        gpio = self._gpio
        if len(self._row_pins) != 4 or len(self._col_pins) != 4:
            print("[MCU2317] Keypad config must define 4 rows and 4 columns; keypad scanning is disabled.")
            self._row_pins = []
            self._col_pins = []
            return

        for row_pin in self._row_pins:
            gpio.setup(row_pin, gpio.OUT)
            gpio.output(row_pin, gpio.HIGH)

        for col_pin in self._col_pins:
            gpio.setup(col_pin, gpio.IN, pull_up_down=gpio.PUD_UP)

    def _start_keypad_reader(self) -> None:
        if not self._row_pins or not self._col_pins:
            return
        self._keypad_thread = threading.Thread(target=self._scan_keypad, daemon=True)
        self._keypad_thread.start()

    def _scan_keypad(self) -> None:
        gpio = self._gpio
        while True:
            pressed = False
            for row_index, row_pin in enumerate(self._row_pins):
                gpio.output(row_pin, gpio.LOW)
                try:
                    time.sleep(0.001)
                    detected_col = None
                    for col_index, col_pin in enumerate(self._col_pins):
                        if gpio.input(col_pin) == gpio.LOW:
                            detected_col = col_index
                            break

                    if detected_col is None:
                        continue

                    time.sleep(0.05)
                    if gpio.input(self._col_pins[detected_col]) != gpio.LOW:
                        continue

                    key = Keypad4x4.KEY_LAYOUT[row_index][detected_col]
                    if key != self._last_key:
                        self.emit_keypad(key)
                        self._last_key = key

                    pressed = True
                    while gpio.input(self._col_pins[detected_col]) == gpio.LOW:
                        time.sleep(0.01)
                    break
                finally:
                    gpio.output(row_pin, gpio.HIGH)

            if not pressed:
                self._last_key = None
            time.sleep(0.01)

    def open_locker(self, locker_id: str) -> None:
        pin_index = self._led_pins.get(locker_id)
        if pin_index is None:
            raise ValueError(f"Locker {locker_id} is not configured.")
        led = self._led_outputs.get(locker_id)
        if led is None:
            print(f"[MCU2317] Locker {locker_id} has no MCP23017 output configured.")
            return
        with self._i2c_lock:
            try:
                led.value = True
            except Exception as exc:
                print(f"[MCU2317] Failed to turn ON locker {locker_id}: {exc}")

    def close_locker(self, locker_id: str) -> None:
        pin_index = self._led_pins.get(locker_id)
        if pin_index is None:
            raise ValueError(f"Locker {locker_id} is not configured.")
        led = self._led_outputs.get(locker_id)
        if led is None:
            print(f"[MCU2317] Locker {locker_id} has no MCP23017 output configured.")
            return
        with self._i2c_lock:
            try:
                led.value = False
            except Exception as exc:
                print(f"[MCU2317] Failed to turn OFF locker {locker_id}: {exc}")

    def is_door_closed(self, locker_id: str) -> bool:
        sensor_pin = self._sensor_pins.get(locker_id)
        if sensor_pin is None:
            return True
        return bool(self._gpio.input(sensor_pin))

    @staticmethod
    def is_pi_environment() -> bool:
        return HardwareBase.is_pi_environment()
