export class AppError extends Error {
    statusCode:number;
    code?:string;

    constructor(message:string,statusCode=500, code?:string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, code?:string) {
        super(message,400,code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, code?:string) {
        super(message,401,code);
    }
}

export class ForbiddenError extends AppError {
    constructor(message:string, code?:string) {
        super(message,403,code);
    }
}

export class NotFoundError extends AppError {
    constructor(message:string, code?:string) {
        super(message,404,code);
    }
}

export class ConflictError extends AppError {
    constructor(message : string, code?: string) {
        super(message, 409, code);
    }
}
