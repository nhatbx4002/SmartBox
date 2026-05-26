import { Router } from 'express';
import { AuditAction } from '../generated/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { createAuditLog } from '../services/audit.service';
import { cancelRental } from '../services/rental.service';

const router = Router();

router.use(requireAdmin);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const status = req.query.status?.toString();
    const rentals = await prisma.rental.findMany({
      where: status ? { status: status as never } : undefined,
      include: { user: true, compartment: { include: { cabinet: true } }, pricePlan: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: rentals });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findUnique({
      where: { id: req.params.id },
      include: { user: true, compartment: { include: { cabinet: true } }, pricePlan: true, logs: true },
    });
    if (!rental) throw NotFoundError('Rental not found');
    res.json({ data: rental });
  }),
);

router.put(
  '/:id/cancel',
  asyncHandler(async (req, res) => {
    await cancelRental(req.params.id, req.admin?.id);
    if (req.admin) {
      await createAuditLog({
        adminId: req.admin.id,
        action: AuditAction.CANCEL_RENTAL,
        resource: 'Rental',
        resourceId: req.params.id,
        details: {},
        ipAddress: req.ip,
      });
    }
    res.json({ data: { ok: true } });
  }),
);

export default router;
