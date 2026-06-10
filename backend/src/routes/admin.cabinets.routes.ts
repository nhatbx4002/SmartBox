import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CabinetStatus, CompartmentSize } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../services/audit.service';
import {
  activateCabinet,
  createCabinet,
  deactivateCabinet,
  deleteCabinet,
  testOpenCompartment,
  updateCabinet,
} from '../services/cabinet.service';
import { createCompartment, deleteCompartment, updateCompartment } from '../services/compartment.service';
import { unlockCompartment } from '../services/locker.service';

const router = Router({ mergeParams: true });

const cabinetCreateSchema = z.object({
  locationId: z.string().min(1),
  deviceName: z.string().min(1),
  hardwareSerial: z.string().optional(),
  notes: z.string().optional(),
});

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
  rowIndex: z.number().int().min(0).optional(),
  colIndex: z.number().int().min(0).optional(),
  lockMcpDeviceId: z.string().nullable().optional(),
  sensorMcpDeviceId: z.string().nullable().optional(),
  mcp23017PinLock: z.number().int().min(0).max(15),
  mcp23017PinSensor: z.number().int().min(0).max(15).nullable().optional(),
});

const compartmentUpdateSchema = compartmentSchema.partial();

router.use(requireAdmin);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const cabinets = await prisma.cabinet.findMany({
      include: {
        location: true,
        mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
        compartments: {
          include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
          orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ data: cabinets });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const cabinet = await prisma.cabinet.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        mcpDevices: { orderBy: [{ bus: 'asc' }, { address: 'asc' }] },
        compartments: {
          include: { realtimeStatus: true, lockMcpDevice: true, sensorMcpDevice: true },
          orderBy: [{ rowIndex: 'asc' }, { colIndex: 'asc' }, { name: 'asc' }],
        },
      },
    });
    res.json({ data: cabinet });
  }),
);

router.post(
  '/',
  validate(cabinetCreateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await createCabinet({
      locationId: req.body.locationId,
      name: req.body.deviceName,
      hardwareSerial: req.body.hardwareSerial,
      notes: req.body.notes,
      status: CabinetStatus.DRAFT,
    });
    await audit(req, AuditAction.CREATE_CABINET, 'Cabinet', cabinet.id, req.body);
    res.status(201).json({ data: cabinet });
  }),
);

router.put(
  '/:id',
  validate(cabinetUpdateSchema),
  asyncHandler(async (req, res) => {
    const cabinet = await updateCabinet(req.params.id, req.body);
    await audit(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, req.body);
    res.json({ data: cabinet });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteCabinet(req.params.id);
    await audit(req, AuditAction.DELETE_CABINET, 'Cabinet', req.params.id, {});
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/compartments',
  validate(compartmentSchema),
  asyncHandler(async (req, res) => {
    const result = await createCompartment(req.params.id, req.body);
    await audit(req, AuditAction.UPDATE_CABINET, 'Compartment', result.compartment.id, req.body);
    res.status(201).json({ data: result });
  }),
);

router.put(
  '/:cabinetId/compartments/:compId',
  validate(compartmentUpdateSchema),
  asyncHandler(async (req, res) => {
    const result = await updateCompartment(req.params.compId, req.body);
    await audit(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, req.body);
    res.json({ data: result });
  }),
);

router.delete(
  '/:cabinetId/compartments/:compId',
  asyncHandler(async (req, res) => {
    const result = await deleteCompartment(req.params.compId);
    await audit(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, {});
    res.json({ data: result });
  }),
);

router.post(
  '/:id/unlock/:compId',
  asyncHandler(async (req, res) => {
    await unlockCompartment(req.params.id, req.params.compId);
    await audit(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, { compartmentId: req.params.compId });
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/:id/activate',
  asyncHandler(async (req, res) => {
    const cabinet = await activateCabinet(req.params.id);
    await audit(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
    res.json({ data: { cabinet, configVersion: cabinet.configVersion } });
  }),
);

router.post(
  '/:id/deactivate',
  asyncHandler(async (req, res) => {
    const cabinet = await deactivateCabinet(req.params.id);
    await audit(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
    res.json({ data: { cabinet } });
  }),
);

router.post(
  '/:id/compartments/:compId/test-open',
  asyncHandler(async (req, res) => {
    const result = await testOpenCompartment(req.params.id, req.params.compId);
    await audit(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, {
      compartmentId: req.params.compId,
      action: 'test-open',
    });
    res.json({ data: result });
  }),
);

async function audit(
  req: { admin?: { id: string }; ip?: string },
  action: AuditAction,
  resource: string,
  resourceId: string,
  details: object,
) {
  if (!req.admin) return;
  await createAuditLog({
    adminId: req.admin.id,
    action,
    resource,
    resourceId,
    details,
    ipAddress: req.ip,
  });
}

export default router;
