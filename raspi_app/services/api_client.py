from __future__ import annotations

from datetime import datetime, timedelta, timezone

import requests

from services.app_state import CompartmentData, Plan, RentalData


class ApiError(Exception):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ApiClient:
    """REST client with a mock mode for kiosk UI development."""

    def __init__(self, base_url: str = "http://localhost:5000", timeout: int = 10, mock: bool = True):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.mock = mock

    def verify_pin(self, code: str, mode: str | None) -> tuple[RentalData, CompartmentData]:
        if self.mock:
            return self._mock_verify_pin(code, mode)

        response = requests.post(
            f"{self.base_url}/api/rentals/verify-pin",
            json={"code": code, "mode": mode},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def get_plans(self, size: str | None) -> list[Plan]:
        if self.mock:
            return self._mock_plans(size)

        response = requests.get(f"{self.base_url}/api/plans", params={"size": size}, timeout=self.timeout)
        data = self._parse_response(response)
        return [
            Plan(
                id=str(item["id"]),
                name=str(item["name"]),
                rental_type=str(item.get("rentalType", item.get("rental_type", "single"))),
                price=int(item["price"]),
                duration_days=int(item.get("durationDays", item.get("duration_days", 1))),
                max_opens=int(item.get("maxOpens", item.get("max_opens", 1))),
            )
            for item in data
        ]

    def check_availability(self, size: str | None) -> dict:
        if self.mock:
            return {"available": True, "count": 3, "size": size}

        response = requests.get(f"{self.base_url}/api/lockers/available", params={"size": size}, timeout=self.timeout)
        return self._parse_response(response)

    def create_rental(
        self,
        phone: str | None,
        size: str | None,
        plan_id: str | None,
        payment_method: str | None,
    ) -> tuple[RentalData, CompartmentData]:
        if self.mock:
            return self._mock_create_rental(phone, size, plan_id, payment_method)

        response = requests.post(
            f"{self.base_url}/api/rentals",
            json={
                "phone": phone,
                "size": size,
                "planId": plan_id,
                "paymentMethod": payment_method,
            },
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def _parse_response(self, response: requests.Response):
        if response.ok:
            return response.json()

        try:
            payload = response.json()
            message = payload.get("message") or payload.get("error") or response.text
        except ValueError:
            message = response.text or "Lỗi kết nối máy chủ"
        raise ApiError(message, response.status_code)

    def _mock_verify_pin(self, code: str, mode: str | None) -> tuple[RentalData, CompartmentData]:
        if len(code) != 6 or not code.isdigit():
            raise ApiError("Mã phải gồm 6 chữ số", 400)
        if code == "000000":
            raise ApiError("Mã không đúng, vui lòng thử lại", 401)
        if code == "999999":
            raise ApiError("Mã đã hết hạn", 410)

        size = "SMALL" if mode == "deposit" else "LARGE"
        rental = RentalData(
            id="mock-rental-otp",
            pin=code,
            compartment_id="A1",
            compartment_name="A1",
            expires_at=self._mock_expiry(days=7),
        )
        compartment = CompartmentData(id="A1", name="Tủ A - Ngăn A1", size=size, locker_name="Tủ A")
        return rental, compartment

    def _mock_plans(self, size: str | None) -> list[Plan]:
        multiplier = 1 if size == "SMALL" else 2
        return [
            Plan("single-1-day", "1 ngày", "single", 15000 * multiplier, 1, 1),
            Plan("single-7-days", "7 ngày", "single", 50000 * multiplier, 7, 1),
            Plan("multi-5-30", "5 lượt / 30 ngày", "multi", 90000 * multiplier, 30, 5),
            Plan("multi-10-90", "10 lượt / 90 ngày", "multi", 150000 * multiplier, 90, 10),
            Plan("month-1", "1 tháng", "monthly", 120000 * multiplier, 30, 999),
            Plan("month-3", "3 tháng", "monthly", 300000 * multiplier, 90, 999),
            Plan("month-6", "6 tháng", "monthly", 600000 * multiplier, 180, 999),
        ]

    def _mock_create_rental(
        self,
        phone: str | None,
        size: str | None,
        plan_id: str | None,
        payment_method: str | None,
    ) -> tuple[RentalData, CompartmentData]:
        compartment_name = "A1" if size == "SMALL" else "B1"
        rental = RentalData(
            id="mock-rental-rent",
            pin="847291",
            compartment_id=compartment_name,
            compartment_name=compartment_name,
            expires_at=self._mock_expiry(days=7),
            qr_data=f"mock://payment/{payment_method}/{plan_id}/{phone}",
        )
        compartment = CompartmentData(
            id=compartment_name,
            name=f"Tủ A - Ngăn {compartment_name}",
            size=size or "SMALL",
            locker_name="Tủ A",
        )
        return rental, compartment

    def _rental_from_response(self, data: dict) -> RentalData:
        return RentalData(
            id=str(data.get("id", data.get("rentalId", ""))),
            pin=str(data.get("pin", "")),
            compartment_id=str(data.get("compartmentId", "")),
            compartment_name=str(data.get("compartmentName", data.get("compartmentId", ""))),
            expires_at=str(data.get("expiresAt", "")),
            qr_data=str(data.get("qrData", "")),
        )

    def _compartment_from_response(self, data: dict) -> CompartmentData:
        name = str(data.get("compartmentName", data.get("compartmentId", "A1")))
        return CompartmentData(
            id=str(data.get("compartmentId", name)),
            name=str(data.get("lockerName", "Tủ A")) + f" - Ngăn {name}",
            size=str(data.get("size", "SMALL")),
            locker_name=str(data.get("lockerName", "Tủ A")),
        )

    def _mock_expiry(self, days: int) -> str:
        return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()
