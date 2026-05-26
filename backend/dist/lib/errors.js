"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.BadRequestError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.AppError = AppError;
const NotFoundError = (message = 'Not found') => new AppError(404, 'NOT_FOUND', message);
exports.NotFoundError = NotFoundError;
const UnauthorizedError = (message = 'Unauthorized') => new AppError(401, 'UNAUTHORIZED', message);
exports.UnauthorizedError = UnauthorizedError;
const BadRequestError = (message = 'Bad request') => new AppError(400, 'BAD_REQUEST', message);
exports.BadRequestError = BadRequestError;
const ForbiddenError = (message = 'Forbidden') => new AppError(403, 'FORBIDDEN', message);
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=errors.js.map