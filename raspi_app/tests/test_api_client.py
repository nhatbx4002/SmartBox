import unittest
from unittest.mock import Mock, patch

from services.api_client import ApiClient


class ApiClientProvisioningTests(unittest.TestCase):
    @patch("services.api_client.requests.get")
    def test_get_cabinets_provisioning_filters_by_cabinet_id(self, get):
        response = Mock(ok=True)
        response.json.return_value = {"data": [{"id": "cabinet-a", "compartments": []}]}
        get.return_value = response

        client = ApiClient(base_url="http://localhost:3000", timeout=7, mock=False)
        data = client.get_cabinets_provisioning("cabinet-a")

        self.assertEqual(data, [{"id": "cabinet-a", "compartments": []}])
        get.assert_called_once_with(
            "http://localhost:3000/api/provisioning/cabinets",
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


if __name__ == "__main__":
    unittest.main()
