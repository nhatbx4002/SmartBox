import unittest
from unittest.mock import Mock, patch

from services.api_client import ApiClient


class ApiClientProvisioningTests(unittest.TestCase):
    @patch("services.api_client.requests.post")
    def test_provision_cabinet_posts_profile_based_payload(self, post):
        response = Mock(ok=True)
        response.json.return_value = {
            "data": {
                "cabinetId": "cabinet-a",
                "jwtToken": "jwt-token",
                "mqttConfig": {"username": "cabinet-a", "password": "secret"},
            }
        }
        post.return_value = response

        client = ApiClient(base_url="http://localhost:3000", timeout=30, mock=False)
        payload = {
            "provisionKey": "smartbox-24-prod",
            "provisionSecret": "secret-1",
            "provisionCode": "AB12CD34",
            "hardwareSerial": "RPI-001",
            "deviceName": "Tu A - Tang 1",
            "discoveredMcpDevices": [{"bus": 1, "address": 32, "name": "MCP"}],
            "firmwareVersion": "1.2.3",
            "piModel": "Pi 4",
        }

        data = client.provision_cabinet(payload)

        self.assertEqual(data["cabinetId"], "cabinet-a")
        post.assert_called_once_with(
            "http://localhost:3000/api/provisioning/register",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )

    @patch("services.api_client.requests.get")
    def test_get_cabinets_provisioning_filters_by_cabinet_id(self, get):
        response = Mock(ok=True)
        response.json.return_value = {"data": [{"id": "cabinet-a", "compartments": []}]}
        get.return_value = response

        client = ApiClient(base_url="http://localhost:3000", timeout=7, mock=False)
        client.jwt_token = "cabinet-token"
        data = client.get_cabinets_provisioning("cabinet-a")

        self.assertEqual(data, [{"id": "cabinet-a", "compartments": []}])
        get.assert_called_once_with(
            "http://localhost:3000/api/provisioning/cabinets",
            headers={"Content-Type": "application/json", "Authorization": "Bearer cabinet-token"},
            params={"cabinetId": "cabinet-a"},
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

        client = ApiClient(base_url="http://localhost:3000", mock=False)
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

        client = ApiClient(base_url="http://localhost:3000", mock=False)
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
