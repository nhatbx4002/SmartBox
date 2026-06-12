from __future__ import annotations

import json
from threading import Event

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
        self.reconnect_attempts = 0
        self.disconnect_callback = None
        self._connect_event = Event()
        self._connect_error = None

        if not self.mock:
            self._client = mqtt.Client(
                client_id=self.cabinet_id,
                callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
            )
            self._client.on_connect = self._on_connect
            self._client.on_disconnect = self._on_disconnect

    def _on_connect(self, client, userdata, flags, reason_code, properties) -> None:
        if reason_code == 0:
            self.connected = True
            self.reconnect_attempts = 0
            self._connect_error = None
            print("[MQTT] Connected successfully")
        else:
            print(f"[MQTT] Connection failed with rc: {reason_code}")
            self.connected = False
            self._connect_error = reason_code
        self._connect_event.set()

    def _on_disconnect(self, client, userdata, reason_code, properties) -> None:
        self.connected = False
        if reason_code == 0:
            print("[MQTT] Disconnected cleanly")
        else:
            print(f"[MQTT] Unexpected disconnect (rc={reason_code})")
            self.reconnect_attempts += 1
            if self.reconnect_attempts >= 3:
                if self.disconnect_callback:
                    self.disconnect_callback()

    def _try_reconnect(self) -> None:
        if self.mock:
            self.connected = True
            return
        if self._client is not None:
            self._connect_event.clear()
            self._connect_error = None
            rc = self._client.reconnect()
            if rc != 0:
                self.connected = False
                raise RuntimeError(f"Reconnect failed with code {rc}")
            timeout = float(self.config.get("mqtt", {}).get("connect_timeout", 10))
            if not self._connect_event.wait(timeout):
                self.connected = False
                raise TimeoutError(f"MQTT reconnect timed out after {timeout:g}s")
            if not self.connected:
                raise RuntimeError(f"MQTT reconnect rejected with rc={self._connect_error}")

    def connect(self, username: str | None = None, password: str | None = None) -> None:
        if self.mock:
            self.connected = True
            return

        # Use provided credentials, fallback to config
        user = username or self.config.get("mqtt", {}).get("username")
        pwd = password or self.config.get("mqtt", {}).get("password")
        if user:
            self._client.username_pw_set(user, pwd)

        broker = self.config.get("mqtt", {}).get("broker", "localhost")
        port = int(self.config.get("mqtt", {}).get("port", 1883))
        timeout = float(self.config.get("mqtt", {}).get("connect_timeout", 10))
        print(f"[MQTT] Connecting to {broker}:{port} as cabinet={self.cabinet_id} user={user}")
        self._connect_event.clear()
        self._connect_error = None
        self.connected = False
        self._client.connect(broker, port, keepalive=60)
        self._client.loop_start()
        if not self._connect_event.wait(timeout):
            self.connected = False
            raise TimeoutError(f"MQTT connect timed out after {timeout:g}s: {broker}:{port}")
        if not self.connected:
            raise RuntimeError(f"MQTT connection rejected with rc={self._connect_error}: {broker}:{port}")

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

    def subscribe_config_reload(self, cabinet_id: str, callback) -> None:
        topic = f"smartbox/{cabinet_id}/config/reload"

        if self.mock:
            self._config_reload_callback = callback
            self.last_event = {"topic": topic, "payload": {"subscription": "config_reload"}}
            return

        def on_message(client, userdata, msg):
            try:
                payload = json.loads(msg.payload.decode("utf-8"))
                callback(payload.get("configVersion"), payload.get("compartments", []))
            except Exception as error:
                print(f"[MQTT ERROR] config reload message failed: {error}")

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
