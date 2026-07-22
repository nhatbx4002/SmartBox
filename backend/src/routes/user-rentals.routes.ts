/**
 * @openapi
 * /api/users/me/rentals:
 *   get:
 *     tags: [User - Rentals]
 *     summary: List my rentals
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 20 }
 *       - name: status
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rentals array + pagination
 *
 * /api/users/me/rentals/{id}:
 *   get:
 *     tags: [User - Rentals]
 *     summary: Get rental detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental detail with compartment, price plan, logs, payment
 *   post:
 *     tags: [User - Rentals]
 *     summary: Complete rental early
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental completed, compartment freed
 */

import { Router } from 'express';
import { z } from 'zod';
import { RentalStatus } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireUser } from '../middleware/auth';
import * as rentalService from '../services/rental.services';

const router = Router();

const listSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.nativeEnum(RentalStatus).optional(),
});

router.get(
    '/',
    requireUser,
    validate(listSchema, 'query'),
    asyncHandler(async (req, res) => {
        const { page, limit, status } = req.query as any;
        const result = await rentalService.listUserRentals(req.user!.id, { page, limit, status });
        res.json({
            data: result.rentals,
            pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages },
        });
    })
);

router.get(
    '/:id',
    requireUser,
    asyncHandler(async (req, res) => {
        const rental = await rentalService.getUserRentalById(req.params.id, req.user!.id);
        res.json({ data: rental });
    })
);

router.post(
    '/:id/complete',
    requireUser,
    asyncHandler(async (req, res) => {
        const result = await rentalService.completeUserRental(req.params.id, req.user!.id);
        res.json({ data: result });
    })
);

export default router;
