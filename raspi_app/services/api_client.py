from __future__ import annotations

import requests

from services.app_state import CompartmentData, Plan, RentalData


class ApiError(Exception):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ApiClient:
    def __init__(self, base_url: str = "http://localhost:3001", timeout: int = 10):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.jwt_token: str | None = None
        self._session = requests.Session()

    def verify_pin(self, code: str, mode: str | None) -> tuple[RentalData, CompartmentData]:
        response = self._session.post(
            f"{self.base_url}/api/auth/verify-pin",                              # path mới
            json={"code": code, "mode": mode},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def verify_qr(self, token: str) -> tuple[RentalData, CompartmentData]:
        response = self._session.post(
            f"{self.base_url}/api/rentals/verify-qr",
            json={"token": token},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def get_plans(self, size: str | None) -> list[Plan]:
        response = self._session.get(
            f"{self.base_url}/api/lockers/plans",
            params={"size": size},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return [
            Plan(
                id=str(item["id"]),
                name=str(item["name"]),
                rental_type=str(item.get("rentalType", item.get("rental_type", "ONCE"))).upper(),
                price=int(item["price"]),
                duration_days=int(item.get("durationDays", item.get("duration_days", 1))),
                max_opens=item.get("maxOpens") or item.get("max_opens") or None,
            )
            for item in data
        ]

    def check_availability(self, size: str | None) -> dict:
        response = self._session.get(
            f"{self.base_url}/api/lockers/available",
            params={"size": size},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        if isinstance(data, list):
            return {"available": len(data) > 0, "count": len(data), "size": size, "items": data}
        return data

    def start_pairing(self, hardwareSerial: str, discoveredMcpDevices: list[dict]) -> dict:
        response = self._session.post(
            f"{self.base_url}/api/pair/start",
            json={
                "hardwareSerial": hardwareSerial,
                "discoveredMcpDevices": discoveredMcpDevices,
            },
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_cabinet_config(self, cabinet_id: str, version: int | None = None) -> dict:
        params = {}
        if version is not None:
            params["version"] = version
        response = self._session.get(
            f"{self.base_url}/api/cabinets/{cabinet_id}/config",
            headers=self._headers(),
            params=params,
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_pairing_session(self, session_id: str) -> dict:
        response = self._session.get(
            f"{self.base_url}/api/pair/{session_id}",
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def create_rental(
        self,
        phone: str | None,
        size: str | None,
        plan_id: str | None,
        cabinet_id: str | None = None,
    ) -> tuple[RentalData, CompartmentData]:
        response = self._session.post(
            f"{self.base_url}/api/rentals",
            json={
                "phone": phone,
                "size": size,
                "planId": plan_id,
                "cabinetId": cabinet_id,
            },
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def create_payment(self, rental_id: str, source: str = "KIOSK") -> dict:
        response = self._session.post(
            f"{self.base_url}/api/payments",
            json={"rentalId": rental_id, "source": source},
            headers=self._headers(),
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_payment_status(self, order_code: int) -> dict:
        response = self._session.get(
            f"{self.base_url}/api/payments/payment-status",
            params={"orderCode": order_code},
            headers=self._headers(),
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_payment_result(self, order_code: int) -> tuple[RentalData, CompartmentData]:
        response = self._session.get(
            f"{self.base_url}/api/payments/result/{order_code}",
            headers=self._headers(),
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def complete_rental(self, rental_id: str) -> None:
        response = self._session.post(
            f"{self.base_url}/api/rentals/{rental_id}/complete",
            timeout=self.timeout,
        )
        if not response.ok:
            data = self._parse_response(response)
            raise ApiError(
                data.get("error", {}).get("message", "Không thể kết thúc cho thuê")
                if isinstance(data, dict)
                else str(data),
                response.status_code,
            )

    def _parse_response(self, response: requests.Response):
        if response.ok:
            payload = response.json()
            if isinstance(payload, dict) and "data" in payload:
                return payload["data"]
            return payload

        try:
            payload = response.json()
            error = payload.get("error")
            if isinstance(error, dict):
                message = error.get("message") or response.text
            else:
                message = payload.get("message") or error or response.text
        except ValueError:
            message = response.text or "Lỗi kết nối máy chủ"
        raise ApiError(message, response.status_code)

    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.jwt_token:
            headers["Authorization"] = f"Bearer {self.jwt_token}"
        return headers

    def _rental_from_response(self, data: dict) -> RentalData:
        rental = data.get("rental", data)
        compartment = data.get("compartment", {})
        return RentalData(
            id=str(rental.get("id", data.get("rentalId", ""))),
            pin=str(data.get("pin", data.get("code", rental.get("code", "")))),
            compartment_id=str(
                data.get("compartmentId", rental.get("compartmentId", compartment.get("id", "")))
            ),
            compartment_name=str(
                data.get("compartmentName", compartment.get("name", data.get("compartmentId", "")))
            ),
            expires_at=str(data.get("expiresAt", rental.get("expiresAt", ""))),
            qr_data=str(data.get("qrData", rental.get("qrToken", ""))),
        )

    def _compartment_from_response(self, data: dict) -> CompartmentData:
        compartment = data.get("compartment", {})
        cabinet = compartment.get("cabinet", {})
        name = str(
            data.get("compartmentName", compartment.get("name", data.get("compartmentId", "A1")))
        )
        cabinet_name = str(data.get("lockerName", cabinet.get("name", "Tủ A")))
        return CompartmentData(
            id=str(data.get("compartmentId", compartment.get("id", name))),
            name=cabinet_name + f" - Ngăn {name}",
            size=str(data.get("size", compartment.get("size", "SMALL"))),
            cabinet_name=cabinet_name,
        )
