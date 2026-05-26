import { Router } from 'express';
import { AuditAction } from '../generated/prisma';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { listAuditLogs } from '../services/audit.service';

const router = Router();

router.use(requireAdmin);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const logs = await listAuditLogs({
      adminId: req.query.adminId?.toString(),
      action: req.query.action?.toString() as AuditAction | undefined,
      resource: req.query.resource?.toString(),
      startDate: req.query.startDate?.toString(),
      endDate: req.query.endDate?.toString(),
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
    });
    res.json({ data: logs });
  }),
);

export default router;
