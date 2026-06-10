import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireCabinet } from '../middleware/cabinetAuth';
import { getCabinetConfigSnapshot } from '../services/cabinet.service';
import { ForbiddenError } from '../lib/errors';

const router = Router();

router.get(
  '/:cabinetId/config',
  requireCabinet,
  asyncHandler(async (req, res) => {
    assertCabinetParam(req.params.cabinetId, req.cabinet?.id);
    const version = req.query.version === undefined ? undefined : Number(req.query.version);
    const config = await getCabinetConfigSnapshot(req.params.cabinetId);
    res.json({
      data: {
        ...config,
        needsReload: version === undefined ? true : version < config.configVersion,
      },
    });
  }),
);

function assertCabinetParam(cabinetId: string | undefined, tokenCabinetId?: string) {
  if (!cabinetId || tokenCabinetId !== cabinetId) {
    throw ForbiddenError('Cabinet token does not match requested cabinet');
  }
}

export default router;
