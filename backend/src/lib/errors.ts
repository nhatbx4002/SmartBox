export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const NotFoundError = (message = 'Not found') => new AppError(404, 'NOT_FOUND', message);
export const UnauthorizedError = (message = 'Unauthorized') => new AppError(401, 'UNAUTHORIZED', message);
export const BadRequestError = (message = 'Bad request') => new AppError(400, 'BAD_REQUEST', message);
export const ForbiddenError = (message = 'Forbidden') => new AppError(403, 'FORBIDDEN', message);
