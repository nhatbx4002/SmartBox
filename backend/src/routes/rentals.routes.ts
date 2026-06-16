import { Router } from 'express';
import { z } from 'zod';
import { CompartmentSize, PaymentMethod } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { verifyPin } from '../services/auth.service';
import { completeRental, createRental, getByCode, handleUnlock, verifyQrRental } from '../services/rental.service';

const router = Router();

const createRentalSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,11}$/),
  size: z.nativeEnum(CompartmentSize),
  planId: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  cabinetId: z.string().min(1).optional(),
});

const verifyPinSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
  mode: z.enum(['deposit', 'pickup']).optional().nullable(),
});

const verifyQrSchema = z.object({
  token: z.string().min(1),
});

router.post(
  '/verify-pin',
  validate(verifyPinSchema),
  asyncHandler(async (req, res) => {
    const result = await verifyPin(req.body.code);
    res.json({
      data: {
        id: result.rental.id,
        rentalId: result.rental.id,
        pin: result.rental.code,
        compartmentId: result.compartment.id,
        compartmentName: result.compartment.name,
        lockerName: result.compartment.cabinet.name,
        size: result.compartment.size,
        expiresAt: result.rental.expiresAt,
        qrData: result.rental.qrToken,
      },
    });
  }),
);

router.post(
  '/verify-qr',
  validate(verifyQrSchema),
  asyncHandler(async (req, res) => {
    const result = await verifyQrRental(req.body.token);
    res.json({
      data: {
        id: result.rental.id,
        rentalId: result.rental.id,
        pin: result.rental.code,
        compartmentId: result.compartment.id,
        compartmentName: result.compartment.name,
        lockerName: result.compartment.cabinet.name,
        size: result.compartment.size,
        expiresAt: result.rental.expiresAt,
        qrData: result.rental.qrToken,
        authorized: true,
        rental: result.rental,
        compartment: result.compartment,
      },
    });
  }),
);

router.post(
  '/',
  validate(createRentalSchema),
  asyncHandler(async (req, res) => {
    const result = await createRental(req.body);
    res.status(201).json({ data: result });
  }),
);

router.get(
  '/:code',
  asyncHandler(async (req, res) => {
    const rental = await getByCode(req.params.code);
    res.json({ data: rental });
  }),
);

// Public unlock route retained for the admin web dashboard (RentalDetailPage).
// The Android app no longer calls this; remote unlock from the user app was removed.
router.post(
  '/:id/unlock',
  asyncHandler(async (req, res) => {
    const rental = await handleUnlock(req.params.id);
    res.json({ data: rental });
  }),
);

router.post(
  '/:id/complete',
  asyncHandler(async (req, res) => {
    await completeRental(req.params.id);
    res.json({ data: { ok: true } });
  }),
);

export default router;
