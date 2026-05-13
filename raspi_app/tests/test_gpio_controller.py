import unittest
from unittest.mock import patch

from services.gpio_controller import GpioController


class GpioControllerProvisioningTests(unittest.TestCase):
    def test_load_from_backend_builds_compartment_pin_map(self):
        api_client = type(
            "ApiClientStub",
            (),
            {
                "get_cabinets_provisioning": lambda self, cabinet_id: [
                    {
                        "id": cabinet_id,
                        "mcpDevices": [
                            {"id": "mcp-lock", "bus": 1, "address": 0x21},
                        ],
                        "compartments": [
                            {"name": "A1", "mcp23017PinLock": 0, "lockMcpDeviceId": "mcp-lock"},
                            {"name": "B1", "mcp23017PinLock": 8, "lockMcpDeviceId": "mcp-lock"},
                        ],
                    }
                ]
            },
        )()

        gpio = GpioController(mock=True)
        gpio.load_from_backend(api_client, "cabinet-a")

        self.assertEqual(gpio.pin_map, {"A1": 0, "B1": 8})

    def test_load_from_backend_also_maps_backend_compartment_ids(self):
        api_client = type(
            "ApiClientStub",
            (),
            {
                "get_cabinets_provisioning": lambda self, cabinet_id: [
                    {
                        "id": cabinet_id,
                        "mcpDevices": [
                            {"id": "mcp-lock", "bus": 1, "address": 0x21},
                        ],
                        "compartments": [
                            {
                                "id": "compartment-db-id",
                                "name": "A1",
                                "mcp23017PinLock": 0,
                                "lockMcpDeviceId": "mcp-lock",
                            },
                        ],
                    }
                ]
            },
        )()

        gpio = GpioController(mock=True)
        gpio.load_from_backend(api_client, "cabinet-a")

        self.assertEqual(gpio.pin_map, {"A1": 0, "compartment-db-id": 0})

    def test_load_from_backend_uses_mcp_device_i2c_settings(self):
        api_client = type(
            "ApiClientStub",
            (),
            {
                "get_cabinets_provisioning": lambda self, cabinet_id: [
                    {
                        "id": cabinet_id,
                        "mcpDevices": [
                            {"id": "mcp-lock", "bus": 3, "address": 0x21},
                        ],
                        "compartments": [
                            {
                                "id": "compartment-db-id",
                                "name": "A1",
                                "mcp23017PinLock": 12,
                                "lockMcpDeviceId": "mcp-lock",
                            },
                        ],
                    }
                ]
            },
        )()

        gpio = GpioController(mock=True, bus=1, address=0x20)
        gpio.load_from_backend(api_client, "cabinet-a")

        self.assertEqual(gpio.pin_target_map["A1"], (3, 0x21, 12))


class FakeSMBus:
    writes: list[tuple[int, int, int]] = []

    def __init__(self, bus: int):
        self.bus = bus

    def __enter__(self):
        return self

    def __exit__(self, _exc_type, _exc, _traceback):
        return False

    def read_byte_data(self, _address: int, register: int) -> int:
        if register in (0x00, 0x01):
            return 0xFF
        return 0x00

    def write_byte_data(self, address: int, register: int, value: int) -> None:
        self.writes.append((address, register, value))


class GpioControllerMcp23017Tests(unittest.TestCase):
    def setUp(self):
        FakeSMBus.writes = []

    def test_unlock_sets_pin_output_then_pulses_olat_high_and_low(self):
        gpio = GpioController(mock=False)
        gpio.pin_map = {"A1": 0}
        gpio.pin_target_map = {"A1": (1, 0x21, 0)}

        with patch("services.gpio_controller.SMBus", FakeSMBus), patch("services.gpio_controller.time.sleep"):
            self.assertTrue(gpio.unlock("A1", duration=3))

        self.assertEqual(
            FakeSMBus.writes,
            [
                (0x21, 0x00, 0xFE),
                (0x21, 0x14, 0x01),
                (0x21, 0x14, 0x00),
            ],
        )

    def test_unlock_uses_port_b_registers_for_pins_8_to_15(self):
        gpio = GpioController(mock=False)
        gpio.pin_map = {"B1": 8}
        gpio.pin_target_map = {"B1": (1, 0x21, 8)}

        with patch("services.gpio_controller.SMBus", FakeSMBus), patch("services.gpio_controller.time.sleep"):
            self.assertTrue(gpio.unlock("B1", duration=3))

        self.assertEqual(
            FakeSMBus.writes,
            [
                (0x21, 0x01, 0xFE),
                (0x21, 0x15, 0x01),
                (0x21, 0x15, 0x00),
            ],
        )


if __name__ == "__main__":
    unittest.main()
