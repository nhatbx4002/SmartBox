"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const audit_service_1 = require("../services/audit.service");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const logs = await (0, audit_service_1.listAuditLogs)({
        adminId: req.query.adminId?.toString(),
        action: req.query.action?.toString(),
        resource: req.query.resource?.toString(),
        startDate: req.query.startDate?.toString(),
        endDate: req.query.endDate?.toString(),
        page: Number.isFinite(page) ? page : undefined,
        limit: Number.isFinite(limit) ? limit : undefined,
    });
    res.json({ data: logs });
}));
exports.default = router;
//# sourceMappingURL=audit.routes.js.map