import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

export const ADMIN_ROLES = ['SUPER_ADMIN', 'CABINET_ADMIN'] as const;

declare module 'express' {
  interface Request {
    admin?: { id: string; email: string; role: string };
  }
}

function readAdminFromRequest(req: Request): { id: string; email: string; role: string } {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw UnauthorizedError('Missing token');
  }

  const payload = verifyToken(auth.slice(7), process.env.JWT_SECRET || '');
  if (!payload.sub || !payload.email || !payload.role) {
    throw UnauthorizedError('Invalid token');
  }

  const role = String(payload.role);
  if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    throw ForbiddenError('Admin role required');
  }

  return { id: payload.sub, email: String(payload.email), role };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    req.admin = readAdminFromRequest(req);
    next();
  } catch {
    next(UnauthorizedError('Invalid token'));
  }
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    req.admin = readAdminFromRequest(req);
    if (req.admin.role !== 'SUPER_ADMIN') {
      return next(ForbiddenError('Super admin role required'));
    }
    return next();
  } catch {
    return next(UnauthorizedError('Invalid token'));
  }
}

export async function requireCabinetAccess(req: Request, _res: Response, next: NextFunction) {
  try {
    req.admin = readAdminFromRequest(req);
    if (req.admin.role === 'SUPER_ADMIN') return next();
    const cabinetId = req.params.id || req.params.cabinetId;
    if (!cabinetId) return next(ForbiddenError('Cabinet ID required'));
    const assigned = await prisma.adminCabinet.findUnique({
      where: { adminId_cabinetId: { adminId: req.admin.id, cabinetId } },
    });
    if (!assigned) return next(ForbiddenError('Không có quyền trên cabinet này'));
    next();
  } catch {
    next(UnauthorizedError('Invalid token'));
  }
}
