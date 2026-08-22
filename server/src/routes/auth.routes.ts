import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post(
  '/register',
  asyncHandler((req, res) => authController.register(req, res))
);

router.post(
  '/login',
  asyncHandler((req, res) => authController.login(req, res))
);

router.post(
  '/logout',
  authenticate,
  asyncHandler((req, res) => authController.logout(req, res))
);

router.get(
  '/me',
  authenticate,
  asyncHandler((req, res) => authController.me(req, res))
);

router.post(
  '/forgot-password',
  asyncHandler((req, res) => authController.forgotPassword(req, res))
);

router.post(
  '/reset-password',
  asyncHandler((req, res) => authController.resetPassword(req, res))
);

export default router;
