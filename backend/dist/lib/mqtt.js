"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMqtt = connectMqtt;
exports.getMqttClient = getMqttClient;
exports.publishMqtt = publishMqtt;
exports.subscribeMqtt = subscribeMqtt;
const mqtt_1 = __importDefault(require("mqtt"));
let client = null;
let connectPromise = null;
function topicMatches(pattern, topic) {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');
    for (let i = 0; i < patternParts.length; i += 1) {
        const part = patternParts[i];
        if (part === '#')
            return true;
        if (part === '+')
            continue;
        if (part !== topicParts[i])
            return false;
    }
    return patternParts.length === topicParts.length;
}
function connectMqtt(options = {}) {
    if (client?.connected)
        return Promise.resolve(client);
    if (client && options.waitForConnect === false)
        return Promise.resolve(client);
    if (connectPromise)
        return connectPromise;
    connectPromise = new Promise((resolve) => {
        client = mqtt_1.default.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883', {
            username: process.env.MQTT_USERNAME || undefined,
            password: process.env.MQTT_PASSWORD || undefined,
            reconnectPeriod: 5000,
        });
        client.on('connect', () => {
            console.log('MQTT connected');
            resolve(client);
        });
        client.on('error', (error) => {
            console.error('MQTT error:', error.message);
        });
        client.on('offline', () => {
            console.warn('MQTT offline, reconnecting...');
        });
    });
    if (options.waitForConnect === false && client)
        return Promise.resolve(client);
    return connectPromise;
}
function getMqttClient() {
    if (!client)
        throw new Error('MQTT not initialized');
    return client;
}
function publishMqtt(topic, payload) {
    if (!client?.connected) {
        console.warn(`MQTT not connected, skipping publish: ${topic}`);
        return;
    }
    client.publish(topic, JSON.stringify(payload), { qos: 1 });
}
function subscribeMqtt(topic, handler) {
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
        if (!topicMatches(topic, receivedTopic))
            return;
        try {
            handler(receivedTopic, JSON.parse(buffer.toString('utf8')));
        }
        catch {
            handler(receivedTopic, {});
        }
    });
}
//# sourceMappingURL=mqtt.js.map