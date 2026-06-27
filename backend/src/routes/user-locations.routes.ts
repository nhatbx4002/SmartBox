import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { getNearbyLocations, getLocationDetail } from '../services/location.service';

const router = Router();

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const userLat = parseFloat(req.query.lat as string);
    const userLng = parseFloat(req.query.lng as string);
    const result = await getNearbyLocations(
      isNaN(userLat) ? undefined : userLat,
      isNaN(userLng) ? undefined : userLng,
    );
    res.json({ data: result });
  }),
);

router.get(
  '/:id',
  requireUser,
  asyncHandler(async (req, res) => {
    const result = await getLocationDetail(req.params.id);
    res.json({ data: result });
  }),
);

export default router;
