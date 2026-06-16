from __future__ import annotations

import json

import paho.mqtt.client as mqtt


class MqttClient:
    """Simple MQTT client for kiosk."""

    def __init__(self, config: dict, cabinet_id: str):
        self.config = config
        self.cabinet_id = cabinet_id
        self.connected = False
        self._client = None
        self._on_unlock_callback = None
        self._on_lock_callback = None
        self._on_config_reload_callback = None

    def connect(self) -> None:
        self._client = mqtt.Client(
            client_id=self.cabinet_id,
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        )
        self._client.on_connect = self._on_connect
        self._client.on_disconnect = self._on_disconnect
        self._client.on_message = self._on_message

        username = self.config.get("mqtt", {}).get("username")
        password = self.config.get("mqtt", {}).get("password")
        if username:
            self._client.username_pw_set(str(username), str(password))

        broker = self.config.get("mqtt", {}).get("broker", "localhost")
        port = int(self.config.get("mqtt", {}).get("port", 1883))
        print(f"[MQTT] Connecting to {broker}:{port} as {self.cabinet_id}")
        self._client.connect(broker, port, keepalive=60)
        self._client.loop_start()

    def _on_connect(self, client, userdata, flags, reason_code, properties) -> None:
        if reason_code == 0:
            self.connected = True
            print("[MQTT] Connected successfully")
            self._subscribe_all()
        else:
            print(f"[MQTT] Connection failed: {reason_code}")

    def _on_disconnect(self, client, userdata, reason_code, properties) -> None:
        self.connected = False
        print(f"[MQTT] Disconnected: {reason_code}")

    def _on_message(self, client, userdata, msg) -> None:
        topic = msg.topic
        payload_bytes = msg.payload
        if not payload_bytes:
            return

        try:
            payload = json.loads(payload_bytes.decode())
        except Exception:
            payload = {}

        parts = topic.split("/")
        if len(parts) >= 4:
            if parts[2] == "lock":
                compartment = parts[3]
                if parts[4] == "unlock" and self._on_unlock_callback:
                    self._on_unlock_callback(compartment)
                elif parts[4] == "lock" and self._on_lock_callback:
                    self._on_lock_callback(compartment)

        if len(parts) >= 4 and parts[2] == "config" and parts[3] == "reload" and self._on_config_reload_callback:
            self._on_config_reload_callback(
                payload.get("configVersion"),
                payload.get("compartments", []),
                payload.get("mcpDevices", []),
            )

    def _subscribe_all(self) -> None:
        self._client.subscribe(f"smartbox/{self.cabinet_id}/lock/+/unlock")
        self._client.subscribe(f"smartbox/{self.cabinet_id}/lock/+/lock")
        self._client.subscribe(f"smartbox/{self.cabinet_id}/config/reload")

    def set_unlock_callback(self, cb) -> None:
        self._on_unlock_callback = cb

    def set_lock_callback(self, cb) -> None:
        self._on_lock_callback = cb

    def set_config_reload_callback(self, cb) -> None:
        self._on_config_reload_callback = cb

    def publish_unlock(self, compartment_id: str, duration: int = 3) -> None:
        if self.connected:
            topic = f"smartbox/{self.cabinet_id}/lock/{compartment_id}/unlock"
            self._client.publish(topic, json.dumps({"compartmentId": compartment_id, "duration": duration}), qos=1)
            print(f"[MQTT] Published unlock: {compartment_id}")

    def publish_lock(self, compartment_id: str) -> None:
        if self.connected:
            topic = f"smartbox/{self.cabinet_id}/lock/{compartment_id}/lock"
            self._client.publish(topic, json.dumps({"compartmentId": compartment_id}), qos=1)
            print(f"[MQTT] Published lock: {compartment_id}")

    def publish_heartbeat(self) -> None:
        if self.connected:
            topic = f"smartbox/{self.cabinet_id}/heartbeat"
            self._client.publish(topic, json.dumps({"cabinetId": self.cabinet_id}), qos=1)

    def disconnect(self) -> None:
        if self._client:
            self._client.loop_stop()
            self._client.disconnect()
            self.connected = False
