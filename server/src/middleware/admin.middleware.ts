import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new AppError('Forbidden: Admin access required', 403);
  }
  next();
};
