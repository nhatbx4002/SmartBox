from __future__ import annotations

import threading
from typing import Any, Dict, Optional

from .base import HardwareBase
from .keypad_4x4 import Keypad4x4


class GPIOPi(HardwareBase):
    def __init__(self, config: Optional[Dict[str, Any]] = None, parent: Optional[object] = None) -> None:
        super().__init__()
        del parent
        self.config = config or {}
        self.gpio = None
        self.evdev = None
        self._sensor_pins: Dict[str, int] = {}
        self._led_pins: Dict[str, int] = {}
        self._door_states: Dict[str, bool] = {}
        self._reader_thread: Optional[threading.Thread] = None
        self._setup()

    def _setup(self) -> None:
        try:
            import RPi.GPIO as gpio  # type: ignore
        except ImportError as exc:
            raise RuntimeError("RPi.GPIO is required on Raspberry Pi.") from exc

        self.gpio = gpio
        pin_config = self.config.get("gpio", {})
        # LED pin mappings (MCU2317 expansion module via I2C — current prototype uses direct GPIO)
        self._led_pins = {
            "A1": int(pin_config.get("locker_1", 17)),
            "B1": int(pin_config.get("locker_2", 27)),
        }
        self._sensor_pins = {
            "A1": int(pin_config.get("sensor_1", 22)),
            "B1": int(pin_config.get("sensor_2", 23)),
        }

        gpio.setmode(gpio.BCM)
        gpio.setwarnings(False)

        # Configure LED pins as output (LED on = locker "open", LED off = locker "closed")
        for led_pin in self._led_pins.values():
            gpio.setup(led_pin, gpio.OUT)
            gpio.output(led_pin, gpio.LOW)

        for locker_id, sensor_pin in self._sensor_pins.items():
            gpio.setup(sensor_pin, gpio.IN, pull_up_down=gpio.PUD_UP)
            self._door_states[locker_id] = self.is_door_closed(locker_id)

        self._start_keypad_reader()

    def _start_keypad_reader(self) -> None:
        try:
            from evdev import InputDevice, categorize, ecodes  # type: ignore
        except ImportError:
            return

        device_path = str(self.config.get("keypad", {}).get("device", "/dev/input/event0"))

        def _reader() -> None:
            try:
                device = InputDevice(device_path)
            except OSError:
                return

            for event in device.read_loop():
                if event.type != ecodes.EV_KEY:
                    continue
                key_event = categorize(event)
                if key_event.keystate != key_event.key_down:
                    continue
                mapped = Keypad4x4.normalize(key_event.keycode)
                self.emit_keypad(mapped)

        self._reader_thread = threading.Thread(target=_reader, daemon=True)
        self._reader_thread.start()

    def open_locker(self, locker_id: str) -> None:
        pin = self._led_pins.get(locker_id)
        if pin is None or self.gpio is None:
            raise ValueError(f"Locker {locker_id} is not configured.")
        # LED on = locker open indicator
        self.gpio.output(pin, self.gpio.HIGH)

    def close_locker(self, locker_id: str) -> None:
        pin = self._led_pins.get(locker_id)
        if pin is None or self.gpio is None:
            raise ValueError(f"Locker {locker_id} is not configured.")
        # LED off = locker closed indicator
        self.gpio.output(pin, self.gpio.LOW)

    def is_door_closed(self, locker_id: str) -> bool:
        sensor_pin = self._sensor_pins.get(locker_id)
        if sensor_pin is None or self.gpio is None:
            return True
        return bool(self.gpio.input(sensor_pin))

    @staticmethod
    def is_pi_environment() -> bool:
        return HardwareBase.is_pi_environment()
