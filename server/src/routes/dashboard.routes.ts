import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  asyncHandler((req, res) => dashboardController.getDashboard(req, res))
);

export default router;
