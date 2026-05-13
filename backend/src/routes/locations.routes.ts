import { Router } from 'express';
import { LocationStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const locations = await prisma.location.findMany({
      where: { status: LocationStatus.ACTIVE },
      orderBy: { name: 'asc' },
    });
    res.json({ data: locations });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const location = await prisma.location.findUnique({ where: { id: req.params.id } });
    if (!location) throw NotFoundError('Location not found');
    res.json({ data: location });
  }),
);

router.get(
  '/:id/cabinets',
  asyncHandler(async (req, res) => {
    const cabinets = await prisma.cabinet.findMany({
      where: { locationId: req.params.id },
      include: { compartments: { include: { realtimeStatus: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ data: cabinets });
  }),
);

export default router;
