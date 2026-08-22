import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';
import { AppError } from '../middleware/error.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);

      res.status(201).json({
        message: 'User registered successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { token, user } = await authService.login(validatedData);

      res.status(200).json({
        message: 'Login successful',
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Unauthorized: User context missing', 401);
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(validatedData);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(validatedData);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
