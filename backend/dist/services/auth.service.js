"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = adminLogin;
exports.refreshToken = refreshToken;
exports.verifyPin = verifyPin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../generated/prisma");
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
const prisma_2 = require("../lib/prisma");
async function adminLogin(email, password) {
    const admin = await prisma_2.prisma.admin.findUnique({ where: { email } });
    if (!admin)
        throw (0, errors_1.UnauthorizedError)('Invalid email or password');
    const valid = await bcrypt_1.default.compare(password, admin.passwordHash);
    if (!valid)
        throw (0, errors_1.UnauthorizedError)('Invalid email or password');
    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
        admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
        accessToken: (0, jwt_1.signToken)(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
        refreshToken: (0, jwt_1.signToken)(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    };
}
async function refreshToken(refreshTokenValue) {
    const payload = (0, jwt_1.verifyToken)(refreshTokenValue, requireEnv('JWT_REFRESH_SECRET'));
    if (!payload.sub || !payload.email || !payload.role) {
        throw (0, errors_1.UnauthorizedError)('Invalid refresh token');
    }
    return {
        accessToken: (0, jwt_1.signToken)({ sub: payload.sub, email: payload.email, role: payload.role }, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    };
}
async function verifyPin(code) {
    const rental = await prisma_2.prisma.rental.findUnique({
        where: { code },
        include: { compartment: { include: { cabinet: true, realtimeStatus: true } }, pricePlan: true, user: true },
    });
    if (!rental || rental.status !== prisma_1.RentalStatus.ACTIVE) {
        throw (0, errors_1.NotFoundError)('Rental not found');
    }
    const hashMatches = await bcrypt_1.default.compare(code, rental.codeHash);
    if (!hashMatches)
        throw (0, errors_1.UnauthorizedError)('Invalid code');
    if (rental.expiresAt < new Date()) {
        throw (0, errors_1.BadRequestError)('Rental expired');
    }
    if (rental.openCount >= rental.maxOpens) {
        throw (0, errors_1.BadRequestError)('Open limit reached');
    }
    return { authorized: true, rental, compartment: rental.compartment };
}
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`${name} is required`);
    return value;
}
//# sourceMappingURL=auth.service.js.map