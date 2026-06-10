from __future__ import annotations

from datetime import datetime, timedelta, timezone
from secrets import choice, token_hex
import string

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
        self.jwt_token: str | None = None
        self._pairing_sessions: dict[str, dict] = {}
        self._pairing_poll_counts: dict[str, int] = {}
        self._mock_compartments: list[dict] = []
        self._config_version_override: int | None = None

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

    def verify_qr(self, token: str) -> tuple[RentalData, CompartmentData]:
        if self.mock:
            return self._mock_verify_qr(token)

        response = requests.post(
            f"{self.base_url}/api/rentals/verify-qr",
            json={"token": token},
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def get_plans(self, size: str | None) -> list[Plan]:
        if self.mock:
            return self._mock_plans(size)

        response = requests.get(f"{self.base_url}/api/lockers/plans", params={"size": size}, timeout=self.timeout)
        data = self._parse_response(response)
        return [
            Plan(
                id=self._ui_plan_id(item),
                name=str(item["name"]),
                rental_type=str(item.get("rentalType", item.get("rental_type", "single"))),
                price=int(item["price"]),
                duration_days=int(item.get("durationDays", item.get("duration_days", 1))),
                max_opens=int(item.get("maxOpens") or item.get("max_opens") or 999),
            )
            for item in data
        ]

    def check_availability(self, size: str | None) -> dict:
        if self.mock:
            return {"available": True, "count": 3, "size": size}

        response = requests.get(f"{self.base_url}/api/lockers/available", params={"size": size}, timeout=self.timeout)
        data = self._parse_response(response)
        if isinstance(data, list):
            return {"available": len(data) > 0, "count": len(data), "size": size, "items": data}
        return data

    def start_pairing(self, hardwareSerial: str, discoveredMcpDevices: list[dict]) -> dict:
        if self.mock:
            session_id = f"ps_{token_hex(6)}"
            pairing_code = self._mock_pairing_code()
            session = {
                "id": session_id,
                "sessionId": session_id,
                "pairingCode": pairing_code,
                "hardwareSerial": hardwareSerial,
                "discoveredMcpDevices": discoveredMcpDevices,
                "status": "PENDING",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "expiresAt": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
                "expiresInSeconds": 600,
            }
            self._pairing_sessions[session_id] = session
            self._pairing_poll_counts[session_id] = 0
            return session

        response = requests.post(
            f"{self.base_url}/api/pair/start",
            json={
                "hardwareSerial": hardwareSerial,
                "discoveredMcpDevices": discoveredMcpDevices,
            },
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_cabinet_config(self, cabinet_id: str, version: int | None = None) -> dict:
        if self.mock:
            return {
                "cabinetId": cabinet_id,
                "configVersion": self._config_version_override or 1,
                "compartments": self._mock_compartments,
                "mcpDevices": [{"id": "mcp-1", "bus": 1, "address": 32}],
            }

        params = {}
        if version is not None:
            params["version"] = version
        response = requests.get(
            f"{self.base_url}/api/cabinets/{cabinet_id}/config",
            headers=self._headers(),
            params=params,
            timeout=self.timeout,
        )
        return self._parse_response(response)

    def get_pairing_session(self, session_id: str) -> dict:
        if self.mock:
            session = self._pairing_sessions.get(session_id)
            if session is None:
                raise ApiError("Pairing session not found", 404)

            self._pairing_poll_counts[session_id] = self._pairing_poll_counts.get(session_id, 0) + 1
            if self._pairing_poll_counts[session_id] >= 3:
                if session.get("status") != "APPROVED":
                    session = {
                        **session,
                        "status": "APPROVED",
                        "cabinetId": f"cab_{session_id[-6:]}",
                        "jwt": f"jwt_{token_hex(12)}",
                        "mqttConfig": {
                            "brokerUrl": "mqtt://192.168.1.29:1883",
                            "username": f"cab_{session_id[-6:]}",
                            "password": token_hex(12),
                        },
                        "configVersion": 1,
                        "compartments": [
                            {
                                "id": "comp-A1",
                                "name": "A1",
                                "lockMcpDeviceId": "mcp-1",
                                "mcp23017PinLock": 4,
                            }
                        ],
                        "mcpDevices": [
                            {"id": "mcp-1", "bus": 1, "address": 32, "name": "MCP23017"}
                        ],
                    }
                    self._pairing_sessions[session_id] = session
            return self._pairing_sessions[session_id]

        response = requests.get(f"{self.base_url}/api/pair/{session_id}", timeout=self.timeout)
        return self._parse_response(response)

    def create_rental(
        self,
        phone: str | None,
        size: str | None,
        plan_id: str | None,
        payment_method: str | None,
        cabinet_id: str | None = None,
    ) -> tuple[RentalData, CompartmentData]:
        if self.mock:
            return self._mock_create_rental(phone, size, plan_id, payment_method)

        response = requests.post(
            f"{self.base_url}/api/rentals",
            json={
                "phone": phone,
                "size": size,
                "planId": self._backend_plan_id(size, plan_id),
                "paymentMethod": payment_method,
                "cabinetId": cabinet_id,
            },
            timeout=self.timeout,
        )
        data = self._parse_response(response)
        return self._rental_from_response(data), self._compartment_from_response(data)

    def complete_rental(self, rental_id: str) -> None:
        if self.mock:
            return

        response = requests.post(
            f"{self.base_url}/api/rentals/{rental_id}/complete",
            timeout=self.timeout,
        )
        if not response.ok:
            data = self._parse_response(response)
            raise ApiError(data.get("error", {}).get("message", "Không thể kết thúc cho thuê") if isinstance(data, dict) else str(data), response.status_code)

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

    def _mock_verify_qr(self, token: str) -> tuple[RentalData, CompartmentData]:
        if not token or token == "invalid":
            raise ApiError("Ma QR khong hop le", 400)

        rental = RentalData(
            id="mock-rental-qr",
            pin="847291",
            compartment_id="A1",
            compartment_name="A1",
            expires_at=self._mock_expiry(days=7),
            qr_data=token,
        )
        compartment = CompartmentData(id="A1", name="Tu A - Ngan A1", size="SMALL", locker_name="Tu A")
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
        rental = data.get("rental", data)
        compartment = data.get("compartment", {})
        return RentalData(
            id=str(rental.get("id", data.get("rentalId", ""))),
            pin=str(data.get("pin", data.get("code", rental.get("code", "")))),
            compartment_id=str(data.get("compartmentId", rental.get("compartmentId", compartment.get("id", "")))),
            compartment_name=str(data.get("compartmentName", compartment.get("name", data.get("compartmentId", "")))),
            expires_at=str(data.get("expiresAt", rental.get("expiresAt", ""))),
            qr_data=str(data.get("qrData", rental.get("qrToken", ""))),
        )

    def _compartment_from_response(self, data: dict) -> CompartmentData:
        compartment = data.get("compartment", {})
        cabinet = compartment.get("cabinet", {})
        name = str(data.get("compartmentName", compartment.get("name", data.get("compartmentId", "A1"))))
        locker_name = str(data.get("lockerName", cabinet.get("name", "Tủ A")))
        return CompartmentData(
            id=str(data.get("compartmentId", compartment.get("id", name))),
            name=locker_name + f" - Ngăn {name}",
            size=str(data.get("size", compartment.get("size", "SMALL"))),
            locker_name=locker_name,
        )

    def _mock_expiry(self, days: int) -> str:
        return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()

    def _mock_pairing_code(self) -> str:
        alphabet = string.ascii_uppercase + string.digits
        return "".join(choice(alphabet) for _ in range(6))

    def _ui_plan_id(self, item: dict) -> str:
        rental_type = str(item.get("rentalType", "")).upper()
        duration_days = int(item.get("durationDays", item.get("duration_days", 1)))
        max_opens = item.get("maxOpens", item.get("max_opens"))

        if rental_type == "ONCE" and duration_days == 1:
            return "single-1-day"
        if rental_type == "ONCE" and duration_days == 7:
            return "single-7-days"
        if rental_type == "DAILY" and int(max_opens or 0) == 5:
            return "multi-5-30"
        if rental_type == "DAILY" and int(max_opens or 0) == 10:
            return "multi-10-90"
        if rental_type == "MONTHLY" and duration_days == 30:
            return "month-1"
        if rental_type == "MONTHLY" and duration_days == 90:
            return "month-3"
        if rental_type == "MONTHLY" and duration_days == 180:
            return "month-6"
        return str(item["id"])

    def _backend_plan_id(self, size: str | None, plan_id: str | None) -> str | None:
        if not size or not plan_id:
            return plan_id
        prefix = "small" if size == "SMALL" else "large"
        mapping = {
            "single-1-day": f"{prefix}-1-day",
            "single-7-days": f"{prefix}-7-days",
            "multi-5-30": f"{prefix}-5-opens-30-days",
            "multi-10-90": f"{prefix}-10-opens-90-days",
            "month-1": f"{prefix}-1-month",
            "month-3": f"{prefix}-3-months",
            "month-6": f"{prefix}-6-months",
        }
        return mapping.get(plan_id, plan_id)
