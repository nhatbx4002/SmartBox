import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CompartmentSize } from '../generated/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { createAuditLog } from '../services/audit.service';
import { createCompartment, deleteCompartment, updateCompartment } from '../services/compartment.service';
import { testOpenCompartment } from '../services/cabinet.service';

const router = Router();

const compartmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.nativeEnum(CompartmentSize).optional(),
  rowIndex: z.number().int().min(0).optional(),
  colIndex: z.number().int().min(0).optional(),
  lockMcpDeviceId: z.string().nullable().optional(),
  sensorMcpDeviceId: z.string().nullable().optional(),
  mcp23017PinLock: z.number().int().min(0).max(15).optional(),
  mcp23017PinSensor: z.number().int().min(0).max(15).nullable().optional(),
});

const compartmentCreateSchema = z.object({
  cabinetId: z.string().min(1),
  name: z.string().min(1),
  size: z.nativeEnum(CompartmentSize),
  rowIndex: z.number().int().min(0).optional(),
  colIndex: z.number().int().min(0).optional(),
  lockMcpDeviceId: z.string().min(1),
  sensorMcpDeviceId: z.string().nullable().optional(),
  mcp23017PinLock: z.number().int().min(0).max(15),
  mcp23017PinSensor: z.number().int().min(0).max(15).nullable().optional(),
});

router.use(requireAdmin);

router.post(
  '/',
  validate(compartmentCreateSchema),
  asyncHandler(async (req, res) => {
    const { cabinetId, ...input } = req.body;
    const result = await createCompartment(cabinetId, input);
    await audit(req, result.compartment.id, req.body);
    res.status(201).json({ data: result });
  }),
);

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

router.post(
  '/:id/test-open',
  asyncHandler(async (req, res) => {
    const compartment = await prisma.compartment.findUnique({ where: { id: req.params.id } });
    if (!compartment) throw NotFoundError('Compartment not found');
    const result = await testOpenCompartment(compartment.cabinetId, req.params.id);
    await audit(req, req.params.id, { action: 'test-open', cabinetId: compartment.cabinetId });
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
