import { NextFunction, Request, Response } from 'express';
declare module 'express' {
    interface Request {
        admin?: {
            id: string;
            email: string;
            role: string;
        };
    }
}
export declare function requireAdmin(req: Request, _res: Response, next: NextFunction): void;
export declare function requireSuperAdmin(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map