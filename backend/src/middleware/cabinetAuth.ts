import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors';
import { verifyCabinetToken } from '../lib/jwt';

declare module 'express' {
    interface Request {
        cabinet?: { cabinetId: string };
    }
}

export function requireCabinet(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return next(new UnauthorizedError('Missing cabinet token'));
    try {
        const payload = verifyCabinetToken(auth.slice(7));
        if (!payload.cabinetId) return next(new UnauthorizedError('Invalid cabinet token'));
        req.cabinet = { cabinetId: String(payload.cabinetId) };
        next();
    } catch { next(new UnauthorizedError('Invalid cabinet token')); }
}