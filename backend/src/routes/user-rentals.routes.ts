import { Router } from 'express';
import { RentalStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { completeRental, handleUnlock } from '../services/rental.service';

const router = Router();

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.min(50, Number(req.query.limit ?? 20) || 20);
    const status = req.query.status?.toString();

    const where = {
      userId: req.user!.id,
      ...(status ? { status: status as RentalStatus } : {}),
    };

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where,
        include: {
          compartment: { include: { cabinet: true } },
          pricePlan: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental.count({ where }),
    ]);

    res.json({
      data: rentals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }),
);

router.get(
  '/:id',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        compartment: { include: { cabinet: true } },
        pricePlan: true,
        logs: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!rental) throw NotFoundError('Rental not found');
    res.json({ data: rental });
  }),
);

router.post(
  '/:id/unlock',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!rental) throw NotFoundError('Rental not found');
    if (rental.status !== RentalStatus.ACTIVE) {
      throw BadRequestError(`Cannot unlock rental with status: ${rental.status}`);
    }

    const updated = await handleUnlock(req.params.id);
    if (!updated) throw NotFoundError('Rental not found');
    res.json({ data: updated });
  }),
);

router.post(
  '/:id/complete',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!rental) throw NotFoundError('Rental not found');

    await completeRental(req.params.id);
    res.json({ data: { ok: true } });
  }),
);

export default router;
