import unittest
from unittest.mock import Mock, patch

from services.api_client import ApiClient
from services.gpio_controller import GpioController


class ProvisioningTests(unittest.TestCase):
    @patch("services.api_client.requests.post")
    def test_api_client_start_pairing_returns_session_and_code(self, post):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "sessionId": "ps_abc123",
                "pairingCode": "XYZ789",
                "expiresInSeconds": 600,
            }
        }
        post.return_value = response

        client = ApiClient("http://backend.local")
        result = client.start_pairing("RPI-001", [{"bus": 1, "address": 32}])

        self.assertEqual(result["sessionId"], "ps_abc123")
        self.assertEqual(result["pairingCode"], "XYZ789")
        self.assertEqual(result["expiresInSeconds"], 600)

    @patch("services.api_client.requests.get")
    def test_api_client_get_pairing_session_returns_status(self, get):
        response = Mock(ok=True)
        response.json.return_value = {"data": {"sessionId": "ps_abc123", "status": "APPROVED"}}
        get.return_value = response

        client = ApiClient("http://backend.local")
        result = client.get_pairing_session("ps_abc123")

        self.assertEqual(result["status"], "APPROVED")

    def test_gpio_discover_hardware_returns_hardware_identity_and_mcp_devices(self):
        gpio = GpioController()
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
        gpio = GpioController()
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
