"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = void 0;
exports.requireAdmin = requireAdmin;
exports.requireSuperAdmin = requireSuperAdmin;
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
exports.ADMIN_ROLES = ['SUPER_ADMIN', 'CABINET_ADMIN'];
function readAdminFromRequest(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        throw (0, errors_1.UnauthorizedError)('Missing token');
    }
    const payload = (0, jwt_1.verifyToken)(auth.slice(7), process.env.JWT_SECRET || '');
    if (!payload.sub || !payload.email || !payload.role) {
        throw (0, errors_1.UnauthorizedError)('Invalid token');
    }
    const role = String(payload.role);
    if (!exports.ADMIN_ROLES.includes(role)) {
        throw (0, errors_1.ForbiddenError)('Admin role required');
    }
    return { id: payload.sub, email: String(payload.email), role };
}
function requireAdmin(req, _res, next) {
    try {
        req.admin = readAdminFromRequest(req);
        next();
    }
    catch {
        next((0, errors_1.UnauthorizedError)('Invalid token'));
    }
}
function requireSuperAdmin(req, _res, next) {
    try {
        req.admin = readAdminFromRequest(req);
        if (req.admin.role !== 'SUPER_ADMIN') {
            return next((0, errors_1.ForbiddenError)('Super admin role required'));
        }
        return next();
    }
    catch {
        return next((0, errors_1.UnauthorizedError)('Invalid token'));
    }
}
//# sourceMappingURL=auth.js.map