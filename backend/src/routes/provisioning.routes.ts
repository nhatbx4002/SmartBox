import { Router } from 'express';
import { z } from 'zod';
import { AuditAction } from '../generated/prisma';
import { AppError, ForbiddenError, UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';
import { ADMIN_ROLES, requireSuperAdmin } from '../middleware/auth';
import { requireCabinet } from '../middleware/cabinetAuth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../services/audit.service';
import {
  confirmCabinetConfig,
  getCabinetConfig,
  getProvisioningConfig,
  listProvisioningCabinets,
  registerCabinet,
  upsertProvisioningConfig,
} from '../services/provisioning.service';

const router = Router();

const registerSchema = z.object({
  provisionKey: z.string().min(1),
  provisionSecret: z.string().optional(),
  provisionCode: z.string().min(1).optional(),
  hardwareSerial: z.string().min(1),
  deviceName: z.string().min(1).optional(),
  discoveredMcpDevices: z.array(
    z.object({
      bus: z.number().int().min(0).default(1),
      address: z.number().int().min(0),
      name: z.string().optional(),
    }),
  ),
  firmwareVersion: z.string().optional(),
  piModel: z.string().optional(),
});

const confirmSchema = z.object({
  version: z.number().int().min(1),
});

const provisioningConfigSchema = z.object({
  strategy: z.string().min(1).optional(),
  provisionKey: z.string().min(1).optional(),
  provisionSecret: z.string().nullable().optional(),
  webhookUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await registerCabinet(req.body);
    res.status(201).json({ data: result });
  }),
);

router.get(
  '/config',
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    res.json({ data: await getProvisioningConfig() });
  }),
);

router.put(
  '/config',
  requireSuperAdmin,
  validate(provisioningConfigSchema),
  asyncHandler(async (req, res) => {
    const config = await upsertProvisioningConfig(req.body);
    if (req.admin) {
      await createAuditLog({
        adminId: req.admin.id,
        action: AuditAction.UPDATE_PROVISIONING_CONFIG,
        resource: 'ProvisioningConfig',
        resourceId: config.id,
        details: req.body,
        ipAddress: req.ip,
      });
    }
    res.json({ data: config });
  }),
);

router.get(
  '/cabinets',
  asyncHandler(async (req, res) => {
    const scope = resolveCabinetListScope(req);
    res.json({ data: await listProvisioningCabinets(scope) });
  }),
);

router.get(
  '/config/:cabinetId',
  requireCabinet,
  asyncHandler(async (req, res) => {
    assertCabinetParam(req);
    const version = req.query.version === undefined ? undefined : Number(req.query.version);
    res.json({ data: await getCabinetConfig(req.params.cabinetId, Number.isNaN(version) ? undefined : version) });
  }),
);

router.post(
  '/config/:cabinetId/confirm',
  requireCabinet,
  validate(confirmSchema),
  asyncHandler(async (req, res) => {
    assertCabinetParam(req);
    res.json({ data: await confirmCabinetConfig(req.params.cabinetId, req.body.version) });
  }),
);

function assertCabinetParam(req: { cabinet?: { id: string }; params: Record<string, string | undefined> }) {
  if (!req.params.cabinetId || req.cabinet?.id !== req.params.cabinetId) {
    throw ForbiddenError('Cabinet token does not match requested cabinet');
  }
}

function resolveCabinetListScope(req: {
  headers: { authorization?: string | string[] };
  query: Record<string, unknown>;
}) {
  const auth = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw UnauthorizedError('Missing token');
  }

  try {
    const payload = verifyToken(auth.slice(7), process.env.JWT_SECRET || '');
    const requestedCabinetId = typeof req.query.cabinetId === 'string' ? req.query.cabinetId : undefined;

    if (payload.type === 'CABINET') {
      const cabinetId = String(payload.sub || '');
      if (!cabinetId) throw UnauthorizedError('Invalid cabinet token');
      if (requestedCabinetId && requestedCabinetId !== cabinetId) {
        throw ForbiddenError('Cabinet token does not match requested cabinet');
      }
      return { cabinetId };
    }

    const role = String(payload.role || '');
    if (ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
      return { cabinetId: requestedCabinetId };
    }
  } catch (error) {
    if (error instanceof AppError && error.status === 403) {
      throw error;
    }
  }

  throw UnauthorizedError('Invalid token');
}

export default router;
