import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireUser } from '../middleware/requireUser';
import {
  startPaymentForRental,
  handlePayosWebhook,
  getPaymentStatus,
  getPaymentResult,
} from '../services/payment.service';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/payments { rentalId, source }
// ---------------------------------------------------------------------------
const createPaymentSchema = z.object({
  rentalId: z.string().min(1),
  source: z.enum(['KIOSK', 'APP']).default('KIOSK'),
});

router.post(
  '/',
  validate(createPaymentSchema),
  asyncHandler(async (req, res) => {
    const result = await startPaymentForRental(req.body.rentalId, req.body.source);
    res.status(201).json({ data: result });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/payments/payment-status?orderCode=123456
// ---------------------------------------------------------------------------
const statusQuerySchema = z.object({
  orderCode: z.coerce.number().int().positive(),
});

router.get(
  '/payment-status',
  validate(statusQuerySchema),
  asyncHandler(async (req, res) => {
    const result = await getPaymentStatus(req.query.orderCode as unknown as number);
    res.json({ data: result });
  }),
);

// ---------------------------------------------------------------------------
// POST /api/payments/webhook
// ---------------------------------------------------------------------------
router.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    await handlePayosWebhook(req.body);
    res.status(200).json({ code: '00', desc: 'success' });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/payments/result/:orderCode
// ---------------------------------------------------------------------------
router.get(
  '/result/:orderCode',
  requireUser,
  asyncHandler(async (req, res) => {
    const result = await getPaymentResult(Number(req.params.orderCode));
    res.json({ data: result });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/payments/payos/return
// GET /api/payments/payos/cancel
// ---------------------------------------------------------------------------
router.get('/payos/return', (_req, res) => {
  const dashboardUrl = process.env.PAYOS_CANCEL_URL?.replace('/cancel', '') ?? 'http://localhost:5173';
  res.redirect(`${dashboardUrl}?payment=success`);
});

router.get('/payos/cancel', (_req, res) => {
  res.redirect(`${process.env.PAYOS_CANCEL_URL ?? 'http://localhost:5173'}?payment=cancelled`);
});

export default router;
