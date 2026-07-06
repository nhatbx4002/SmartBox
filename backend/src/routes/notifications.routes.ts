/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Admin - Notifications]
 *     summary: List all notifications
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: isRead
 *         in: query
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of notifications
 *
 * /api/notifications/read-all:
 *   put:
 *     tags: [Admin - Notifications]
 *     summary: Mark all notifications as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *
 * /api/notifications/{id}/read:
 *   put:
 *     tags: [Admin - Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated notification
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';
import * as notificationService from '../services/notification.services';

const router = Router();

const listQuerySchema = z.object({
    isRead: z.coerce.boolean().optional(),
});

router.get(
    '/',
    requireAdmin,
    validate(listQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
        const isRead = req.query.isRead !== undefined ? Boolean(req.query.isRead) : undefined;
        const notifications = await notificationService.adminListNotifications({ isRead });
        res.json({ data: notifications });
    }),
);

router.put(
    '/read-all',
    requireAdmin,
    asyncHandler(async (_req, res) => {
        const result = await notificationService.adminMarkAllRead();
        res.json({ data: result });
    }),
);

router.put(
    '/:id/read',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const notification = await notificationService.adminMarkNotificationRead(req.params.id);
        res.json({ data: notification });
    }),
);

export default router;
