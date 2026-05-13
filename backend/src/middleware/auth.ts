import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';

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

  return { id: payload.sub, email: String(payload.email), role: String(payload.role) };
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
