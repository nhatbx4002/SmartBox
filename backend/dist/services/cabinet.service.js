"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCabinets = listCabinets;
exports.getCabinet = getCabinet;
exports.createCabinet = createCabinet;
exports.updateCabinet = updateCabinet;
exports.deleteCabinet = deleteCabinet;
exports.updateCompartmentStatus = updateCompartmentStatus;
exports.updateHeartbeat = updateHeartbeat;
exports.getAvailableCompartments = getAvailableCompartments;
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const socket_1 = require("../lib/socket");
const prisma_2 = require("../lib/prisma");
async function listCabinets() {
    return prisma_2.prisma.cabinet.findMany({
        include: { location: true, compartments: { include: { realtimeStatus: true } } },
        orderBy: { createdAt: 'asc' },
    });
}
async function getCabinet(id) {
    const cabinet = await prisma_2.prisma.cabinet.findUnique({
        where: { id },
        include: { location: true, compartments: { include: { realtimeStatus: true } } },
    });
    if (!cabinet)
        throw (0, errors_1.NotFoundError)('Cabinet not found');
    return cabinet;
}
async function createCabinet(input) {
    return prisma_2.prisma.cabinet.create({ data: input });
}
async function updateCabinet(id, input) {
    await getCabinet(id);
    return prisma_2.prisma.cabinet.update({ where: { id }, data: input });
}
async function deleteCabinet(id) {
    await getCabinet(id);
    return prisma_2.prisma.cabinet.delete({ where: { id } });
}
async function updateCompartmentStatus(compartmentId, lockStatus, doorStatus) {
    const compartment = await prisma_2.prisma.compartment.findUnique({
        where: { id: compartmentId },
        include: { cabinet: true },
    });
    if (!compartment)
        throw (0, errors_1.NotFoundError)('Compartment not found');
    const status = await prisma_2.prisma.compartmentStatus.upsert({
        where: { compartmentId },
        update: { lockStatus, doorStatus, lastUpdatedAt: new Date() },
        create: { compartmentId, lockStatus, doorStatus },
    });
    (0, socket_1.emitCompartmentStatus)(compartment.cabinetId, compartment.id, status);
    return status;
}
async function updateHeartbeat(cabinetId) {
    const cabinet = await prisma_2.prisma.cabinet.update({
        where: { id: cabinetId },
        data: { lastHeartbeatAt: new Date(), status: prisma_1.CabinetStatus.ACTIVE },
    });
    await prisma_2.prisma.lockerLog.create({
        data: { cabinetId, action: prisma_1.LockerAction.HEARTBEAT, success: true },
    });
    (0, socket_1.emitCabinetStatus)(cabinetId, { status: cabinet.status, lastHeartbeatAt: cabinet.lastHeartbeatAt });
    return cabinet;
}
async function getAvailableCompartments(size) {
    return prisma_2.prisma.compartment.findMany({
        where: {
            status: prisma_1.CompartmentAvailability.AVAILABLE,
            ...(size ? { size } : {}),
            cabinet: { status: prisma_1.CabinetStatus.ACTIVE },
        },
        include: { cabinet: { include: { location: true } }, realtimeStatus: true },
        orderBy: [{ cabinetId: 'asc' }, { name: 'asc' }],
    });
}
//# sourceMappingURL=cabinet.service.js.map