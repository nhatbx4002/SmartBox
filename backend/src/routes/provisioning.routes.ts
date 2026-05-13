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
        mcpDevices: {
          orderBy: [{ bus: 'asc' }, { address: 'asc' }],
        },
        compartments: {
          include: {
            realtimeStatus: true,
            lockMcpDevice: true,
            sensorMcpDevice: true,
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    res.json({ data: cabinets });
  }),
);

export default router;
