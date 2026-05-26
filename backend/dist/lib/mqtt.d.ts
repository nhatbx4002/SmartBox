import { MqttClient } from 'mqtt';
type ConnectMqttOptions = {
    waitForConnect?: boolean;
};
export declare function connectMqtt(options?: ConnectMqttOptions): Promise<MqttClient>;
export declare function getMqttClient(): MqttClient;
export declare function publishMqtt(topic: string, payload: object): void;
export declare function subscribeMqtt(topic: string, handler: (topic: string, payload: unknown) => void): void;
export {};
//# sourceMappingURL=mqtt.d.ts.map