from __future__ import annotations

from typing import Any, Dict, Optional

import requests


class ApiClient:
    def __init__(self, config: Dict[str, Any]):
        base_url = str(config.get("base_url", "http://localhost:5000")).rstrip("/")
        self.base_url = base_url if base_url.endswith("/api") else f"{base_url}/api"
        self.timeout = int(config.get("timeout", 10))
        self.session = requests.Session()

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        response = self.session.request(
            method=method,
            url=f"{self.base_url}{path}",
            params=params,
            json=json,
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json() if response.content else {}

    def health(self) -> Dict[str, Any]:
        return self._request("GET", "/health")

    def verify_pin(self, pin: str, flow_type: str) -> Dict[str, Any]:
        return self._request("POST", "/auth/verify-pin", json={"pin": pin, "type": flow_type})

    def get_available_lockers(self, size: str) -> Dict[str, Any]:
        return self._request("GET", "/lockers/available", params={"size": size})

    def create_rental(self, *, phone: str, size: str, plan: str) -> Dict[str, Any]:
        payload = {"phone": phone, "size": size, "plan": plan}
        return self._request("POST", "/rentals", json=payload)

    def open_locker(self, compartment_id: str) -> Dict[str, Any]:
        return self._request("POST", f"/lockers/{compartment_id}/open")

    def close_locker(self, compartment_id: str) -> Dict[str, Any]:
        return self._request("POST", f"/lockers/{compartment_id}/close")

    def get_locker_status(self, compartment_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/lockers/{compartment_id}/status")

    def get_rental_by_pin(self, pin: str) -> Dict[str, Any]:
        return self._request("GET", f"/rentals/by-pin/{pin}")
