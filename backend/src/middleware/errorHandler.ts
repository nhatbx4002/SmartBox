import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ error: { code: error.code, message: error.message } });
  }

  console.error('[Unhandled Error]', error);
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'Server error' } });
}
