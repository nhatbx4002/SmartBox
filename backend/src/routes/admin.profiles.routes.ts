import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CompartmentSize } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../services/audit.service';
import { createProfile, deleteProfile, getProfileById, getProfiles, updateProfile } from '../services/profile.service';

const router = Router();

const mcpDeviceSchema = z.object({
  bus: z.number().int().min(0),
  address: z.number().int().min(0),
  role: z.enum(['SENSOR', 'LOCK']),
  name: z.string().optional(),
});

const createProfileSchema = z.object({
  name: z.string().min(1),
  provisionKey: z.string().min(1),
  provisionSecret: z.string().min(1).nullable().optional(),
  mode: z.enum(['CHECK_EXISTING', 'ALLOW_NEW']),
  templateRows: z.number().int().positive(),
  templateCols: z.number().int().positive(),
  templateSizes: z.array(z.array(z.nativeEnum(CompartmentSize))),
  mcpDevices: z.array(mcpDeviceSchema),
});

const updateProfileSchema = createProfileSchema.partial().extend({
  provisionSecret: z.string().min(1).nullable().optional(),
  isActive: z.boolean().optional(),
});

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json({ data: await getProfiles() });
  }),
);

router.get(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const profile = await getProfileById(req.params.id);
    if (!profile) throw NotFoundError('Profile not found');
    res.json({ data: profile });
  }),
);

router.post(
  '/',
  requireSuperAdmin,
  validate(createProfileSchema),
  asyncHandler(async (req, res) => {
    const profile = await createProfile(req.body);
    await audit(req, AuditAction.CREATE_PROVISION_PROFILE, profile.id, req.body);
    res.status(201).json({ data: profile });
  }),
);

router.put(
  '/:id',
  requireSuperAdmin,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const profile = await updateProfile(req.params.id, req.body);
    await audit(req, AuditAction.UPDATE_PROVISION_PROFILE, profile.id, req.body);
    res.json({ data: profile });
  }),
);

router.delete(
  '/:id',
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const profile = await deleteProfile(req.params.id);
    await audit(req, AuditAction.DELETE_PROVISION_PROFILE, profile.id, { isActive: false });
    res.json({ data: { ok: true } });
  }),
);

async function audit(
  req: { admin?: { id: string }; ip?: string },
  action: AuditAction,
  resourceId: string,
  details: object,
) {
  if (!req.admin) return;
  await createAuditLog({
    adminId: req.admin.id,
    action,
    resource: 'ProvisionProfile',
    resourceId,
    details,
    ipAddress: req.ip,
  });
}

export default router;
