import { Router } from 'express';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';

const router = Router();

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ data: notifications });
  }),
);

router.put(
  '/read-all',
  requireUser,
  asyncHandler(async (req, res) => {
    const result = await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ data: { ok: true, count: result.count } });
  }),
);

router.put(
  '/:id/read',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw NotFoundError('Notification not found');
    if (existing.userId !== req.user!.id) throw NotFoundError('Notification not found');

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ data: notification });
  }),
);

export default router;
