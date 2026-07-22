/**
 * @openapi
 * /api/pair:
 *   get:
 *     tags: [Admin - Pairing]
 *     summary: List all pairing sessions
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of pairing sessions
 *
 * /api/pair/start:
 *   post:
 *     tags: [Public - Pairing]
 *     summary: Start a new pairing session (called by kiosk on first boot)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hardwareSerial, discoveredMcpDevices]
 *             properties:
 *               hardwareSerial: { type: string }
 *               discoveredMcpDevices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     bus: { type: integer }
 *                     address: { type: integer }
 *     responses:
 *       201:
 *         description: Pairing session created
 *
 * /api/pair/{sessionId}:
 *   get:
 *     tags: [Public - Pairing]
 *     summary: Poll pairing session status (called by kiosk)
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pairing session detail
 *
 * /api/pair/by-code/{code}:
 *   get:
 *     tags: [Admin - Pairing]
 *     summary: Find pairing session by pairing code
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pairing session detail
 *
 * /api/pair/{sessionId}/approve:
 *   post:
 *     tags: [Admin - Pairing]
 *     summary: Approve pairing session and create a new cabinet
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [locationId, cabinetName]
 *             properties:
 *               locationId: { type: string }
 *               cabinetName: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet created with cabinet JWT + MQTT config
 *
 * /api/pair/{sessionId}/cancel:
 *   post:
 *     tags: [Admin - Pairing]
 *     summary: Cancel a pending pairing session
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cancelled
 *
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuditAction } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as pairingService from '../services/pairing.services';

const router = Router();

const startSchema = z.object({
    hardwareSerial: z.string().min(1),
    discoveredMcpDevices: z.array(
        z.object({
            bus: z.number().int(),
            address: z.number().int(),
        }),
    ),
});

const approveSchema = z.object({
    locationId: z.string().min(1),
    cabinetName: z.string().min(1),
});

router.get(
    '/',
    requireAdmin,
    asyncHandler(async (_req, res) => {
        const sessions = await pairingService.listPairingSessions();
        res.json({ data: sessions });
    }),
);

router.post(
    '/start',
    validate(startSchema),
    asyncHandler(async (req, res) => {
        const result = await pairingService.startPairing(req.body);
        res.status(201).json({ data: result });
    }),
);

router.get(
    '/by-code/:code',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const session = await pairingService.getPairingSessionByCode(req.params.code);
        res.json({ data: session });
    }),
);

router.get(
    '/:sessionId',
    asyncHandler(async (req, res) => {
        const session = await pairingService.getPairingSession(req.params.sessionId);
        res.json({ data: session });
    }),
);


router.post(
    '/:sessionId/approve',
    requireSuperAdmin,
    validate(approveSchema),
    asyncHandler(async (req, res) => {
        const result = await pairingService.approvePairing(req.params.sessionId, req.body);
        await auditFromRequest(req, AuditAction.CREATE_CABINET, 'Cabinet', result.cabinetId, req.body);
        res.json({ data: result });
    }),
);

router.post(
    '/:sessionId/cancel',
    requireAdmin,
    asyncHandler(async (req, res) => {
        await pairingService.cancelPairing(req.params.sessionId);
        await auditFromRequest(req, AuditAction.CANCEL_PAIRING, 'PairingSession', req.params.sessionId, {});
        res.json({ data: { ok: true } });
    }),
);

export default router;