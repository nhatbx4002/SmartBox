import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import mqtt from 'mqtt';
import { connectMqtt } from '../src/lib/mqtt';

class FakeMqttClient extends EventEmitter {
  connected = false;

  publish() {}

  subscribe(_topic: string, callback?: (error?: Error) => void) {
    callback?.();
  }
}

test('connectMqtt can initialize without waiting for broker connection', async (t) => {
  const originalConnect = mqtt.connect;
  t.after(() => {
    (mqtt.connect as unknown) = originalConnect;
  });

  (mqtt.connect as unknown) = () => new FakeMqttClient();

  const connectWithoutWaiting = connectMqtt as unknown as (options: {
    waitForConnect: false;
  }) => Promise<unknown>;

  const resolved = await Promise.race([
    connectWithoutWaiting({ waitForConnect: false }).then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 25)),
  ]);

  assert.equal(resolved, true);
});
