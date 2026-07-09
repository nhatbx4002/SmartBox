import mqtt, { MqttClient, IClientOptions, IClientPublishOptions } from 'mqtt';

let client: MqttClient | null = null;
let connectPromise: Promise<MqttClient> | null = null;
let onReconnectCallback: (() => void) | null = null;

type MqttPayload = Record<string, unknown>;

/**
 * Lấy MQTT broker URL từ biến môi trường.
 *
 * Ưu tiên:
 * 1. MQTT_BROKER_URL
 * 2. MQTT_URL
 *
 */
function getMqttBrokerUrl(): string {
    return process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
}

/**
 * Tạo options kết nối MQTT.
 *
 * clean: true
 * - Mỗi lần backend reconnect sẽ bắt đầu session mới.
 *
 * reconnectPeriod:
 * - MQTT.js sẽ tự reconnect sau mỗi 5 giây nếu mất kết nối.
 *
 * connectTimeout:
 * - Giới hạn thời gian chờ kết nối ban đầu.
 */
function getMqttOptions(): IClientOptions {
    return {
        clientId: process.env.MQTT_CLIENT_ID || `omnibox-backend-${process.pid}`,
        username: process.env.MQTT_USERNAME || undefined,
        password: process.env.MQTT_PASSWORD || undefined,
        clean: true,
        keepalive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 10_000,
    };
}

/**
 * Khởi tạo kết nối MQTT.
 *
 * Hàm này đảm bảo trong toàn bộ backend chỉ có một MQTT client chính.
 * Nếu client đã connected thì trả lại client hiện tại.
 * Nếu đang trong quá trình connect thì trả lại connectPromise cũ để tránh tạo nhiều kết nối song song.
 *
 */
export function connectMqtt(): Promise<MqttClient> {
    if (client?.connected) {
        return Promise.resolve(client);
    }

    if (connectPromise) {
        return connectPromise;
    }

    connectPromise = new Promise((resolve, reject) => {
        const mqttClient = mqtt.connect(getMqttBrokerUrl(), getMqttOptions());
        client = mqttClient;

        const connectTimeout = setTimeout(() => {
            connectPromise = null;
            reject(new Error('MQTT connect timeout'));
        }, 15_000);

        mqttClient.once('connect', () => {
            clearTimeout(connectTimeout);
            console.log('[MQTT] connected');
            resolve(mqttClient);
        });

        mqttClient.on('connect', () => {
            if (connectPromise) return; // initial connect đã resolve
            console.log('[MQTT] reconnected, re-subscribing...');
            if (onReconnectCallback) onReconnectCallback();
        });

        mqttClient.once('error', (error) => {
            clearTimeout(connectTimeout);
            connectPromise = null;
            console.error('[MQTT] initial connection error:', error.message);
            reject(error);
        });

        mqttClient.on('reconnect', () => {
            console.log('[MQTT] reconnecting...');
        });

        mqttClient.on('offline', () => {
            console.warn('[MQTT] offline');
        });

        mqttClient.on('close', () => {
            console.warn('[MQTT] connection closed');
        });

        mqttClient.on('error', (error) => {
            console.error('[MQTT] error:', error.message);
        });
    });

    return connectPromise;
}

/**
 * Lấy MQTT client hiện tại.
 *
 * Chỉ dùng khi chắc chắn connectMqtt() đã được gọi trước đó.
 * Nếu chưa khởi tạo MQTT client thì throw lỗi để tránh publish/subscribe âm thầm thất bại.
 */
export function getMqttClient(): MqttClient {
    if (!client) {
        throw new Error('MQTT not initialized');
    }

    return client;
}

/**
 * Publish một JSON message lên MQTT topic.
 *
 * Hàm này sẽ:
 * - Tự connect nếu client chưa connected.
 * - JSON.stringify payload.
 * - Publish với QoS 1 mặc định để broker xác nhận đã nhận message.
 * - Throw lỗi nếu publish thất bại.
 *
 */
export async function publishMqtt(
    topic: string,
    payload: MqttPayload,
    options: IClientPublishOptions = {},
): Promise<void> {
    const mqttClient = client?.connected ? client : await connectMqtt();

    const message = JSON.stringify(payload);

    return new Promise((resolve, reject) => {
        mqttClient.publish(
            topic,
            message,
            {
                qos: 1,
                retain: false,
                ...options,
            },
            (error) => {
                if (error) {
                    console.error(`[MQTT] publish error on ${topic}:`, error.message);
                    reject(error);
                    return;
                }

                resolve();
            },
        );
    });
}

/**
 * Subscribe một MQTT topic và parse payload dạng JSON.
 *
 *
 * Khi nhận message:
 * - Kiểm tra topic nhận được có match pattern đã subscribe không.
 * - Parse buffer thành JSON.
 * - Gọi handler với receivedTopic và payload đã parse.
 */
export function subscribeMqtt<TPayload = unknown>(
    topic: string,
    handler: (topic: string, payload: TPayload) => void | Promise<void>,
): void {
    if (!client) {
        throw new Error(`MQTT not initialized before subscribe: ${topic}`);
    }

    client.subscribe(topic, { qos: 1 }, (error) => {
        if (error) {
            console.error(`[MQTT] subscribe error (${topic}):`, error.message);
            return;
        }

        console.log(`[MQTT] subscribed: ${topic}`);
    });

    client.on('message', async (receivedTopic, buffer) => {
        if (!topicMatches(topic, receivedTopic)) {
            return;
        }

        try {
            const raw = buffer.toString('utf8');
            const payload = JSON.parse(raw) as TPayload;

            await handler(receivedTopic, payload);
        } catch (error) {
            console.error(`[MQTT] message handler failed (${receivedTopic}):`, error);
        }
    });
}

/**
 * Đóng kết nối MQTT.
 *
 * Dùng khi shutdown app hoặc test cleanup.
 * Sau khi disconnect, client và connectPromise được reset về null.
 */
export async function disconnectMqtt(): Promise<void> {
    if (!client) {
        return;
    }

    await new Promise<void>((resolve) => {
        client?.end(false, {}, () => {
            client = null;
            connectPromise = null;
            console.log('[MQTT] disconnected');
            resolve();
        });
    });
}

/**
 * Kiểm tra một topic thực tế có khớp với topic pattern hay không.
 *
 * Hỗ trợ wildcard MQTT:
 * +  : match đúng một cấp topic
 * #  : match nhiều cấp topic còn lại
 *
 */
function topicMatches(pattern: string, topic: string): boolean {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < patternParts.length; i += 1) {
        const patternPart = patternParts[i];
        const topicPart = topicParts[i];

        if (patternPart === '#') {
            return true;
        }

        if (patternPart === '+') {
            if (!topicPart) {
                return false;
            }

            continue;
        }

        if (patternPart !== topicPart) {
            return false;
        }
    }

    return patternParts.length === topicParts.length;
}

export function setMqttReconnectHandler(cb: () => void): void {
    onReconnectCallback = cb;
}