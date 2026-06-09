import { Router } from 'express';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAdmin } from '../middleware/auth';
import { listNotifications } from '../services/notification.service';

const router = Router();

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const isReadRaw = req.query.isRead?.toString();
    const notifications = await listNotifications({
      userId,
      isRead: isReadRaw === undefined ? undefined : isReadRaw === 'true',
    });
    res.json({ data: notifications });
  }),
);

router.put(
  '/read-all',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const result = await prisma.notification.updateMany({
      where: {
        ...(userId ? { userId } : {}),
        isRead: false,
      },
      data: { isRead: true },
    });
    res.json({ data: { ok: true, count: result.count } });
  }),
);

router.put(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const existing = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!existing) throw NotFoundError('Notification not found');
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ data: notification });
  }),
);

export default router;
