import { Router } from 'express';
import { z } from 'zod';
import { AdminRole } from '../generated/prisma';
import { requireSuperAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { auditFromRequest } from '../services/audit.service';
import { listAdmins, createAdmin, updateAdmin, deleteAdmin, setAdminCabinets } from '../services/admin.service';

const router = Router();

router.use(requireSuperAdmin);

const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.nativeEnum(AdminRole).optional(),
});

const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});

const setCabinetsSchema = z.object({
  cabinetIds: z.array(z.string()),
});

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const admins = await listAdmins();
    res.json({ data: admins });
  }),
);

router.post(
  '/',
  validate(createAdminSchema),
  asyncHandler(async (req, res) => {
    const admin = await createAdmin(req.body);
    await auditFromRequest(req, 'CREATE_ADMIN' as never, 'Admin', admin.id, { email: admin.email, role: admin.role });
    res.status(201).json({ data: admin });
  }),
);

router.put(
  '/:id',
  validate(updateAdminSchema),
  asyncHandler(async (req, res) => {
    const admin = await updateAdmin(req.params.id, req.body);
    await auditFromRequest(req, 'UPDATE_ADMIN' as never, 'Admin', admin!.id, req.body);
    res.json({ data: admin });
  }),
);

router.put(
  '/:id/cabinets',
  validate(setCabinetsSchema),
  asyncHandler(async (req, res) => {
    const admin = await setAdminCabinets(req.params.id, req.body.cabinetIds);
    await auditFromRequest(req, 'ASSIGN_ADMIN_CABINET' as never, 'Admin', req.params.id, { cabinetIds: req.body.cabinetIds });
    res.json({ data: admin });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteAdmin(req.params.id, req.admin!.id);
    await auditFromRequest(req, 'DELETE_ADMIN' as never, 'Admin', req.params.id, {});
    res.json({ data: { ok: true } });
  }),
);

export default router;
