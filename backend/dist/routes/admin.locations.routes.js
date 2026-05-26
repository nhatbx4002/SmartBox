"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const prisma_2 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const audit_service_1 = require("../services/audit.service");
const router = (0, express_1.Router)();
const locationCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    googlePlaceId: zod_1.z.string().min(1).optional(),
    mapImageUrl: zod_1.z.string().min(1).optional(),
    status: zod_1.z.nativeEnum(prisma_1.LocationStatus).optional(),
});
const locationUpdateSchema = locationCreateSchema.partial();
router.get('/', auth_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = req.query.status?.toString();
    const locations = await prisma_2.prisma.location.findMany({
        where: status ? { status } : undefined,
        include: { _count: { select: { cabinets: true } } },
        orderBy: { name: 'asc' },
    });
    res.json({ data: locations });
}));
router.post('/', auth_1.requireSuperAdmin, (0, validate_1.validate)(locationCreateSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const location = await prisma_2.prisma.location.create({ data: req.body });
    await auditLocation(req, prisma_1.AuditAction.CREATE_LOCATION, location.id, req.body);
    res.status(201).json({ data: location });
}));
router.put('/:id', auth_1.requireSuperAdmin, (0, validate_1.validate)(locationUpdateSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await ensureLocation(req.params.id);
    const location = await prisma_2.prisma.location.update({ where: { id: req.params.id }, data: req.body });
    await auditLocation(req, prisma_1.AuditAction.UPDATE_LOCATION, location.id, req.body);
    res.json({ data: location });
}));
router.delete('/:id', auth_1.requireSuperAdmin, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await ensureLocation(req.params.id);
    const location = await prisma_2.prisma.location.update({
        where: { id: req.params.id },
        data: { status: prisma_1.LocationStatus.INACTIVE },
    });
    await auditLocation(req, prisma_1.AuditAction.DELETE_LOCATION, location.id, { status: prisma_1.LocationStatus.INACTIVE });
    res.json({ data: { ok: true } });
}));
async function ensureLocation(id) {
    const location = await prisma_2.prisma.location.findUnique({ where: { id } });
    if (!location)
        throw (0, errors_1.NotFoundError)('Location not found');
    return location;
}
async function auditLocation(req, action, resourceId, details) {
    if (!req.admin)
        return;
    await (0, audit_service_1.createAuditLog)({
        adminId: req.admin.id,
        action,
        resource: 'Location',
        resourceId,
        details,
        ipAddress: req.ip,
    });
}
exports.default = router;
//# sourceMappingURL=admin.locations.routes.js.map