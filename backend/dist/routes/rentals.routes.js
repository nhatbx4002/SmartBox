"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const auth_service_1 = require("../services/auth.service");
const rental_service_1 = require("../services/rental.service");
const router = (0, express_1.Router)();
const createRentalSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^\+?[0-9]{10,11}$/),
    size: zod_1.z.nativeEnum(prisma_1.CompartmentSize),
    planId: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.nativeEnum(prisma_1.PaymentMethod).optional(),
    cabinetId: zod_1.z.string().min(1).optional(),
});
const verifyPinSchema = zod_1.z.object({
    code: zod_1.z.string().length(6).regex(/^\d+$/),
    mode: zod_1.z.enum(['deposit', 'pickup']).optional().nullable(),
});
router.post('/verify-pin', (0, validate_1.validate)(verifyPinSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.verifyPin)(req.body.code);
    res.json({
        data: {
            id: result.rental.id,
            rentalId: result.rental.id,
            pin: result.rental.code,
            compartmentId: result.compartment.id,
            compartmentName: result.compartment.name,
            lockerName: result.compartment.cabinet.name,
            size: result.compartment.size,
            expiresAt: result.rental.expiresAt,
            qrData: result.rental.qrToken,
        },
    });
}));
router.post('/', (0, validate_1.validate)(createRentalSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, rental_service_1.createRental)(req.body);
    res.status(201).json({ data: result });
}));
router.get('/:code', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rental = await (0, rental_service_1.getByCode)(req.params.code);
    res.json({ data: rental });
}));
router.post('/:id/unlock', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rental = await (0, rental_service_1.handleUnlock)(req.params.id);
    res.json({ data: rental });
}));
router.post('/:id/complete', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, rental_service_1.completeRental)(req.params.id);
    res.json({ data: { ok: true } });
}));
exports.default = router;
//# sourceMappingURL=rentals.routes.js.map