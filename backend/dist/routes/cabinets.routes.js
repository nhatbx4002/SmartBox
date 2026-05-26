"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const cabinet_service_1 = require("../services/cabinet.service");
const audit_service_1 = require("../services/audit.service");
const locker_service_1 = require("../services/locker.service");
const router = (0, express_1.Router)();
const cabinetCreateSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    locationId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
});
const cabinetUpdateSchema = cabinetCreateSchema.partial().extend({
    status: zod_1.z.nativeEnum(prisma_1.CabinetStatus).optional(),
});
router.use(auth_1.requireAdmin);
router.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json({ data: await (0, cabinet_service_1.listCabinets)() });
}));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    res.json({ data: await (0, cabinet_service_1.getCabinet)(req.params.id) });
}));
router.post('/', (0, validate_1.validate)(cabinetCreateSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cabinet = await (0, cabinet_service_1.createCabinet)(req.body);
    await auditCabinet(req, prisma_1.AuditAction.CREATE_CABINET, cabinet.id, req.body);
    res.status(201).json({ data: cabinet });
}));
router.put('/:id', (0, validate_1.validate)(cabinetUpdateSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cabinet = await (0, cabinet_service_1.updateCabinet)(req.params.id, req.body);
    await auditCabinet(req, prisma_1.AuditAction.UPDATE_CABINET, cabinet.id, req.body);
    res.json({ data: cabinet });
}));
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, cabinet_service_1.deleteCabinet)(req.params.id);
    await auditCabinet(req, prisma_1.AuditAction.DELETE_CABINET, req.params.id, {});
    res.json({ data: { ok: true } });
}));
router.post('/:id/unlock/:compId', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, locker_service_1.unlockCompartment)(req.params.id, req.params.compId);
    await auditCabinet(req, prisma_1.AuditAction.UNLOCK_COMPARTMENT, req.params.id, { compartmentId: req.params.compId });
    res.json({ data: { ok: true } });
}));
async function auditCabinet(req, action, resourceId, details) {
    if (!req.admin)
        return;
    await (0, audit_service_1.createAuditLog)({
        adminId: req.admin.id,
        action,
        resource: 'Cabinet',
        resourceId,
        details,
        ipAddress: req.ip,
    });
}
exports.default = router;
//# sourceMappingURL=cabinets.routes.js.map