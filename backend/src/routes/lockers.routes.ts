/**
 * @openapi
 * /api/lockers/available:
 *   get:
 *     tags: [Lockers]
 *     summary: List available compartments, optionally scoped to one cabinet
 *     parameters:
 *       - name: size
 *         in: query
 *         schema: { type: string, enum: [SMALL, LARGE] }
 *       - name: cabinetId
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of available compartments
 *
 * /api/lockers/plans:
 *   get:
 *     tags: [Lockers]
 *     summary: List active price plans (alias of /api/plans)
 *     parameters:
 *       - name: size
 *         in: query
 *         schema: { type: string, enum: [SMALL, LARGE] }
 *     responses:
 *       200:
 *         description: List of active price plans
 */

import { Router } from 'express';
import { z } from 'zod';
import { CompartmentSize, CompartmentStatus } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';
import * as priceplanService from '../services/priceplan.service';

const router = Router();

const querySchema = z.object({
    size: z.nativeEnum(CompartmentSize).optional(),
    cabinetId: z.string().optional(),
});

router.get(
    '/available',
    validate(querySchema, 'query'),
    asyncHandler(async (req, res) => {
        const size = req.query.size as CompartmentSize | undefined;
        const cabinetId = req.query.cabinetId as string | undefined;
        const compartments = await prisma.compartment.findMany({
            where: {
                status: CompartmentStatus.AVAILABLE,
                deletedAt: null,
                ...(size ? { size } : {}),
                ...(cabinetId ? { cabinetId } : {}),
            },
            include: { cabinet: true },
        });
        res.json({ data: compartments });
    }),
);

router.get(
    '/plans',
    validate(querySchema, 'query'),
    asyncHandler(async (req, res) => {
        const plans = await priceplanService.listPricePlans({
            size: req.query.size as CompartmentSize | undefined,
            isActive: true,
        });
        res.json({ data: plans });
    }),
);

export default router;