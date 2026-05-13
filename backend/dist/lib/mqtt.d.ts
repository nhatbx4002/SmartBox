import { MqttClient } from 'mqtt';
export declare function connectMqtt(): Promise<MqttClient>;
export declare function getMqttClient(): MqttClient;
export declare function publishMqtt(topic: string, payload: object): void;
export declare function subscribeMqtt(topic: string, handler: (topic: string, payload: unknown) => void): void;
//# sourceMappingURL=mqtt.d.ts.map