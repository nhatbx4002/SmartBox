/**
 * @openapi
 * /api/audit-logs:
 *   get:
 *     tags: [Admin - Audit Logs]
 *     summary: List audit logs
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: adminId
 *         in: query
 *         schema: { type: string }
 *       - name: action
 *         in: query
 *         schema: { type: string }
 *       - name: resource
 *         in: query
 *         schema: { type: string }
 *       - name: startDate
 *         in: query
 *         schema: { type: string }
 *       - name: endDate
 *         in: query
 *         schema: { type: string }
 *       - name: page
 *         in: query
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Audit logs with pagination
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireSuperAdmin } from '../middleware/auth';
import * as auditService from '../services/audit.services';

const router = Router();

const listQuerySchema = z.object({
    adminId: z.string().optional(),
    action: z.string().optional(),
    resource: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
});

router.get(
    '/',
    requireSuperAdmin,
    validate(listQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
        const result = await auditService.listAuditLogs(req.query as any);
        res.json({
            data: result.items,
            pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages },
        });
    }),
);

export default router;
