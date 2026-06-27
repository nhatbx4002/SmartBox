import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CabinetStatus, CompartmentSize } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireCabinetAccess } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { auditFromRequest } from '../services/audit.service';
import {
  activateCabinet,
  deactivateCabinet,
  deleteCabinet,
  testOpenCompartment,
  updateCabinet,
} from '../services/cabinet.service';
import { createCompartment, deleteCompartment, updateCompartment } from '../services/compartment.service';
import { unlockCompartment } from '../services/locker.service';

const router = Router({ mergeParams: true });

const cabinetUpdateSchema = z.object({
  locationId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  hardwareSerial: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.nativeEnum(CabinetStatus).optional(),
});

const compartmentSchema = z.object({
  name: z.string().min(1),
  size: z.nativeEnum(CompartmentSize),
  lockMcpDeviceId: z.string().min(1),
  sensorMcpDeviceId: z.string().nullable().optional(),
  mcp23017PinLock: z.number().int().min(0).max(15),
  mcp23017PinSensor: z.number().int().min(0).max(15).nullable().optional(),
});

const compartmentUpdateSchema = compartmentSchema.partial();

router.use(requireAdmin);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const where = req.admin!.role === 'SUPER_ADMIN'
      ? {}
      : { adminAssignments: { some: { adminId: req.admin!.id } } };
    const cabinets = await prisma.cabinet.findMany({
      where,
      include: {
        location: true,
        mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
        compartments: {
          include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ data: cabinets });
  }),
);

router.get(
  '/:id',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    const cabinet = await prisma.cabinet.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
        compartments: {
          include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
          orderBy: { name: 'asc' },
        },
      },
    });
    res.json({ data: cabinet });
  }),
);

router.put(
  '/:id',
  requireCabinetAccess,
  validate(cabinetUpdateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await updateCabinet(req.params.id, req.body);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, req.body);
    res.json({ data: cabinet });
  }),
);

router.delete(
  '/:id',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    await deleteCabinet(req.params.id);
    await auditFromRequest(req, AuditAction.DELETE_CABINET, 'Cabinet', req.params.id, {});
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/compartments',
  requireCabinetAccess,
  validate(compartmentSchema),
  asyncHandler(async (req, res) => {
    const result = await createCompartment(req.params.id, req.body);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', result.compartment.id, req.body);
    res.status(201).json({ data: result });
  }),
);

router.put(
  '/:cabinetId/compartments/:compId',
  requireCabinetAccess,
  validate(compartmentUpdateSchema),
  asyncHandler(async (req, res) => {
    const result = await updateCompartment(req.params.compId, req.body);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, req.body);
    res.json({ data: result });
  }),
);

router.delete(
  '/:cabinetId/compartments/:compId',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    const result = await deleteCompartment(req.params.compId);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, {});
    res.json({ data: result });
  }),
);

router.post(
  '/:id/unlock/:compId',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    await unlockCompartment(req.params.id, req.params.compId);
    await auditFromRequest(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, { compartmentId: req.params.compId });
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/activate',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    const cabinet = await activateCabinet(req.params.id);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
    res.json({ data: { cabinet, configVersion: cabinet.configVersion } });
  }),
);

router.post(
  '/:id/deactivate',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    const cabinet = await deactivateCabinet(req.params.id);
    await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
    res.json({ data: { cabinet } });
  }),
);

router.post(
  '/:id/compartments/:compId/test-open',
  requireCabinetAccess,
  asyncHandler(async (req, res) => {
    const result = await testOpenCompartment(req.params.id, req.params.compId);
    await auditFromRequest(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, {
      compartmentId: req.params.compId,
      action: 'test-open',
    });
    res.json({ data: result });
  }),
);

export default router;
