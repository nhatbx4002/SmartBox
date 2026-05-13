"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const auth_service_1 = require("../services/auth.service");
const router = (0, express_1.Router)();
const adminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
const verifyPinSchema = zod_1.z.object({
    code: zod_1.z.string().length(6).regex(/^\d+$/),
    mode: zod_1.z.enum(['deposit', 'pickup']).optional(),
});
router.post('/admin/login', (0, validate_1.validate)(adminLoginSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.adminLogin)(req.body.email, req.body.password);
    res.json({ data: result });
}));
router.post('/refresh', (0, validate_1.validate)(refreshSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.refreshToken)(req.body.refreshToken);
    res.json({ data: result });
}));
router.post('/verify-pin', (0, validate_1.validate)(verifyPinSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.verifyPin)(req.body.code);
    res.json({ data: result });
}));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map