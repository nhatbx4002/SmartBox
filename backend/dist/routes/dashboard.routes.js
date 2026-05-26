"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const dashboard_service_1 = require("../services/dashboard.service");
const router = (0, express_1.Router)();
router.get('/stats', auth_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json({ data: await (0, dashboard_service_1.getDashboardStats)() });
}));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map