/**
 * @openapi
 * /api/users/me/locations:
 *   get:
 *     tags: [User - Locations]
 *     summary: List nearby active locations for mobile app
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of active locations
 *
 * /api/users/me/locations/{id}:
 *   get:
 *     tags: [User - Locations]
 *     summary: Get location detail with cabinets and compartments
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Location detail
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/auth';
import * as locationService from '../services/location.services';

const router = Router();

router.get(
    '/',
    requireUser,
    asyncHandler(async (req, res) => {
        const locations = await locationService.getPublicLocations();
        res.json({ data: locations });
    })
);

router.get(
    '/:id',
    requireUser,
    asyncHandler(async (req, res) => {
        const location = await locationService.getPublicLocationDetail(req.params.id);
        res.json({ data: location });
    })
);

export default router;
