import { Router } from 'express';
import { z } from 'zod';
import { CabinetStatus } from '../generated/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import {
  createCabinet,
  deleteCabinet,
  getCabinet,
  listCabinets,
  updateCabinet,
} from '../services/cabinet.service';
import { unlockCompartment } from '../services/locker.service';

const router = Router();

const cabinetCreateSchema = z.object({
  id: z.string().optional(),
  locationId: z.string().min(1),
  name: z.string().min(1),
  mcp23017Bus: z.number().int().optional(),
  mcp23017Address: z.number().int().optional(),
});

const cabinetUpdateSchema = cabinetCreateSchema.partial().extend({
  status: z.nativeEnum(CabinetStatus).optional(),
});

router.use(requireAdmin);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({ data: await listCabinets() });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json({ data: await getCabinet(req.params.id) });
  }),
);

router.post(
  '/',
  validate(cabinetCreateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await createCabinet(req.body);
    res.status(201).json({ data: cabinet });
  }),
);

router.put(
  '/:id',
  validate(cabinetUpdateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await updateCabinet(req.params.id, req.body);
    res.json({ data: cabinet });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteCabinet(req.params.id);
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/unlock/:compId',
  asyncHandler(async (req, res) => {
    await unlockCompartment(req.params.id, req.params.compId);
    res.json({ data: { ok: true } });
  }),
);

export default router;
