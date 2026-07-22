/**
 * @openapi
 * /api/admin/admins:
 *   get:
 *     tags: [Admin - Admins]
 *     summary: List all admins
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of admins with cabinet assignments
 *   post:
 *     tags: [Admin - Admins]
 *     summary: Create a new admin
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Created admin
 *
 * /api/admin/admins/{id}:
 *   put:
 *     tags: [Admin - Admins]
 *     summary: Update admin
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated admin
 *   delete:
 *     tags: [Admin - Admins]
 *     summary: Delete admin
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Admin deleted
 *
 * /api/admin/admins/{id}/cabinets:
 *   put:
 *     tags: [Admin - Admins]
 *     summary: Assign cabinets to admin
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cabinetIds:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Admin with updated cabinet assignments
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuditAction } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireSuperAdmin } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as adminService from '../services/admin.services';

const router = Router();

const createSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
    role: z.string().optional(),
});
const updateSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
});
const cabinetsSchema = z.object({ cabinetIds: z.array(z.string()) });

router.get(
    '/',
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
        const admins = await adminService.listAdmins();
        res.json({ data: admins });
    })
);

router.post(
    '/',
    requireSuperAdmin,
    validate(createSchema),
    asyncHandler(async (req, res) => {
        const admin = await adminService.createAdmin(req.body);
        await auditFromRequest(req, AuditAction.CREATE_ADMIN, 'Admin', admin.id, { email: admin.email, role: admin.role });
        res.status(201).json({ data: admin });
    })
);

router.put(
    '/:id',
    requireSuperAdmin,
    validate(updateSchema),
    asyncHandler(async (req, res) => {
        const admin = await adminService.updateAdmin(req.params.id, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_ADMIN, 'Admin', admin.id, req.body);
        res.json({ data: admin });
    })
);

router.put(
    '/:id/cabinets',
    requireSuperAdmin,
    validate(cabinetsSchema),
    asyncHandler(async (req, res) => {
        const admin = await adminService.setAdminCabinets(req.params.id, req.body.cabinetIds);
        await auditFromRequest(req, AuditAction.ASSIGN_ADMIN_CABINET, 'Admin', req.params.id, { cabinetIds: req.body.cabinetIds });
        res.json({ data: admin });
    })
);

router.delete(
    '/:id',
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
        await adminService.deleteAdmin(req.params.id, req.admin!.id);
        await auditFromRequest(req, AuditAction.DELETE_ADMIN, 'Admin', req.params.id, {});
        res.json({ data: { ok: true } });
    })
);

export default router;
