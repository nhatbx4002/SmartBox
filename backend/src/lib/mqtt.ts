import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;
let connectPromise: Promise<MqttClient> | null = null;

function topicMatches(pattern: string, topic: string): boolean {
  const patternParts = pattern.split('/');
  const topicParts = topic.split('/');

  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i];
    if (part === '#') return true;
    if (part === '+') continue;
    if (part !== topicParts[i]) return false;
  }

  return patternParts.length === topicParts.length;
}

export function connectMqtt(): Promise<MqttClient> {
  if (client?.connected) return Promise.resolve(client);
  if (connectPromise) return connectPromise;

  connectPromise = new Promise((resolve) => {
    client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883', {
      username: process.env.MQTT_USERNAME || undefined,
      password: process.env.MQTT_PASSWORD || undefined,
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      console.log('MQTT connected');
      resolve(client!);
    });

    client.on('error', (error) => {
      console.error('MQTT error:', error.message);
    });

    client.on('offline', () => {
      console.warn('MQTT offline, reconnecting...');
    });
  });

  return connectPromise;
}

export function getMqttClient(): MqttClient {
  if (!client) throw new Error('MQTT not initialized');
  return client;
}

export function publishMqtt(topic: string, payload: object): void {
  if (!client?.connected) {
    console.warn(`MQTT not connected, skipping publish: ${topic}`);
    return;
  }

  client.publish(topic, JSON.stringify(payload), { qos: 1 });
}

export function subscribeMqtt(topic: string, handler: (topic: string, payload: unknown) => void): void {
  if (!client) {
    console.warn(`MQTT not initialized, skipping subscribe: ${topic}`);
    return;
  }

  client.subscribe(topic, (error) => {
    if (error) {
      console.error(`MQTT subscribe error (${topic}):`, error.message);
      return;
    }
    console.log(`MQTT subscribed: ${topic}`);
  });

  client.on('message', (receivedTopic, buffer) => {
    if (!topicMatches(topic, receivedTopic)) return;
    try {
      handler(receivedTopic, JSON.parse(buffer.toString('utf8')));
    } catch {
      handler(receivedTopic, {});
    }
  });
}
