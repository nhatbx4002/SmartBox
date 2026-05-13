"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const prisma_2 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const cabinet_service_1 = require("../services/cabinet.service");
const router = (0, express_1.Router)();
router.get('/available', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rawSize = req.query.size?.toString();
    const size = rawSize ? parseCompartmentSize(rawSize) : undefined;
    const compartments = await (0, cabinet_service_1.getAvailableCompartments)(size);
    res.json({ data: compartments });
}));
router.get('/plans', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rawSize = req.query.size?.toString();
    const size = rawSize ? parseCompartmentSize(rawSize) : undefined;
    const plans = await prisma_2.prisma.pricePlan.findMany({
        where: { isActive: true, ...(size ? { size } : {}) },
        orderBy: [{ size: 'asc' }, { price: 'asc' }],
    });
    res.json({ data: plans });
}));
function parseCompartmentSize(size) {
    if (size !== prisma_1.CompartmentSize.SMALL && size !== prisma_1.CompartmentSize.LARGE) {
        throw (0, errors_1.BadRequestError)('Invalid compartment size');
    }
    return size;
}
exports.default = router;
//# sourceMappingURL=lockers.routes.js.map