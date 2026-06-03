"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
const auth_1 = require("../middleware/auth");
const cabinetAuth_1 = require("../middleware/cabinetAuth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const audit_service_1 = require("../services/audit.service");
const provisioning_service_1 = require("../services/provisioning.service");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    provisionKey: zod_1.z.string().min(1),
    provisionSecret: zod_1.z.string().optional(),
    provisionCode: zod_1.z.string().min(1).optional(),
    hardwareSerial: zod_1.z.string().min(1),
    deviceName: zod_1.z.string().min(1).optional(),
    discoveredMcpDevices: zod_1.z.array(zod_1.z.object({
        bus: zod_1.z.number().int().min(0).default(1),
        address: zod_1.z.number().int().min(0),
        name: zod_1.z.string().optional(),
    })),
    firmwareVersion: zod_1.z.string().optional(),
    piModel: zod_1.z.string().optional(),
});
const confirmSchema = zod_1.z.object({
    version: zod_1.z.number().int().min(1),
});
const provisioningConfigSchema = zod_1.z.object({
    strategy: zod_1.z.string().min(1).optional(),
    provisionKey: zod_1.z.string().min(1).optional(),
    provisionSecret: zod_1.z.string().nullable().optional(),
    webhookUrl: zod_1.z.string().url().nullable().optional(),
    isActive: zod_1.z.boolean().optional(),
});
router.post('/register', (0, validate_1.validate)(registerSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, provisioning_service_1.registerCabinet)(req.body);
    res.status(201).json({ data: result });
}));
router.get('/config', auth_1.requireSuperAdmin, (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json({ data: await (0, provisioning_service_1.getProvisioningConfig)() });
}));
router.put('/config', auth_1.requireSuperAdmin, (0, validate_1.validate)(provisioningConfigSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await (0, provisioning_service_1.upsertProvisioningConfig)(req.body);
    if (req.admin) {
        await (0, audit_service_1.createAuditLog)({
            adminId: req.admin.id,
            action: prisma_1.AuditAction.UPDATE_PROVISIONING_CONFIG,
            resource: 'ProvisioningConfig',
            resourceId: config.id,
            details: req.body,
            ipAddress: req.ip,
        });
    }
    res.json({ data: config });
}));
router.get('/cabinets', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const scope = resolveCabinetListScope(req);
    res.json({ data: await (0, provisioning_service_1.listProvisioningCabinets)(scope) });
}));
router.get('/config/:cabinetId', cabinetAuth_1.requireCabinet, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    assertCabinetParam(req);
    const version = req.query.version === undefined ? undefined : Number(req.query.version);
    res.json({ data: await (0, provisioning_service_1.getCabinetConfig)(req.params.cabinetId, Number.isNaN(version) ? undefined : version) });
}));
router.post('/config/:cabinetId/confirm', cabinetAuth_1.requireCabinet, (0, validate_1.validate)(confirmSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    assertCabinetParam(req);
    res.json({ data: await (0, provisioning_service_1.confirmCabinetConfig)(req.params.cabinetId, req.body.version) });
}));
function assertCabinetParam(req) {
    if (!req.params.cabinetId || req.cabinet?.id !== req.params.cabinetId) {
        throw (0, errors_1.ForbiddenError)('Cabinet token does not match requested cabinet');
    }
}
function resolveCabinetListScope(req) {
    const auth = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw (0, errors_1.UnauthorizedError)('Missing token');
    }
    try {
        const payload = (0, jwt_1.verifyToken)(auth.slice(7), process.env.JWT_SECRET || '');
        const requestedCabinetId = typeof req.query.cabinetId === 'string' ? req.query.cabinetId : undefined;
        if (payload.type === 'CABINET') {
            const cabinetId = String(payload.sub || '');
            if (!cabinetId)
                throw (0, errors_1.UnauthorizedError)('Invalid cabinet token');
            if (requestedCabinetId && requestedCabinetId !== cabinetId) {
                throw (0, errors_1.ForbiddenError)('Cabinet token does not match requested cabinet');
            }
            return { cabinetId };
        }
        const role = String(payload.role || '');
        if (auth_1.ADMIN_ROLES.includes(role)) {
            return { cabinetId: requestedCabinetId };
        }
    }
    catch (error) {
        if (error instanceof errors_1.AppError && error.status === 403) {
            throw error;
        }
    }
    throw (0, errors_1.UnauthorizedError)('Invalid token');
}
exports.default = router;
//# sourceMappingURL=provisioning.routes.js.map