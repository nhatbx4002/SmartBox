import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import {
  startPaymentForRental,
  handlePayosWebhook,
  getPaymentStatus,
  getPaymentResult,
  confirmPaymentForTesting,
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
// Public — polled by the kiosk as a webhook fallback.
// ---------------------------------------------------------------------------
router.get(
  '/payment-status',
  asyncHandler(async (req, res) => {
    const parsed = z.coerce.number().int().positive().safeParse(req.query.orderCode);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: 'VALIDATION', message: 'orderCode must be a positive integer' } });
    }
    const result = await getPaymentStatus(parsed.data);
    res.json({ data: result });
  }),
);

// ---------------------------------------------------------------------------
// POST /api/payments/webhook  — PayOS webhook (public, signature-verified)
// ---------------------------------------------------------------------------
router.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    await handlePayosWebhook(req.body);
    res.status(200).json({ code: '00', desc: 'success' });
  }),
);

// ---------------------------------------------------------------------------
// POST /api/payments/test/confirm-paid  — DEV ONLY: manually fire payment success
// Body: { orderCode: number }
// Runs the full webhook flow (DB update + MQTT publish) without PayOS.
// ---------------------------------------------------------------------------
router.post(
  '/test/confirm-paid',
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: { message: 'Not found' } });
    }
    const parsed = z.object({ orderCode: z.coerce.number().int().positive() }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: 'VALIDATION', message: parsed.error.errors.map(e => e.message).join(', ') } });
    }
    const result = await confirmPaymentForTesting(parsed.data.orderCode);
    res.json({ data: result });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/payments/result/:orderCode  — kiosk post-payment result (no auth)
// ---------------------------------------------------------------------------
router.get(
  '/result/:orderCode',
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
