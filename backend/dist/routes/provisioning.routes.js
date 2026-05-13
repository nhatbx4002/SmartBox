"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.get('/cabinets', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cabinetId = req.query.cabinetId?.toString();
    const cabinets = await prisma_1.prisma.cabinet.findMany({
        where: cabinetId ? { id: cabinetId } : {},
        include: {
            compartments: {
                include: { realtimeStatus: true },
                orderBy: { name: 'asc' },
            },
        },
        orderBy: { id: 'asc' },
    });
    res.json({ data: cabinets });
}));
exports.default = router;
//# sourceMappingURL=provisioning.routes.js.map