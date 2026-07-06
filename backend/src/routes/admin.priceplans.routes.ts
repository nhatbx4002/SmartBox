/**
 * @openapi
 * /api/admin/price-plans:
 *   get:
 *     tags: [Admin - Price Plans]
 *     summary: List all price plans
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of price plans
 *   post:
 *     tags: [Admin - Price Plans]
 *     summary: Create a new price plan
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               size: { type: string, enum: [SMALL, LARGE] }
 *               rentalType: { type: string, enum: [ONCE, DAILY, MONTHLY] }
 *               price: { type: integer }
 *               durationDays: { type: integer }
 *               maxOpens: { type: integer, nullable: true }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Created price plan
 *
 * /api/admin/price-plans/{id}:
 *   put:
 *     tags: [Admin - Price Plans]
 *     summary: Update price plan
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated price plan
 *   delete:
 *     tags: [Admin - Price Plans]
 *     summary: Soft delete price plan (set isActive false)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Price plan deactivated
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CompartmentSize, RentalType } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireSuperAdmin } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as priceplanService from '../services/priceplan.service';

const router = Router();

const createSchema = z.object({
    name: z.string().min(1),
    size: z.nativeEnum(CompartmentSize),
    rentalType: z.nativeEnum(RentalType),
    price: z.number().int(),
    maxOpens: z.number().int().nullable().optional(),
    durationDays: z.number().int().min(1),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

router.get(
    '/',
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
        const plans = await priceplanService.listPricePlans();
        res.json({data:plans});
    })
)

router.post(
    '/',
    requireSuperAdmin,
    validate(createSchema),
    asyncHandler(async (req, res) => {
        const plan = await priceplanService.createPricePlan(req.body);
        await auditFromRequest(req,AuditAction.CREATE_PRICE_PLAN,'PricePlan', plan.id, req.body);
        res.status(201).json({data:plan});
    })
)

router.put(
    '/:id',
    requireSuperAdmin,
    validate(updateSchema),
    asyncHandler(async (req, res) => {
        const plan = await priceplanService.updatePricePlan(req.params.id, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_PRICE_PLAN, 'PricePlan', plan.id, req.body);
        res.json({data:plan});
    })
)

router.delete(
    '/:id',
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
        const plan = await priceplanService.deletePricePlan(req.params.id);
        await auditFromRequest(req, AuditAction.DELETE_PRICE_PLAN, 'PricePlan', plan.id, {});
        res.json({data: {ok : true}});
    })
)

export default router;