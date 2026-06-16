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
        self._pairing_mode = False
        self._pairing_topic = None
        self._on_pairing_callback = None

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
            if self._pairing_mode:
                if self._pairing_topic:
                    self._client.subscribe(self._pairing_topic)
                    print(f"[MQTT] Subscribed to pairing topic: {self._pairing_topic}")
            else:
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

        if self._pairing_mode and self._pairing_topic and topic == self._pairing_topic:
            if self._on_pairing_callback:
                self._on_pairing_callback(payload)
            return

        parts = topic.split("/")
        if len(parts) >= 4:
            if parts[2] == "lock":
                compartment = parts[3]
                if parts[4] == "unlock" and self._on_unlock_callback:
                    self._on_unlock_callback(compartment)
                elif parts[4] == "lock" and self._on_lock_callback:
                    self._on_lock_callback(compartment)

        if len(parts) >= 3 and parts[2] == "reload" and self._on_config_reload_callback:
            self._on_config_reload_callback(
                payload.get("configVersion"),
                payload.get("compartments", []),
            )

    def start_pairing_listen(self, session_id: str, callback) -> None:
        """K?ch ho?t ch? ?? nghe tin pairing t? backend."""
        self._pairing_mode = True
        self._pairing_topic = f"smartbox/pairing/{session_id}"
        self._on_pairing_callback = callback
        if self.connected and self._client:
            self._client.subscribe(self._pairing_topic)
            print(f"[MQTT] Subscribed to pairing topic: {self._pairing_topic}")

    def stop_pairing_listen(self) -> None:
        """D?n d?p sau khi pairing th?nh c?ng ho?c b? h?y."""
        if not self._pairing_mode:
            return
        if self.connected and self._client and self._pairing_topic:
            self._client.publish(self._pairing_topic, b"", qos=1, retain=True)
            self._client.unsubscribe(self._pairing_topic)
            print(f"[MQTT] Unsubscribed and cleared retained message on {self._pairing_topic}")
        self._pairing_mode = False
        self._pairing_topic = None
        self._on_pairing_callback = None

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
