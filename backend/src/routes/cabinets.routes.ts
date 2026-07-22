/**
 * @openapi
 * /api/cabinets/{cabinetId}/compartments:
 *   get:
 *     tags: [Public - Cabinets]
 *     summary: List available (empty) compartments for a cabinet
 *     parameters:
 *       - name: cabinetId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of available compartments
 *
 * /api/cabinets/{cabinetId}/config:
 *   get:
 *     tags: [Public - Cabinets]
 *     summary: Get cabinet config with compartments and MCP devices
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: cabinetId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet config for kiosk
 */
import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireCabinet } from '../middleware/cabinetAuth';
import { NotFoundError } from '../lib/errors';
import * as cabinetService from '../services/cabinet.services';

const router = Router();

router.get(
    '/:cabinetId/compartments',
    asyncHandler(async (req, res) => {
        const compartments = await cabinetService.listAvailableCompartments(req.params.cabinetId);
        res.json({ data: compartments });
    }),
);

router.get(
    '/:cabinetId/config',
    requireCabinet,
    asyncHandler(async (req, res) => {
        const config = await cabinetService.getCabinetConfig(req.params.cabinetId);
        if (!config) throw new NotFoundError('Cabinet not found');
        res.json({ data: config });
    }),
);

export default router;