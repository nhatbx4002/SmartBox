import unittest

from services.api_client import ApiClient
from services.gpio_controller import GpioController


class FakeResponse:
    ok = True
    text = ""
    status_code = 200

    def __init__(self, payload):
        self._payload = payload

    def json(self):
        return {"data": self._payload}


class ProvisioningTests(unittest.TestCase):
    def test_api_client_start_pairing_mock_returns_session_and_code(self):
        client = ApiClient("http://backend.local", mock=True)

        result = client.start_pairing("RPI-001", [{"bus": 1, "address": 32}])

        self.assertTrue(result["sessionId"].startswith("ps_"))
        self.assertEqual(result["pairingCode"], result["pairingCode"].upper())
        self.assertEqual(len(result["pairingCode"]), 6)
        self.assertEqual(result["discoveredMcpDevices"], [{"bus": 1, "address": 32}])
        self.assertEqual(result["expiresInSeconds"], 600)

    def test_api_client_get_pairing_session_returns_approved_after_approval(self):
        client = ApiClient("http://backend.local", mock=True)
        session = client.start_pairing("RPI-001", [{"bus": 1, "address": 32}])

        first = client.get_pairing_session(session["sessionId"])
        second = client.get_pairing_session(session["sessionId"])
        third = client.get_pairing_session(session["sessionId"])

        self.assertEqual(first["status"], "PENDING")
        self.assertEqual(second["status"], "PENDING")
        self.assertEqual(third["status"], "APPROVED")
        self.assertIn("cabinetId", third)
        self.assertIn("mqttConfig", third)
        self.assertEqual(third["configVersion"], 1)

    def test_gpio_discover_hardware_returns_hardware_identity_and_mcp_devices(self):
        gpio = GpioController(mock=True)
        gpio._read_cpuinfo_serial = lambda: "RPI-001"
        gpio._read_pi_model = lambda: "Raspberry Pi 3"
        gpio._read_firmware_version = lambda: "1.0.0"
        gpio._scan_i2c_bus = lambda bus=1: [32, 33]

        discovery = gpio.discover_hardware({"provision": {"key": "smartbox-24-prod"}})

        self.assertEqual(discovery["hardwareSerial"], "RPI-001")
        self.assertEqual(discovery["firmwareVersion"], "1.0.0")
        self.assertEqual(discovery["piModel"], "Raspberry Pi 3")
        self.assertEqual(
            discovery["mcpDevices"],
            [{"bus": 1, "address": 32, "name": "MCP"}, {"bus": 1, "address": 33, "name": "MCP"}],
        )

    def test_gpio_reload_config_rebuilds_pin_maps(self):
        gpio = GpioController(mock=True)
        gpio._cache_mcp_devices([{"id": "mcp-lock", "bus": 1, "address": 33}])

        gpio.reload_config(
            [
                {
                    "id": "comp-a1",
                    "name": "A1",
                    "lockMcpDeviceId": "mcp-lock",
                    "mcp23017PinLock": 4,
                }
            ]
        )

        self.assertEqual(gpio.pin_map["A1"], 4)
        self.assertEqual(gpio.pin_target_map["comp-a1"], (1, 33, 4))


if __name__ == "__main__":
    unittest.main()
