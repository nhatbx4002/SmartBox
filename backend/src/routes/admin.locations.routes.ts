/**
 * @openapi
 * /api/admin/locations:
 *   get:
 *     tags: [Admin - Locations]
 *     summary: List all locations
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of locations with cabinet count
 *   post:
 *     tags: [Admin - Locations]
 *     summary: Create a new location
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               mapImageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Created location
 *
 * /api/admin/locations/{id}:
 *   put:
 *     tags: [Admin - Locations]
 *     summary: Update location
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *      required: true
 *      content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *           email: { type: string }
 *           name: { type: string }
 *           password: { type: string }
 *           role: { type: string }
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated location
 *   delete:
 *     tags: [Admin - Locations]
 *     summary: Soft delete location (set status INACTIVE)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Location deactivated
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, LocationStatus } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as locationService from '../services/location.services';

const router = Router();

const createSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    mapImageUrl: z.string().optional(),
});

const updateSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    mapImageUrl: z.string().optional(),
    status: z.nativeEnum(LocationStatus).optional(),
})

router.get(
    '/',
    requireAdmin,
    asyncHandler(async(req, res) => {
        const locations = await locationService.listLocation();
        res.json({data: locations});
    })
)

router.post(
    '/',
    requireSuperAdmin,
    validate(createSchema),
    asyncHandler(async(req, res) => {
        const location = await locationService.createLocation(req.body);
        await auditFromRequest(req, AuditAction.CREATE_LOCATION,'Location' , location.id , req.body);
        res.status(201).json({data: location});
    })
)

router.put(
    '/:id',
    requireSuperAdmin,
    validate(updateSchema),
    asyncHandler(async(req, res) => {
        const location = await locationService.updateLocation(req.params.id, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_LOCATION, 'Location', location.id, req.body);
        res.json({data: location});
    })
)

router.delete(
    '/:id',
    requireSuperAdmin,
    asyncHandler(async(req, res) => {
        await locationService.deleteLocation(req.params.id);
        await auditFromRequest(req,AuditAction.DELETE_LOCATION,'Location',req.params.id, {});
        res.json({data: {ok:true}})
    })
)

export default router;