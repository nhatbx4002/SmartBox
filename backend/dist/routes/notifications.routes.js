"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = require("../lib/errors");
const prisma_1 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.query.userId?.toString();
    const notifications = await prisma_1.prisma.notification.findMany({
        where: userId ? { userId } : undefined,
        orderBy: { createdAt: 'desc' },
    });
    res.json({ data: notifications });
}));
router.put('/:id/read', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await prisma_1.prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw (0, errors_1.NotFoundError)('Notification not found');
    const notification = await prisma_1.prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true },
    });
    res.json({ data: notification });
}));
exports.default = router;
//# sourceMappingURL=notifications.routes.js.map