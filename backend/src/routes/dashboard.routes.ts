/**
 * @openapi
 * /api/dashboard/stats:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Get dashboard statistics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard stats
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAdmin } from '../middleware/auth';
import * as dashboardService from '../services/dashboard.services';

const router = Router();

router.get(
    '/stats',
    requireAdmin,
    asyncHandler(async (_req, res) => {
        const stats = await dashboardService.getDashboardStats();
        res.json({ data: stats });
    }),
);

export default router;
