from __future__ import annotations

import json

import paho.mqtt.client as mqtt


class MqttClient:
    """Mock-safe MQTT facade for the kiosk controllers."""

    def __init__(self, config: dict | str | None = None, cabinet_id: str = "smartbox-demo", mock: bool = True):
        if isinstance(config, str):
            cabinet_id = config
            config = None

        self.config = config or {}
        self.cabinet_id = cabinet_id
        self.mock = mock
        self.connected = False
        self.last_event: dict | None = None
        self._client = None

        if not self.mock:
            try:
                self._client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
            except (AttributeError, TypeError):
                self._client = mqtt.Client()

            username = self.config.get("mqtt", {}).get("username") or None
            password = self.config.get("mqtt", {}).get("password") or None
            if username:
                self._client.username_pw_set(username, password)

    def connect(self) -> None:
        if self.mock:
            self.connected = True
            return

        broker = self.config.get("mqtt", {}).get("broker", "localhost")
        port = int(self.config.get("mqtt", {}).get("port", 1883))
        self._client.connect(broker, port)
        self._client.loop_start()
        self.connected = True

    def disconnect(self) -> None:
        if not self.mock and self._client is not None:
            self._client.loop_stop()
            self._client.disconnect()
        self.connected = False

    def subscribe_unlock(self, cabinet_id: str, callback) -> None:
        topic = f"smartbox/{cabinet_id}/lock/+/unlock"

        if self.mock:
            self.last_event = {"topic": topic, "payload": {"subscription": "unlock"}}
            return

        def on_message(client, userdata, msg):
            parts = msg.topic.split("/")
            if len(parts) >= 5:
                callback(parts[3])

        self._client.message_callback_add(topic, on_message)
        self._client.subscribe(topic)

    def subscribe_lock(self, cabinet_id: str, callback) -> None:
        topic = f"smartbox/{cabinet_id}/lock/+/lock"

        if self.mock:
            self.last_event = {"topic": topic, "payload": {"subscription": "lock"}}
            return

        def on_message(client, userdata, msg):
            parts = msg.topic.split("/")
            if len(parts) >= 5:
                callback(parts[3])

        self._client.message_callback_add(topic, on_message)
        self._client.subscribe(topic)

    def publish_unlock(self, compartment_id: str, duration: int = 3) -> None:
        topic = f"smartbox/{self.cabinet_id}/lock/{compartment_id}/unlock"
        payload = {"compartmentId": compartment_id, "duration": duration}
        self.last_event = {
            "topic": topic,
            "payload": payload,
        }
        if not self.mock and self._client is not None:
            self._client.publish(topic, json.dumps(payload), qos=1)

    def publish_lock(self, compartment_id: str) -> None:
        topic = f"smartbox/{self.cabinet_id}/lock/{compartment_id}/lock"
        payload = {"compartmentId": compartment_id}
        self.last_event = {
            "topic": topic,
            "payload": payload,
        }
        if not self.mock and self._client is not None:
            self._client.publish(topic, json.dumps(payload), qos=1)

    def publish_door_opened(self, compartment_id: str, rental_id: str) -> None:
        """Notify backend that the door was physically opened for a rental."""
        topic = f"smartbox/{self.cabinet_id}/event/{compartment_id}"
        payload = {"event": "opened", "rentalId": rental_id}
        self.last_event = {
            "topic": topic,
            "payload": payload,
        }
        if not self.mock and self._client is not None:
            self._client.publish(topic, json.dumps(payload), qos=1)

    def publish_heartbeat(self) -> None:
        topic = f"smartbox/{self.cabinet_id}/heartbeat"
        payload = {"cabinetId": self.cabinet_id}
        self.last_event = {
            "topic": topic,
            "payload": payload,
        }
        if not self.mock and self._client is not None:
            self._client.publish(topic, json.dumps(payload), qos=1)
