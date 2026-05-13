import unittest

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
                        "compartments": [
                            {"name": "A1", "mcp23017PinLock": 0},
                            {"name": "B1", "mcp23017PinLock": 8},
                        ],
                    }
                ]
            },
        )()

        gpio = GpioController(mock=True)
        gpio.load_from_backend(api_client, "cabinet-a")

        self.assertEqual(gpio.pin_map, {"A1": 0, "B1": 8})


if __name__ == "__main__":
    unittest.main()
