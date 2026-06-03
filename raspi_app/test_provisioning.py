import unittest
from unittest.mock import patch

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
    def test_api_client_confirm_config_uses_cabinet_token_and_version_body(self):
        calls = {}

        def fake_post(url, json=None, headers=None, timeout=None):
            calls.update({"url": url, "json": json, "headers": headers, "timeout": timeout})
            return FakeResponse({"ok": True})

        with patch("services.api_client.requests.post", fake_post):
            client = ApiClient("http://backend.local", mock=False)
            client.jwt_token = "cabinet-token"

            result = client.confirm_config_applied("cab-1", 7)

        self.assertTrue(result["ok"])
        self.assertEqual(calls["url"], "http://backend.local/api/provisioning/config/cab-1/confirm")
        self.assertEqual(calls["json"], {"version": 7})
        self.assertEqual(calls["headers"]["Authorization"], "Bearer cabinet-token")

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
