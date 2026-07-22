/**
 * @openapi
 * /api/admin/rentals:
 *   get:
 *     tags: [Admin - Rentals]
 *     summary: List all rentals
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: status
 *         in: query
 *         schema: { type: string }
 *       - name: locationId
 *         in: query
 *         schema: { type: string }
 *       - name: startDate
 *         in: query
 *         schema: { type: string }
 *       - name: endDate
 *         in: query
 *         schema: { type: string }
 *       - name: page
 *         in: query
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of rentals
 *
 * /api/admin/rentals/{id}:
 *   get:
 *     tags: [Admin - Rentals]
 *     summary: Get rental detail
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental detail with logs and payment
 *
 * /api/admin/rentals/{id}/cancel:
 *   put:
 *     tags: [Admin - Rentals]
 *     summary: Cancel a rental
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rental cancelled, compartment freed
 * /api/admin/rentals/{id}/unlock:
 *   post:
 *     tags: [Admin - Rentals]
 *     summary: Force unlock compartment for a rental
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Unlock command sent
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, RentalStatus } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as rentalService from '../services/rental.services';

const router = Router();

const listQuerySchema = z.object({
    status: z.nativeEnum(RentalStatus).optional(),
    locationId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
});

router.get(
    '/',
    requireAdmin,
    validate(listQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
        const result = await rentalService.adminListRentals(req.query as any);
        res.json({
            data: result.rentals,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                pages: result.pages
            },
        });
    }),
);

router.get(
    '/:id',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const rental = await rentalService.adminGetRental(req.params.id);
        res.json({ data: rental });
    }),
);

router.put(
    '/:id/cancel',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await rentalService.adminCancelRental(req.params.id);
        await auditFromRequest(req, AuditAction.CANCEL_RENTAL, 'Rental', req.params.id, {});
        res.json({ data: result });
    }),
);

router.post(
    '/:id/unlock',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await rentalService.adminUnlockRental(req.params.id);
        await auditFromRequest(req, AuditAction.UNLOCK_COMPARTMENT, 'Rental', req.params.id, {});
        res.json({ data: result });
    }),
);

export default router;