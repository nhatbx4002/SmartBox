/**
 * @openapi
 * /api/rentals:
 *   post:
 *     tags: [Rentals]
 *     summary: Create a new rental (kiosk flow, PENDING until payment)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, size, planId, cabinetId]
 *             properties:
 *               phone: { type: string }
 *               size: { type: string, enum: [SMALL, LARGE] }
 *               planId: { type: string }
 *               cabinetId: { type: string }
 *     responses:
 *       201:
 *         description: Rental created with code + compartment
 *
 * /api/rentals/verify-qr:
 *   post:
 *     tags: [Rentals]
 *     summary: Verify QR token (pickup flow)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Rental + compartment info
 *
 * /api/rentals/{code}:
 *   get:
 *     tags: [Rentals]
 *     summary: Get rental by code
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental detail
 * /api/rentals/{id}/complete:
 *   post:
 *     tags: [Rentals]
 *     summary: Complete rental (kiosk, no auth)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental completed
 */

import { Router } from 'express';
import { z } from 'zod';
import { CompartmentSize } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import * as rentalService from '../services/rental.services';

const router = Router();

const createRentalSchema = z.object({
    phone: z.string().min(10),
    size: z.nativeEnum(CompartmentSize),
    planId: z.string().min(1),
    cabinetId: z.string().min(1),
});

const verifyQrSchema = z.object({
    token: z.string().min(1),
});

router.post(
    '/',
    validate(createRentalSchema),
    asyncHandler(async (req, res) => {
        const result = await rentalService.createRental({
            phone: req.body.phone,
            size: req.body.size,
            planId: req.body.planId,
            cabinetId: req.body.cabinetId,
        });
        res.status(201).json({ data: result });
    }),
);


router.post(
    '/verify-qr',
    validate(verifyQrSchema),
    asyncHandler(async (req, res) => {
        const { rental, compartment } = await rentalService.verifyQr(req.body.token);
        res.json({
            data: {
                id: rental.id,
                rentalId: rental.id,
                pin: rental.code,
                compartmentId: compartment.id,
                compartmentName: compartment.name,
                lockerName: compartment.cabinet.name,
                size: compartment.size,
                expiresAt: rental.expiresAt,
                qrData: rental.qrToken,
                authorized: true,
                rental,
                compartment,
            },
        });
    }),
);

router.get(
    '/:code',
    asyncHandler(async (req, res) => {
        const rental = await rentalService.getRentalByCode(req.params.code);
        res.json({ data: rental });
    }),
);

router.post(
    '/:id/complete',
    asyncHandler(async (req, res) => {
        const result = await rentalService.completeRentalGeneric(req.params.id);
        res.json({ data: result });
    }),
);

export default router;
