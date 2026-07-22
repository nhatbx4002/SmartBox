import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '../lib/errors';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            req[source] = schema.parse(req[source]);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                next(new BadRequestError(err.errors.map((e) => e.message).join('; ')));
            } else {
                next(err);
            }
        }
    };
}