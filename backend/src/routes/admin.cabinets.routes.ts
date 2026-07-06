/**
 * @openapi
 * /api/admin/cabinets:
 *   get:
 *     tags: [Admin - Cabinets]
 *     summary: List all cabinets
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of cabinets with compartment counts
 *
 * /api/admin/cabinets/{id}:
 *   get:
 *     tags: [Admin - Cabinets]
 *     summary: Get cabinet detail with compartments
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet detail with compartments
 *   put:
 *     tags: [Admin - Cabinets]
 *     summary: Update cabinet info
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *               hardwareSerial: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet updated
 *   delete:
 *     tags: [Admin - Cabinets]
 *     summary: Delete cabinet
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet deleted
 *
 * /api/admin/cabinets/{id}/activate:
 *   post:
 *     tags: [Admin - Cabinets]
 *     summary: Activate a cabinet
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet activated
 *
 * /api/admin/cabinets/{id}/deactivate:
 *   post:
 *     tags: [Admin - Cabinets]
 *     summary: Deactivate a cabinet
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cabinet deactivated
 *
 * /api/admin/cabinets/{id}/compartments:
 *   post:
 *     tags: [Admin - Cabinets]
 *     summary: Create a new compartment
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, size, mcp23017PinLock, mcp23017PinSensor]
 *             properties:
 *               name: { type: string }
 *               size: { type: string, enum: [SMALL, LARGE] }
 *               mcp23017PinLock: { type: integer }
 *               mcp23017PinSensor: { type: integer }
 *               lockMcpDeviceId: { type: string }
 *               sensorMcpDeviceId: { type: string }
 *     responses:
 *       201:
 *         description: Compartment created
 *
 * /api/admin/cabinets/{id}/compartments/{compId}:
 *   put:
 *     tags: [Admin - Cabinets]
 *     summary: Update a compartment
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: compId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               size: { type: string, enum: [SMALL, LARGE] }
 *               mcp23017PinLock: { type: integer }
 *               mcp23017PinSensor: { type: integer }
 *               lockMcpDeviceId: { type: string }
 *               sensorMcpDeviceId: { type: string }
 *     responses:
 *       200:
 *         description: Compartment updated
 *   delete:
 *     tags: [Admin - Cabinets]
 *     summary: Delete a compartment
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: compId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Compartment deleted
 *
 * /api/admin/cabinets/{id}/compartments/{compId}/unlock:
 *   post:
 *     tags: [Admin - Cabinets]
 *     summary: Unlock a compartment via MQTT
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: compId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Unlock command sent
 *
 * /api/admin/cabinets/{id}/compartments/{compId}/test-open:
 *   post:
 *     tags: [Admin - Cabinets]
 *     summary: Test open compartment (returns MQTT debug info)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: compId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Test open result with MQTT publish info
 */
import { Router } from 'express';
import { z } from 'zod';
import { AuditAction, CompartmentSize } from '../generated/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAdmin, requireCabinetAccess } from '../middleware/auth';
import { auditFromRequest } from '../middleware/auditFromRequest';
import * as cabinetService from '../services/cabinet.services';
import * as compartmentService from '../services/compartment.services';

const router = Router();

const updateCabinetSchema = z.object({
    name: z.string().min(1).optional(),
    status: z.string().optional(),
    hardwareSerial: z.string().optional(),
    notes: z.string().optional(),
});

const createCompartmentSchema = z.object({
    name: z.string().min(1),
    size: z.nativeEnum(CompartmentSize),
    mcp23017PinLock: z.number().int(),
    mcp23017PinSensor: z.number().int(),
    lockMcpDeviceId: z.string().optional(),
    sensorMcpDeviceId: z.string().optional(),
});

const updateCompartmentSchema = createCompartmentSchema.partial();

router.get(
    '/',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const cabinets = await cabinetService.listCabinets(req.admin!.id, req.admin!.role);
        res.json({ data: cabinets });
    }),
);

router.get(
    '/:id',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        const cabinet = await cabinetService.getCabinet(req.params.id);
        res.json({ data: cabinet });
    }),
);

router.put(
    '/:id',
    requireCabinetAccess,
    validate(updateCabinetSchema),
    asyncHandler(async (req, res) => {
        const cabinet = await cabinetService.updateCabinet(req.params.id, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, req.body);
        res.json({ message: 'Cabinet updated successfully.', data: cabinet });
    }),
);

router.delete(
    '/:id',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        await cabinetService.deleteCabinet(req.params.id);
        await auditFromRequest(req, AuditAction.DELETE_CABINET, 'Cabinet', req.params.id, {});
        res.json({ message: 'Cabinet deleted successfully.' });
    }),
);

router.post(
    '/:id/compartments',
    requireCabinetAccess,
    validate(createCompartmentSchema),
    asyncHandler(async (req, res) => {
        const result = await compartmentService.createCompartment(req.params.id, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', result.compartment.id, req.body);
        res.status(201).json({ message: 'Compartment created successfully.', data: result });
    }),
);

router.put(
    '/:id/compartments/:compId',
    requireCabinetAccess,
    validate(updateCompartmentSchema),
    asyncHandler(async (req, res) => {
        const result = await compartmentService.updateCompartment(req.params.id, req.params.compId, req.body);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, req.body);
        res.json({ message: 'Compartment updated successfully', data: result });
    }),
);

router.delete(
    '/:id/compartments/:compId',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        const result = await compartmentService.deleteCompartment(req.params.id, req.params.compId);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Compartment', req.params.compId, {});
        res.json({ message: 'Compartment deleted successfully', data: result });
    }),
);

router.post(
    '/:id/compartments/:compId/unlock',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        await compartmentService.unlockCompartment(req.params.id, req.params.compId);
        await auditFromRequest(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, { compartmentId: req.params.compId });
        res.json({ message: 'Compartment unlocked successfully' });
    }),
);

router.post(
    '/:id/compartments/:compId/test-open',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        const result = await compartmentService.testOpenCompartment(req.params.id, req.params.compId);
        await auditFromRequest(req, AuditAction.UNLOCK_COMPARTMENT, 'Cabinet', req.params.id, { compartmentId: req.params.compId, test: true });
        res.json({ message: 'Test open sent successfully', data: result });
    }),
);

router.post(
    '/:id/activate',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        const cabinet = await cabinetService.activateCabinet(req.params.id);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
        res.json({ message: 'Cabinet activated successfully', data: cabinet });
    }),
);

router.post(
    '/:id/deactivate',
    requireCabinetAccess,
    asyncHandler(async (req, res) => {
        const cabinet = await cabinetService.deactivateCabinet(req.params.id);
        await auditFromRequest(req, AuditAction.UPDATE_CABINET, 'Cabinet', cabinet.id, { status: cabinet.status });
        res.json({ message: 'Cabinet deactivated successfully', data: cabinet });
    }),
);

export default router;