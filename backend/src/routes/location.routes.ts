/**
 * @openapi
 * /api/public/locations:
 *   get:
 *     tags: [Public - Locations]
 *     summary: List all active locations
 *     responses:
 *       200:
 *         description: List of locations
 *
 * /api/public/locations/{id}:
 *   get:
 *     tags: [Public - Locations]
 *     summary: Get location detail with cabinets and compartments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Location detail with cabinets
 */

import {Router} from 'express'
import {asyncHandler} from '../middleware/asyncHandler'
import * as locationService from '../services/location.services'

const router = Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        const locations = await locationService.getPublicLocations();
        res.json({ data : locations });
    })
)

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const location = await locationService.getPublicLocationDetail(req.params.id);
        res.json({data: location});
    })
)

export default router;