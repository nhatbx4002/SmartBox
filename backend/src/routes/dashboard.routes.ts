import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { getDashboardStats } from '../services/dashboard.service';

const router = Router();

router.get(
  '/stats',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json({ data: await getDashboardStats() });
  }),
);

export default router;
