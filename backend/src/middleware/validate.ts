import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((error) => error.message).join(', ');
      return res.status(400).json({ error: { code: 'VALIDATION', message } });
    }

    req.body = result.data;
    return next();
  };
}
