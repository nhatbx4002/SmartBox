"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.listNotifications = listNotifications;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.sendRentalExpired = sendRentalExpired;
exports.sendCabinetOffline = sendCabinetOffline;
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../lib/prisma");
async function createNotification(input) {
    return prisma_2.prisma.notification.create({
        data: {
            userId: input.userId ?? null,
            type: input.type,
            title: input.title,
            body: input.body,
            data: input.data ?? prisma_1.Prisma.JsonNull,
        },
    });
}
async function listNotifications(filters) {
    return prisma_2.prisma.notification.findMany({
        where: {
            ...(filters.userId ? { userId: filters.userId } : {}),
            ...(filters.isRead === undefined ? {} : { isRead: filters.isRead }),
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function markAllNotificationsRead() {
    const result = await prisma_2.prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
    });
    return { ok: true, count: result.count };
}
async function sendRentalExpired(rentalId) {
    const rental = await prisma_2.prisma.rental.findUnique({
        where: { id: rentalId },
        include: { user: true, compartment: { include: { cabinet: true } } },
    });
    if (!rental)
        return;
    await createNotification({
        userId: rental.userId,
        type: prisma_1.NotificationType.RENTAL_EXPIRED,
        title: 'Rental expired',
        body: `Rental ${rental.code} has expired.`,
        data: { rentalId, compartmentId: rental.compartmentId, cabinetId: rental.compartment.cabinetId },
    });
}
async function sendCabinetOffline(cabinetId) {
    const cabinet = await prisma_2.prisma.cabinet.findUnique({ where: { id: cabinetId } });
    if (!cabinet)
        return;
    await createNotification({
        type: prisma_1.NotificationType.CABINET_OFFLINE,
        title: 'Cabinet offline',
        body: `${cabinet.name} is offline.`,
        data: { cabinetId },
    });
}
//# sourceMappingURL=notification.service.js.map