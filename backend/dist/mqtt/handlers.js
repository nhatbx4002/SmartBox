"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMqttHandlers = setupMqttHandlers;
const prisma_1 = require("../generated/prisma");
const mqtt_1 = require("../lib/mqtt");
const prisma_2 = require("../lib/prisma");
const cabinet_service_1 = require("../services/cabinet.service");
const rental_service_1 = require("../services/rental.service");
function setupMqttHandlers() {
    (0, mqtt_1.subscribeMqtt)('smartbox/+/lock/+/status', async (topic, payload) => {
        try {
            const [, cabinetId, , compartmentName] = topic.split('/');
            const parsed = payload;
            if (!isLockStatus(parsed.lockStatus) || !isDoorStatus(parsed.doorStatus))
                return;
            const compartment = await prisma_2.prisma.compartment.findFirst({
                where: { cabinetId, name: compartmentName },
            });
            if (!compartment)
                return;
            await (0, cabinet_service_1.updateCompartmentStatus)(compartment.id, parsed.lockStatus, parsed.doorStatus);
        }
        catch (error) {
            console.error('MQTT lock status handler failed:', error);
        }
    });
    (0, mqtt_1.subscribeMqtt)('smartbox/+/event/+', async (_topic, payload) => {
        try {
            const parsed = payload;
            if (parsed.event === 'opened' && parsed.rentalId) {
                await (0, rental_service_1.handleUnlock)(parsed.rentalId);
            }
        }
        catch (error) {
            console.error('MQTT event handler failed:', error);
        }
    });
    (0, mqtt_1.subscribeMqtt)('smartbox/+/heartbeat', async (topic) => {
        try {
            const [, cabinetId] = topic.split('/');
            await (0, cabinet_service_1.updateHeartbeat)(cabinetId);
        }
        catch (error) {
            console.error('MQTT heartbeat handler failed:', error);
        }
    });
}
function isLockStatus(value) {
    return typeof value === 'string' && Object.values(prisma_1.LockStatus).includes(value);
}
function isDoorStatus(value) {
    return typeof value === 'string' && Object.values(prisma_1.DoorStatus).includes(value);
}
//# sourceMappingURL=handlers.js.map