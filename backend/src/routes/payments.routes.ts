/**
 * @openapi
 * /api/payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a PayOS payment for a rental
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rentalId]
 *             properties:
 *               rentalId: { type: string }
 *               source: { type: string, enum: [KIOSK, APP] }
 *     responses:
 *       201:
 *         description: Payment created with orderCode + qrCode + checkoutUrl
 *
 * /api/payments/payment-status:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment status by order code
 *     parameters:
 *       - name: orderCode
 *         in: query
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Payment status
 *
 * /api/payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: PayOS webhook receiver
 *     responses:
 *       200:
 *         description: Acknowledged
 *
 * /api/payments/result/{orderCode}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment result after successful payment
 *     parameters:
 *       - name: orderCode
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Rental + compartment detail
 *
 * /api/payments/{orderCode}/cancel:
 *   post:
 *     tags: [Payments]
 *     summary: Cancel a pending payment
 *     parameters:
 *       - name: orderCode
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cancelled
 *
 * /api/payments/payos/return:
 *   get:
 *     tags: [Payments]
 *     summary: PayOS return redirect (success)
 *     responses:
 *       200:
 *         description: HTML confirmation page
 *
 * /api/payments/payos/cancel:
 *   get:
 *     tags: [Payments]
 *     summary: PayOS cancel redirect
 *     responses:
 *       200:
 *         description: HTML cancellation page
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import * as paymentService from '../services/payment.services';

const router = Router();

const createPaymentSchema = z.object({
    rentalId: z.string().min(1),
    source: z.enum(['KIOSK', 'APP']).optional(),
});

const statusQuerySchema = z.object({
    orderCode: z.coerce.number().int(),
});

router.post(
    '/',
    validate(createPaymentSchema),
    asyncHandler(async (req, res) => {
        const result = await paymentService.createPayment(req.body.rentalId, req.body.source);
        res.status(201).json({ data: result });
    }),
);

router.get(
    '/payment-status',
    validate(statusQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
        const orderCode = Number(req.query.orderCode);
        const result = await paymentService.getPaymentStatus(orderCode);
        res.json({ data: result });
    }),
);

router.post(
    '/webhook',
    asyncHandler(async (req, res) => {
        const result = await paymentService.handleWebhook(req.body);
        res.json(result);
    }),
);

router.get(
    '/result/:orderCode',
    asyncHandler(async (req, res) => {
        const orderCode = Number(req.params.orderCode);
        const result = await paymentService.getPaymentResult(orderCode);
        res.json({ data: result });
    }),
);

router.get(
    '/payos/return',
    asyncHandler(async (_req, res) => {
        res.send('<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0A0A0A;color:#E8E8E8;"><div style="text-align:center;"><h1 style="color:#2E7D32;">Thanh toán thành công!</h1><p>Bạn có thể đóng trang này.</p></div></body></html>');
    }),
);

router.get(
    '/payos/cancel',
    asyncHandler(async (_req, res) => {
        res.send('<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0A0A0A;color:#E8E8E8;"><div style="text-align:center;"><h1 style="color:#EF4444;">Đã hủy thanh toán</h1><p>Bạn có thể đóng trang này.</p></div></body></html>');
    }),
);

router.post(
    '/:orderCode/cancel',
    asyncHandler(async (req, res) => {
        const orderCode = Number(req.params.orderCode);
        const result = await paymentService.cancelPayment(orderCode);
        res.json({ data: result });
    }),
);

export default router;
