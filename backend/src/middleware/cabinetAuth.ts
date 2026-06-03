import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';

declare module 'express' {
  interface Request {
    cabinet?: { id: string };
  }
}

export function requireCabinet(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw UnauthorizedError('Missing cabinet token');
    }

    const payload = verifyToken(auth.slice(7), process.env.JWT_SECRET || '');
    if (!payload.sub || payload.type !== 'CABINET') {
      throw UnauthorizedError('Invalid cabinet token');
    }

    req.cabinet = { id: String(payload.sub) };
    next();
  } catch {
    next(UnauthorizedError('Invalid cabinet token'));
  }
}
