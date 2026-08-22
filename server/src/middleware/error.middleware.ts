import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public details?: any[];

  constructor(message: string, statusCode: number = 400, details?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      error: 'Validation error',
      details,
    });
    return;
  }

  if (err instanceof AppError) {
    const response: { error: string; details?: any[] } = {
      error: err.message,
    };
    if (err.details) {
      response.details = err.details;
    }
    res.status(err.statusCode).json(response);
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
};
