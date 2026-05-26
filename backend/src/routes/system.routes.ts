import { Router } from 'express';
import { z } from 'zod';
import { DoorStatus, LockStatus } from '../generated/prisma';
import { BadRequestError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { updateCompartmentStatus, updateHeartbeat } from '../services/cabinet.service';
import { handleUnlock } from '../services/rental.service';

const router = Router();

const heartbeatSchema = z.object({
  cabinetId: z.string().min(1),
});

const lockerEventSchema = z.object({
  cabinetId: z.string().min(1),
  compartmentId: z.string().min(1).optional(),
  compartmentName: z.string().min(1).optional(),
  rentalId: z.string().min(1).optional(),
  event: z.string().min(1).optional(),
  lockStatus: z.nativeEnum(LockStatus).optional(),
  doorStatus: z.nativeEnum(DoorStatus).optional(),
});

router.post(
  '/heartbeat',
  validate(heartbeatSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await updateHeartbeat(req.body.cabinetId);
    res.json({ data: cabinet });
  }),
);

router.post(
  '/locker-event',
  validate(lockerEventSchema),
  asyncHandler(async (req, res) => {
    const compartmentId = await resolveCompartmentId(req.body.cabinetId, req.body.compartmentId, req.body.compartmentName);
    if (compartmentId && req.body.lockStatus && req.body.doorStatus) {
      await updateCompartmentStatus(compartmentId, req.body.lockStatus, req.body.doorStatus);
    }
    if (req.body.rentalId && req.body.event === 'opened') {
      await handleUnlock(req.body.rentalId);
    }
    res.json({ data: { ok: true } });
  }),
);

router.get(
  '/status',
  asyncHandler(async (_req, res) => {
    const [cabinets, activeRentals, availableCompartments] = await Promise.all([
      prisma.cabinet.count(),
      prisma.rental.count({ where: { status: 'ACTIVE' } }),
      prisma.compartment.count({ where: { status: 'AVAILABLE' } }),
    ]);

    res.json({
      data: {
        status: 'ok',
        cabinets,
        activeRentals,
        availableCompartments,
        timestamp: new Date().toISOString(),
      },
    });
  }),
);

async function resolveCompartmentId(cabinetId: string, compartmentId?: string, compartmentName?: string) {
  if (compartmentId) return compartmentId;
  if (!compartmentName) return undefined;

  const compartment = await prisma.compartment.findFirst({
    where: { cabinetId, name: compartmentName },
  });
  if (!compartment) throw BadRequestError('Compartment not found');
  return compartment.id;
}

export default router;
