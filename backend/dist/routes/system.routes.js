"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const prisma_2 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const cabinet_service_1 = require("../services/cabinet.service");
const rental_service_1 = require("../services/rental.service");
const router = (0, express_1.Router)();
const heartbeatSchema = zod_1.z.object({
    cabinetId: zod_1.z.string().min(1),
});
const lockerEventSchema = zod_1.z.object({
    cabinetId: zod_1.z.string().min(1),
    compartmentId: zod_1.z.string().min(1).optional(),
    compartmentName: zod_1.z.string().min(1).optional(),
    rentalId: zod_1.z.string().min(1).optional(),
    event: zod_1.z.string().min(1).optional(),
    lockStatus: zod_1.z.nativeEnum(prisma_1.LockStatus).optional(),
    doorStatus: zod_1.z.nativeEnum(prisma_1.DoorStatus).optional(),
});
router.post('/heartbeat', (0, validate_1.validate)(heartbeatSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cabinet = await (0, cabinet_service_1.updateHeartbeat)(req.body.cabinetId);
    res.json({ data: cabinet });
}));
router.post('/locker-event', (0, validate_1.validate)(lockerEventSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const compartmentId = await resolveCompartmentId(req.body.cabinetId, req.body.compartmentId, req.body.compartmentName);
    if (compartmentId && req.body.lockStatus && req.body.doorStatus) {
        await (0, cabinet_service_1.updateCompartmentStatus)(compartmentId, req.body.lockStatus, req.body.doorStatus);
    }
    if (req.body.rentalId && req.body.event === 'opened') {
        await (0, rental_service_1.handleUnlock)(req.body.rentalId);
    }
    res.json({ data: { ok: true } });
}));
router.get('/status', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [cabinets, activeRentals, availableCompartments] = await Promise.all([
        prisma_2.prisma.cabinet.count(),
        prisma_2.prisma.rental.count({ where: { status: 'ACTIVE' } }),
        prisma_2.prisma.compartment.count({ where: { status: 'AVAILABLE' } }),
    ]);
    res.json({
        data: {
            status: 'ok',
            cabinets,
            activeRentals,
            availableCompartments,
            timestamp: new Date().toISOString(),
        },
    });
}));
async function resolveCompartmentId(cabinetId, compartmentId, compartmentName) {
    if (compartmentId)
        return compartmentId;
    if (!compartmentName)
        return undefined;
    const compartment = await prisma_2.prisma.compartment.findFirst({
        where: { cabinetId, name: compartmentName },
    });
    if (!compartment)
        throw (0, errors_1.BadRequestError)('Compartment not found');
    return compartment.id;
}
exports.default = router;
//# sourceMappingURL=system.routes.js.map