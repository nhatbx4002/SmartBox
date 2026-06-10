import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';
import {
  approvePairingSession,
  cancelPairingSession,
  getPairingSession,
  getPairingSessionByCode,
  startPairingSession,
} from '../services/pairing.service';

const router = Router();

const startSchema = z.object({
  hardwareSerial: z.string().min(1).max(64),
  discoveredMcpDevices: z
    .array(
      z.object({
        bus: z.number().int().min(0).default(1),
        address: z.number().int().min(0).max(0x7f),
      }),
    )
    .min(1),
});

const approveSchema = z.object({
  locationId: z.string().min(1),
  cabinetName: z.string().min(1),
});

router.post(
  '/start',
  validate(startSchema),
  asyncHandler(async (req, res) => {
    const data = await startPairingSession(req.body);
    res.status(201).json({ data });
  }),
);

router.get(
  '/:sessionId',
  asyncHandler(async (req, res) => {
    res.json({ data: await getPairingSession(req.params.sessionId) });
  }),
);

router.get(
  '/by-code/:code',
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ data: await getPairingSessionByCode(req.params.code) });
  }),
);

router.post(
  '/:sessionId/approve',
  requireAdmin,
  validate(approveSchema),
  asyncHandler(async (req, res) => {
    res.json({ data: await approvePairingSession(req.params.sessionId, req.body) });
  }),
);

router.post(
  '/:sessionId/cancel',
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ data: await cancelPairingSession(req.params.sessionId) });
  }),
);

export default router;
