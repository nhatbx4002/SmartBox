"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = require("../lib/errors");
const prisma_1 = require("../lib/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const notification_service_1 = require("../services/notification.service");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.query.userId?.toString();
    const isReadRaw = req.query.isRead?.toString();
    const notifications = await (0, notification_service_1.listNotifications)({
        userId,
        isRead: isReadRaw === undefined ? undefined : isReadRaw === 'true',
    });
    res.json({ data: notifications });
}));
router.put('/read-all', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json({ data: await (0, notification_service_1.markAllNotificationsRead)() });
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