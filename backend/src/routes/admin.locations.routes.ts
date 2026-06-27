import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, LocationStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { auditFromRequest } from '../services/audit.service';

const router = Router();

const locationCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapImageUrl: z.string().min(1).optional(),
  status: z.nativeEnum(LocationStatus).optional(),
});

const locationUpdateSchema = locationCreateSchema.partial();

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.query.status?.toString() as LocationStatus | undefined;
    const locations = await prisma.location.findMany({
      where: status ? { status } : undefined,
      include: { _count: { select: { cabinets: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ data: locations });
  }),
);

router.post(
  '/',
  requireSuperAdmin,
  validate(locationCreateSchema),
  asyncHandler(async (req, res) => {
    const location = await prisma.location.create({ data: req.body });
    await auditFromRequest(req, AuditAction.CREATE_LOCATION, 'Location', location.id, req.body);
    res.status(201).json({ data: location });
  }),
);

router.put(
  '/:id',
  requireSuperAdmin,
  validate(locationUpdateSchema),
  asyncHandler(async (req, res) => {
    await ensureLocation(req.params.id);
    const location = await prisma.location.update({ where: { id: req.params.id }, data: req.body });
    await auditFromRequest(req, AuditAction.UPDATE_LOCATION, 'Location', location.id, req.body);
    res.json({ data: location });
  }),
);

router.delete(
  '/:id',
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await ensureLocation(req.params.id);
    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: { status: LocationStatus.INACTIVE },
    });
    await auditFromRequest(req, AuditAction.DELETE_LOCATION, 'Location', location.id, { status: LocationStatus.INACTIVE });
    res.json({ data: { ok: true } });
  }),
);

async function ensureLocation(id: string) {
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) throw NotFoundError('Location not found');
  return location;
}

export default router;
