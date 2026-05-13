"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const errors_1 = require("../lib/errors");
const prisma_1 = require("../lib/prisma");
const rental_service_1 = require("../services/rental.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = req.query.status?.toString();
    const rentals = await prisma_1.prisma.rental.findMany({
        where: status ? { status: status } : undefined,
        include: { user: true, compartment: { include: { cabinet: true } }, pricePlan: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json({ data: rentals });
}));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rental = await prisma_1.prisma.rental.findUnique({
        where: { id: req.params.id },
        include: { user: true, compartment: { include: { cabinet: true } }, pricePlan: true, logs: true },
    });
    if (!rental)
        throw (0, errors_1.NotFoundError)('Rental not found');
    res.json({ data: rental });
}));
router.put('/:id/cancel', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, rental_service_1.cancelRental)(req.params.id, req.admin?.id);
    res.json({ data: { ok: true } });
}));
exports.default = router;
//# sourceMappingURL=rentals.admin.routes.js.map