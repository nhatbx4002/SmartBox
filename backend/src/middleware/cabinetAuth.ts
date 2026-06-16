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

    const token = auth.slice(7);
    const secret = process.env.JWT_SECRET || '';
    console.log(`[CABINET AUTH] secret="${secret}", token="${token.slice(0, 20)}..."`);
    const payload = verifyToken(token, secret);
    console.log(`[CABINET AUTH] payload=${JSON.stringify(payload)}`);
    if (!payload.sub || payload.type !== 'CABINET') {
      throw UnauthorizedError('Invalid cabinet token');
    }

    req.cabinet = { id: String(payload.sub) };
    next();
  } catch {
    next(UnauthorizedError('Invalid cabinet token'));
  }
}
