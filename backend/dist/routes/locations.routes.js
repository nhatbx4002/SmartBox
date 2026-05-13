"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const prisma_2 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const locations = await prisma_2.prisma.location.findMany({
        where: { status: prisma_1.LocationStatus.ACTIVE },
        orderBy: { name: 'asc' },
    });
    res.json({ data: locations });
}));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const location = await prisma_2.prisma.location.findUnique({ where: { id: req.params.id } });
    if (!location)
        throw (0, errors_1.NotFoundError)('Location not found');
    res.json({ data: location });
}));
router.get('/:id/cabinets', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cabinets = await prisma_2.prisma.cabinet.findMany({
        where: { locationId: req.params.id },
        include: { compartments: { include: { realtimeStatus: true } } },
        orderBy: { name: 'asc' },
    });
    res.json({ data: cabinets });
}));
exports.default = router;
//# sourceMappingURL=locations.routes.js.map