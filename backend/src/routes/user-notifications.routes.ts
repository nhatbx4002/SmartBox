/**
 * @openapi
 * /api/users/me/notifications:
 *   get:
 *     tags: [User - Notifications]
 *     summary: List all notifications for current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of notifications
 *
 * /api/users/me/notifications/read-all:
 *   put:
 *     tags: [User - Notifications]
 *     summary: Mark all notifications as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *
 * /api/users/me/notifications/{id}/read:
 *   put:
 *     tags: [User - Notifications]
 *     summary: Mark a single notification as read
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
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/auth';
import * as notificationService from '../services/notification.services';

const router = Router();

router.get(
    '/',
    requireUser,
    asyncHandler(async (req, res) => {
        const notifications = await notificationService.listUserNotifications(req.user!.id);
        res.json({ data: notifications });
    })
);

router.put(
    '/read-all',
    requireUser,
    asyncHandler(async (req, res) => {
        const result = await notificationService.markAllNotificationsRead(req.user!.id);
        res.json({ data: result });
    })
);

router.put(
    '/:id/read',
    requireUser,
    asyncHandler(async (req, res) => {
        const notification = await notificationService.markNotificationRead(req.params.id);
        res.json({ data: notification });
    })
);

export default router;
