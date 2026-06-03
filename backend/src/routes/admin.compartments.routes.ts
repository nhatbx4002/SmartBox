import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CompartmentSize } from '../generated/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../services/audit.service';
import { deleteCompartment, updateCompartment } from '../services/compartment.service';

const router = Router();

const compartmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.nativeEnum(CompartmentSize).optional(),
  rowIndex: z.number().int().min(0).optional(),
  colIndex: z.number().int().min(0).optional(),
  lockMcpDeviceId: z.string().nullable().optional(),
  sensorMcpDeviceId: z.string().nullable().optional(),
  mcp23017PinLock: z.number().int().min(0).optional(),
  mcp23017PinSensor: z.number().int().min(0).optional(),
});

router.use(requireAdmin);

router.put(
  '/:id',
  validate(compartmentUpdateSchema),
  asyncHandler(async (req, res) => {
    const result = await updateCompartment(req.params.id, req.body);
    await audit(req, req.params.id, req.body);
    res.json({ data: result });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await deleteCompartment(req.params.id);
    await audit(req, req.params.id, {});
    res.json({ data: result });
  }),
);

async function audit(req: { admin?: { id: string }; ip?: string }, resourceId: string, details: object) {
  if (!req.admin) return;
  await createAuditLog({
    adminId: req.admin.id,
    action: AuditAction.UPDATE_CABINET,
    resource: 'Compartment',
    resourceId,
    details,
    ipAddress: req.ip,
  });
}

export default router;
