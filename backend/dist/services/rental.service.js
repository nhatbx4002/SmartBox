"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRental = createRental;
exports.getByCode = getByCode;
exports.completeRental = completeRental;
exports.cancelRental = cancelRental;
exports.handleUnlock = handleUnlock;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const qr_1 = require("../lib/qr");
const prisma_2 = require("../lib/prisma");
const notification_service_1 = require("./notification.service");
const prisma_3 = require("../generated/prisma");
async function createRental(input) {
    const plan = await prisma_2.prisma.pricePlan.findFirst({
        where: { id: input.planId, size: input.size, isActive: true },
    });
    console.log(`[createRental] looking for plan id="${input.planId}" size=${input.size}:`, plan ? `found "${plan.name}"` : 'NOT FOUND');
    if (!plan) {
        // Debug: log all plans for this size
        const allPlans = await prisma_2.prisma.pricePlan.findMany({ where: { size: input.size, isActive: true }, select: { id: true, name: true } });
        console.log(`[createRental] available plans for size=${input.size}:`, allPlans);
        throw (0, errors_1.NotFoundError)(`Khong tim thay goi ${input.size === prisma_1.CompartmentSize.SMALL ? 'Size 1' : 'Size 2'} phu hop`);
    }
    const cabinetFilter = input.cabinetId ? { id: input.cabinetId } : {};
    const cabinet = await prisma_2.prisma.cabinet.findFirst({ where: cabinetFilter });
    if (!cabinet)
        throw (0, errors_1.NotFoundError)('Cabinet not found');
    if (cabinet.status !== prisma_1.CabinetStatus.ACTIVE) {
        throw (0, errors_1.BadRequestError)(`Cabinet "${cabinet.name}" hien dang ${cabinet.status.toLowerCase()}`);
    }
    // Debug: log all compartments for this cabinet
    const allCompartments = await prisma_2.prisma.compartment.findMany({
        where: { cabinetId: cabinet.id },
        select: { id: true, name: true, size: true, status: true },
    });
    console.log(`[createRental] cabinet="${cabinet.id}" size=${input.size} compartments:`, allCompartments);
    const compartment = await prisma_2.prisma.compartment.findFirst({
        where: {
            size: input.size,
            status: prisma_1.CompartmentAvailability.AVAILABLE,
            cabinet: {
                id: input.cabinetId ?? undefined,
                status: prisma_1.CabinetStatus.ACTIVE,
            },
        },
        include: { cabinet: true },
        orderBy: [{ cabinetId: 'asc' }, { name: 'asc' }],
    });
    if (!compartment) {
        throw (0, errors_1.BadRequestError)(`Khong con ngho trong — ngho "${cabinet.name}" da het cho ${input.size === prisma_1.CompartmentSize.SMALL ? 'Size 1' : 'Size 2'}`);
    }
    const code = await generateUniqueCode();
    const codeHash = await bcrypt_1.default.hash(code, 10);
    const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
    const qrToken = (0, qr_1.signQrToken)(`pending-${crypto_1.default.randomUUID()}`, expiresAt);
    const paymentMockEnabled = process.env.PAYMENT_MOCK_ENABLED !== 'false';
    const rental = await prisma_2.prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
            where: { phone: input.phone },
            update: {},
            create: { phone: input.phone },
        });
        const created = await tx.rental.create({
            data: {
                userId: user.id,
                compartmentId: compartment.id,
                pricePlanId: plan.id,
                code,
                codeHash,
                qrToken,
                maxOpens: plan.maxOpens ?? 999,
                expiresAt,
                paymentMethod: input.paymentMethod ?? prisma_1.PaymentMethod.NONE,
                paymentStatus: paymentMockEnabled ? prisma_1.PaymentStatus.PAID : prisma_1.PaymentStatus.PENDING,
                paidAt: paymentMockEnabled ? new Date() : null,
            },
            include: { compartment: { include: { cabinet: true } }, pricePlan: true, user: true },
        });
        await tx.compartment.update({
            where: { id: compartment.id },
            data: { status: prisma_1.CompartmentAvailability.OCCUPIED },
        });
        await tx.lockerLog.create({
            data: {
                cabinetId: compartment.cabinetId,
                compartmentId: compartment.id,
                rentalId: created.id,
                action: prisma_1.LockerAction.OPENED,
                success: true,
                note: 'Rental created',
            },
        });
        return created;
    });
    await prisma_2.prisma.rental.update({
        where: { id: rental.id },
        data: { qrToken: (0, qr_1.signQrToken)(rental.id, expiresAt) },
    });
    await (0, notification_service_1.createNotification)({
        userId: rental.userId,
        type: prisma_3.NotificationType.RENTAL_STARTED,
        title: 'Rental started',
        body: `Your rental code is ${code}.`,
        data: { rentalId: rental.id, compartmentId: rental.compartmentId },
    });
    return { rental: { ...rental, qrToken: (0, qr_1.signQrToken)(rental.id, expiresAt) }, code, compartment: rental.compartment };
}
async function getByCode(code) {
    const rental = await prisma_2.prisma.rental.findUnique({
        where: { code },
        include: { compartment: { include: { cabinet: true, realtimeStatus: true } }, pricePlan: true, user: true },
    });
    if (!rental)
        throw (0, errors_1.NotFoundError)('Rental not found');
    return rental;
}
async function completeRental(rentalId) {
    const rental = await prisma_2.prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental)
        throw (0, errors_1.NotFoundError)('Rental not found');
    return prisma_2.prisma.$transaction(async (tx) => {
        await tx.rental.update({ where: { id: rentalId }, data: { status: prisma_1.RentalStatus.COMPLETED } });
        await tx.compartment.update({
            where: { id: rental.compartmentId },
            data: { status: prisma_1.CompartmentAvailability.AVAILABLE },
        });
    });
}
async function cancelRental(rentalId, adminId) {
    const rental = await prisma_2.prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental)
        throw (0, errors_1.NotFoundError)('Rental not found');
    return prisma_2.prisma.$transaction(async (tx) => {
        await tx.rental.update({ where: { id: rentalId }, data: { status: prisma_1.RentalStatus.CANCELLED } });
        await tx.compartment.update({
            where: { id: rental.compartmentId },
            data: { status: prisma_1.CompartmentAvailability.AVAILABLE },
        });
        await tx.lockerLog.create({
            data: {
                compartmentId: rental.compartmentId,
                rentalId,
                action: prisma_1.LockerAction.DENIED,
                success: true,
                note: adminId ? `Cancelled by admin ${adminId}` : 'Cancelled',
            },
        });
    });
}
async function handleUnlock(rentalId) {
    const rental = await prisma_2.prisma.rental.findUnique({
        where: { id: rentalId },
        include: { compartment: true },
    });
    if (!rental)
        return;
    if (rental.status !== prisma_1.RentalStatus.ACTIVE)
        return;
    if (rental.openCount >= rental.maxOpens) {
        await completeRental(rentalId);
        return;
    }
    return prisma_2.prisma.rental.update({
        where: { id: rentalId },
        data: {
            openCount: { increment: 1 },
            logs: {
                create: {
                    cabinetId: rental.compartment.cabinetId,
                    compartmentId: rental.compartmentId,
                    action: prisma_1.LockerAction.OPENED,
                    success: true,
                },
            },
        },
    });
}
async function generateUniqueCode() {
    for (let i = 0; i < 10; i += 1) {
        const code = crypto_1.default.randomInt(0, 1_000_000).toString().padStart(6, '0');
        const existing = await prisma_2.prisma.rental.findUnique({ where: { code } });
        if (!existing)
            return code;
    }
    throw new Error('Unable to generate unique rental code');
}
//# sourceMappingURL=rental.service.js.map