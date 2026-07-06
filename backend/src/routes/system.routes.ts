/**
 * @openapi
 * /api/system/heartbeat:
 *   post:
 *     tags: [System]
 *     summary: Cabinet heartbeat (kiosk keepalive)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cabinetId]
 *             properties:
 *               cabinetId: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet heartbeat recorded
 *
 * /api/system/locker-event:
 *   post:
 *     tags: [System]
 *     summary: Report a locker hardware event (door open/close)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cabinetId]
 *             properties:
 *               cabinetId: { type: string }
 *               compartmentId: { type: string }
 *               rentalId: { type: string }
 *               event: { type: string }
 *               lockStatus: { type: string }
 *               doorStatus: { type: string }
 *     responses:
 *       200:
 *         description: Event recorded
 *
 * /api/system/status:
 *   get:
 *     tags: [System]
 *     summary: Get overall system status
 *     responses:
 *       200:
 *         description: System status summary
 */

import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import * as systemService from '../services/system.services';

const router = Router();

const heartbeatSchema = z.object({
    cabinetId: z.string().min(1),
});

const lockerEventSchema = z.object({
    cabinetId: z.string().min(1),
    compartmentId: z.string().optional(),
    rentalId: z.string().optional(),
    event: z.string().optional(),
    lockStatus: z.string().optional(),
    doorStatus: z.string().optional(),
});

router.post(
    '/heartbeat',
    validate(heartbeatSchema),
    asyncHandler(async (req, res) => {
        const cabinet = await systemService.heartbeat(req.body.cabinetId);
        res.json({ data: cabinet });
    }),
);

router.post(
    '/locker-event',
    validate(lockerEventSchema),
    asyncHandler(async (req, res) => {
        const result = await systemService.recordLockerEvent(req.body);
        res.json({ data: result });
    }),
);

router.get(
    '/status',
    asyncHandler(async (_req, res) => {
        const status = await systemService.getSystemStatus();
        res.json({ data: status });
    }),
);

export default router;
