export declare class AppError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string);
}
export declare const NotFoundError: (message?: string) => AppError;
export declare const UnauthorizedError: (message?: string) => AppError;
export declare const BadRequestError: (message?: string) => AppError;
export declare const ForbiddenError: (message?: string) => AppError;
//# sourceMappingURL=errors.d.ts.map