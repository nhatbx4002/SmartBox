import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get(
  '/cabinets',
  asyncHandler(async (req, res) => {
    const cabinetId = req.query.cabinetId?.toString();
    const cabinets = await prisma.cabinet.findMany({
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
  }),
);

export default router;
