from __future__ import annotations


class MqttClient:
    """Mock-safe MQTT facade for the kiosk controllers."""

    def __init__(self, cabinet_id: str = "smartbox-demo", mock: bool = True):
        self.cabinet_id = cabinet_id
        self.mock = mock
        self.connected = False
        self.last_event: dict | None = None

    def connect(self) -> None:
        self.connected = True

    def disconnect(self) -> None:
        self.connected = False

    def publish_unlock(self, compartment_id: str, duration: int = 3) -> None:
        self.last_event = {
            "topic": f"smartbox/{self.cabinet_id}/unlock",
            "payload": {"compartmentId": compartment_id, "duration": duration},
        }

    def publish_lock(self, compartment_id: str) -> None:
        self.last_event = {
            "topic": f"smartbox/{self.cabinet_id}/lock",
            "payload": {"compartmentId": compartment_id},
        }
