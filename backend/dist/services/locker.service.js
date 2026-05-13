"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockCompartment = unlockCompartment;
exports.lockCompartment = lockCompartment;
const prisma_1 = require("../generated/prisma");
const mqtt_1 = require("../lib/mqtt");
const prisma_2 = require("../lib/prisma");
async function unlockCompartment(cabinetId, compartmentIdOrName, rentalId) {
    const compartment = await findCompartment(cabinetId, compartmentIdOrName);
    const topicName = compartment?.name ?? compartmentIdOrName;
    (0, mqtt_1.publishMqtt)(`smartbox/${cabinetId}/lock/${topicName}/unlock`, {
        action: 'unlock',
        cabinetId,
        compartmentId: compartment?.id ?? compartmentIdOrName,
        compartmentName: topicName,
        rentalId,
        timestamp: new Date().toISOString(),
    });
    await prisma_2.prisma.lockerLog.create({
        data: {
            cabinetId,
            compartmentId: compartment?.id,
            rentalId,
            action: prisma_1.LockerAction.OPENED,
            success: true,
            note: 'Unlock command published',
        },
    });
}
async function lockCompartment(cabinetId, compartmentIdOrName) {
    const compartment = await findCompartment(cabinetId, compartmentIdOrName);
    const topicName = compartment?.name ?? compartmentIdOrName;
    (0, mqtt_1.publishMqtt)(`smartbox/${cabinetId}/lock/${topicName}/lock`, {
        action: 'lock',
        cabinetId,
        compartmentId: compartment?.id ?? compartmentIdOrName,
        compartmentName: topicName,
        timestamp: new Date().toISOString(),
    });
}
async function findCompartment(cabinetId, compartmentIdOrName) {
    return prisma_2.prisma.compartment.findFirst({
        where: {
            cabinetId,
            OR: [{ id: compartmentIdOrName }, { name: compartmentIdOrName }],
        },
    });
}
//# sourceMappingURL=locker.service.js.map