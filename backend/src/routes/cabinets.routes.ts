import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CabinetStatus } from '../generated/prisma';
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
import { createAuditLog } from '../services/audit.service';
import { unlockCompartment } from '../services/locker.service';

const router = Router();

const cabinetCreateSchema = z.object({
  id: z.string().optional(),
  locationId: z.string().min(1),
  name: z.string().min(1),
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
    await auditCabinet(req, AuditAction.CREATE_CABINET, cabinet.id, req.body);
    res.status(201).json({ data: cabinet });
  }),
);

router.put(
  '/:id',
  validate(cabinetUpdateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await updateCabinet(req.params.id, req.body);
    await auditCabinet(req, AuditAction.UPDATE_CABINET, cabinet.id, req.body);
    res.json({ data: cabinet });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteCabinet(req.params.id);
    await auditCabinet(req, AuditAction.DELETE_CABINET, req.params.id, {});
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/unlock/:compId',
  asyncHandler(async (req, res) => {
    await unlockCompartment(req.params.id, req.params.compId);
    await auditCabinet(req, AuditAction.UNLOCK_COMPARTMENT, req.params.id, { compartmentId: req.params.compId });
    res.json({ data: { ok: true } });
  }),
);

async function auditCabinet(
  req: { admin?: { id: string }; ip?: string },
  action: AuditAction,
  resourceId: string,
  details: object,
) {
  if (!req.admin) return;
  await createAuditLog({
    adminId: req.admin.id,
    action,
    resource: 'Cabinet',
    resourceId,
    details,
    ipAddress: req.ip,
  });
}

export default router;
