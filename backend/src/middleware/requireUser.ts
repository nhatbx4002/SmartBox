import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';

export type UserAuthContext = {
  id: string;
  phone: string;
  email: string | null;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserAuthContext;
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function readUserFromRequest(req: Request): UserAuthContext {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw UnauthorizedError('Missing token');
  }

  const payload = verifyToken(auth.slice(7), requireEnv('JWT_SECRET'));
  if (!payload.sub || !payload.phone) {
    throw UnauthorizedError('Invalid token');
  }

  return {
    id: String(payload.sub),
    phone: String(payload.phone),
    email: payload.email ? String(payload.email) : null,
  };
}

export function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    req.user = readUserFromRequest(req);
    next();
  } catch {
    next(UnauthorizedError('Invalid token'));
  }
}
