import { NextFunction, Request, Response } from 'express';
export declare function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=asyncHandler.d.ts.map