from __future__ import annotations

import json

import paho.mqtt.client as mqtt
from PySide6.QtCore import QObject, Signal


class MqttClient(QObject):
    payment_received = Signal(object, object)
    unlock_requested = Signal(str)
    config_reload_requested = Signal(object, object, object, object)

    def __init__(self, config: dict, cabinet_id: str):
        super().__init__()
        self.config = config
        self.cabinet_id = cabinet_id
        self.connected = False
        self._client = None
        self._on_unlock_callback = None
        self._on_config_reload_callback = None
        self._on_payment_callback = None

        self.payment_received.connect(self._dispatch_payment)
        self.unlock_requested.connect(self._dispatch_unlock)
        self.config_reload_requested.connect(self._dispatch_config_reload)

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
        self._client.connect(broker, port, keepalive=60)
        self._client.loop_start()

    def _on_connect(self, client, userdata, flags, reason_code, properties) -> None:
        if reason_code == 0:
            self.connected = True
            self._subscribe_all()
        else:
            print(f"[MQTT] Connection failed: {reason_code}")

    def _on_disconnect(self, client, userdata, reason_code, properties) -> None:
        self.connected = False

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
        # omnibox/{cabinetId}/cmd/unlock/{compartmentName}
        if len(parts) >= 5 and parts[2] == "cmd" and parts[3] == "unlock":
            compartment = parts[4]
            self.unlock_requested.emit(compartment)

        # omnibox/{cabinetId}/cmd/config-reload
        elif len(parts) >= 4 and parts[2] == "cmd" and parts[3] == "config-reload":
            self.config_reload_requested.emit(
                payload.get("configVersion"),
                payload.get("compartments", []),
                payload.get("mcpDevices", []),
                payload.get("status"),
            )

        # omnibox/{cabinetId}/cmd/payment/{orderCode}
        elif len(parts) >= 5 and parts[2] == "cmd" and parts[3] == "payment":
            try:
                order_code = int(parts[4])
            except (ValueError, IndexError):
                order_code = payload.get("orderCode")
            self.payment_received.emit(order_code, payload)

    def _subscribe_all(self) -> None:
        self._client.subscribe(f"omnibox/{self.cabinet_id}/cmd/unlock/+")
        self._client.subscribe(f"omnibox/{self.cabinet_id}/cmd/config-reload")
        self._client.subscribe(f"omnibox/{self.cabinet_id}/cmd/payment/+")

    def set_unlock_callback(self, cb) -> None:
        self._on_unlock_callback = cb

    def set_config_reload_callback(self, cb) -> None:
        self._on_config_reload_callback = cb

    def set_payment_callback(self, cb) -> None:
        self._on_payment_callback = cb

    def _dispatch_payment(self, order_code, payload) -> None:
        if self._on_payment_callback:
            self._on_payment_callback(order_code, payload)

    def _dispatch_unlock(self, compartment_id: str) -> None:
        if self._on_unlock_callback:
            self._on_unlock_callback(compartment_id)

    def _dispatch_config_reload(self, version, compartments, mcp_devices, status=None) -> None:
        if self._on_config_reload_callback:
            self._on_config_reload_callback(version, compartments, mcp_devices, status)

    def publish_unlock(self, compartment_id: str, duration: int = 3) -> None:
        if self.connected:
            topic = f"omnibox/{self.cabinet_id}/cmd/unlock/{compartment_id}"
            self._client.publish(
                topic, json.dumps({"compartmentId": compartment_id, "duration": duration}), qos=1
            )

    def publish_door_opened(self, compartment_id: str, rental_id: str) -> None:
        if self.connected:
            topic = f"omnibox/{self.cabinet_id}/evt/door-opened"
            self._client.publish(
                topic,
                json.dumps(
                    {"event": "opened", "rentalId": rental_id, "compartmentId": compartment_id}
                ),
                qos=1,
            )

    def publish_heartbeat(self) -> None:
        if self.connected:
            topic = f"omnibox/{self.cabinet_id}/evt/heartbeat"
            self._client.publish(topic, json.dumps({"cabinetId": self.cabinet_id}), qos=1)

    def disconnect(self) -> None:
        if self._client:
            self._client.loop_stop()
            self._client.disconnect()
            self.connected = False
