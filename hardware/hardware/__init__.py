from __future__ import annotations

from typing import Any, Dict, Optional

from .gpio_pi import GPIOPi
from .gpio_sim import GPIOSimulator
from .locker import LockerController

try:
    from .mcu2317 import MCU2317Driver
except ImportError:
    MCU2317Driver = None


def _create_mcu2317_driver(config: Dict[str, Any], parent: Optional[object] = None):
    if MCU2317Driver is None:
        return None
    try:
        return MCU2317Driver(config, parent=parent)
    except Exception as exc:
        print(f"[HARDWARE] MCU2317 driver unavailable: {exc}")
        return None


def HardwareManager(config: Optional[Dict[str, Any]] = None, parent: Optional[object] = None):
    resolved_config = config or {}
    hardware_config = resolved_config.get("hardware", {})
    requested_driver = str(hardware_config.get("driver", "")).strip().lower()

    if requested_driver == "mcu2317" or resolved_config.get("mcu2317"):
        driver = _create_mcu2317_driver(resolved_config, parent=parent)
        if driver is not None:
            return driver

    if GPIOPi.is_pi_environment():
        try:
            return GPIOPi(resolved_config, parent=parent)
        except Exception as exc:
            print(f"[HARDWARE] GPIOPi driver unavailable: {exc}")

    return GPIOSimulator(resolved_config, parent=parent)


__all__ = [
    "GPIOPi",
    "GPIOSimulator",
    "MCU2317Driver",
    "HardwareManager",
    "LockerController",
]
