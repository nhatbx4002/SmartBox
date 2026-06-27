import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import {
  startPaymentForRental,
  handlePayosWebhook,
  getPaymentResult,
} from '../services/payment.service';

const router = Router();

const paymentPublicRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many requests, please try again later' } },
});

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
  paymentPublicRateLimit,
  asyncHandler(async (req, res) => {
    const parsed = z.coerce.number().int().positive().safeParse(req.query.orderCode);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: 'VALIDATION', message: 'orderCode must be a positive integer' } });
    }
    const payment = await prisma.payment.findUnique({ where: { orderCode: parsed.data } });
    if (!payment) throw NotFoundError('Payment not found');
    res.json({ data: { orderCode: payment.orderCode, status: payment.status } });
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
// GET /api/payments/result/:orderCode  — kiosk post-payment result (no auth)
// ---------------------------------------------------------------------------
router.get(
  '/result/:orderCode',
  paymentPublicRateLimit,
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
