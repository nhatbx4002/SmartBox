import unittest
from unittest.mock import Mock, patch

from services.api_client import ApiClient


class ApiClientProvisioningTests(unittest.TestCase):
    @patch("services.api_client.requests.post")
    def test_start_pairing_posts_direct_pair_payload(self, post):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "sessionId": "pairing-session-1",
                "pairingCode": "ABC123",
                "expiresInSeconds": 600,
            }
        }
        post.return_value = response

        client = ApiClient(base_url="http://localhost:3001", timeout=30, )
        devices = [{"bus": 1, "address": 32, "name": "MCP"}]

        data = client.start_pairing("RPI-001", devices)

        self.assertEqual(data["sessionId"], "pairing-session-1")
        post.assert_called_once_with(
            "http://localhost:3001/api/pair/start",
            json={"hardwareSerial": "RPI-001", "discoveredMcpDevices": devices},
            timeout=30,
        )

    @patch("services.api_client.requests.get")
    def test_get_cabinet_config_fetches_snapshot_with_auth(self, get):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "cabinetId": "cabinet-a",
                "configVersion": 2,
                "mcpDevices": [{"id": "mcp-lock", "bus": 1, "address": 32}],
                "compartments": [],
            }
        }
        get.return_value = response

        client = ApiClient(base_url="http://localhost:3001", timeout=7, )
        client.jwt_token = "cabinet-token"
        data = client.get_cabinet_config("cabinet-a")

        self.assertEqual(data["cabinetId"], "cabinet-a")
        self.assertEqual(data["configVersion"], 2)
        get.assert_called_once_with(
            "http://localhost:3001/api/cabinets/cabinet-a/config",
            headers={"Content-Type": "application/json", "Authorization": "Bearer cabinet-token"},
            params={},
            timeout=7,
        )

    @patch("services.api_client.requests.post")
    def test_create_rental_sends_cabinet_id(self, post):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "rental": {
                    "id": "rental-1",
                    "code": "123456",
                    "compartmentId": "compartment-a1",
                    "expiresAt": "2026-05-14T00:00:00Z",
                },
                "code": "123456",
                "compartment": {
                    "id": "compartment-a1",
                    "name": "A1",
                    "size": "SMALL",
                    "cabinet": {"name": "Tu A"},
                },
            }
        }
        post.return_value = response

        client = ApiClient(base_url="http://localhost:3000", )
        client.create_rental("0909123456", "SMALL", "single-1-day", "CASH", cabinet_id="cabinet-a")

        payload = post.call_args.kwargs["json"]
        self.assertEqual(payload["cabinetId"], "cabinet-a")

    @patch("services.api_client.requests.post")
    def test_verify_qr_posts_token_and_maps_rental(self, post):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "authorized": True,
                "rental": {
                    "id": "rental-qr-1",
                    "code": "123456",
                    "compartmentId": "compartment-a1",
                    "expiresAt": "2026-05-14T00:00:00Z",
                    "qrToken": "qr-token",
                },
                "compartment": {
                    "id": "compartment-a1",
                    "name": "A1",
                    "size": "SMALL",
                    "cabinet": {"name": "Tu A"},
                },
            }
        }
        post.return_value = response

        client = ApiClient(base_url="http://localhost:3000", )
        rental, compartment = client.verify_qr("qr-token")

        self.assertEqual(rental.id, "rental-qr-1")
        self.assertEqual(rental.qr_data, "qr-token")
        self.assertEqual(compartment.id, "compartment-a1")
        post.assert_called_once_with(
            "http://localhost:3000/api/rentals/verify-qr",
            json={"token": "qr-token"},
            timeout=10,
        )


if __name__ == "__main__":
    unittest.main()
