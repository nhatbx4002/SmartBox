/**
 * @openapi
 * /api/plans:
 *   get:
 *     tags: [Public - Plans]
 *     summary: List active price plans
 *     parameters:
 *       - name: size
 *         in: query
 *         schema:
 *           type: string
 *           enum: [SMALL, LARGE]
 *     responses:
 *       200:
 *         description: List of active price plans
 */

import {Router} from 'express'
import {z} from 'zod'
import {CompartmentSize} from '../generated/prisma'
import {asyncHandler} from '../middleware/asyncHandler'
import {validate} from '../middleware/validate'
import * as priceplanService from '../services/priceplan.service'

const router = Router();

const querySchema = z.object({ size: z.nativeEnum(CompartmentSize).optional() });

router.get(
    '/',
    validate(querySchema, 'query'),
    asyncHandler(async (req, res) => {
        const plans = await priceplanService.listPricePlans({ size: req.query.size as any , isActive: true });
        res.json({ data: plans});
    })
);

export default router;