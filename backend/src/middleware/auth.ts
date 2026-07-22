import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { verifyAccessToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

export const ADMIN_ROLES = ['SUPER_ADMIN', 'CABINET_ADMIN'] as const;

declare module 'express' {
    interface Request {
        admin?: { id: string; email: string; role: string };
        user?: { id: string; phone: string };
    }
}

function readAdminFromRequest(req: Request) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedError('Missing token');
    const payload = verifyAccessToken(auth.slice(7));
    if (!payload.sub || !payload.email || !payload.role) throw new UnauthorizedError('Invalid token');
    if (!ADMIN_ROLES.includes(payload.role as typeof ADMIN_ROLES[number])) throw new ForbiddenError('Admin role required');
    return { id: payload.sub, email: String(payload.email), role: String(payload.role) };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
    try { req.admin = readAdminFromRequest(req); next(); }
    catch { next(new UnauthorizedError('Invalid token')); }
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
    try {
        req.admin = readAdminFromRequest(req);
        if (req.admin.role !== 'SUPER_ADMIN') return next(new ForbiddenError('Super admin role required'));
        next();
    } catch { next(new UnauthorizedError('Invalid token')); }
}

export async function requireCabinetAccess(req: Request, _res: Response, next: NextFunction) {
    try {
        req.admin = readAdminFromRequest(req);
        if (req.admin.role === 'SUPER_ADMIN') return next();
        const cabinetId = req.params.id || req.params.cabinetId;
        if (!cabinetId) return next(new ForbiddenError('Cabinet ID required'));
        const assigned = await prisma.adminCabinet.findUnique({
            where: { adminId_cabinetId: { adminId: req.admin.id, cabinetId } },
        });
        if (!assigned) return next(new ForbiddenError('No access to this cabinet'));
        next();
    } catch { next(new UnauthorizedError('Invalid token')); }
}

export function requireUser(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return next(new UnauthorizedError('Missing token'));

    try {
        const payload = verifyAccessToken(auth.slice(7));
        if (!payload.sub || !payload.phone) {
            return next(new UnauthorizedError('Invalid token'));
        }
        req.user = {
            id: String(payload.sub),
            phone: String(payload.phone),
        };
        next();
    } catch {
        next(new UnauthorizedError('Invalid token'));
    }
}
