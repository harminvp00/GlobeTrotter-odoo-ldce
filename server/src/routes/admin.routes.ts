import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { adminUserQuerySchema } from '../schemas/admin.schema';

const router = Router();

// All admin endpoints require valid JWT AND admin role
router.use(authenticate);
router.use(requireAdmin);

router.get(
  '/overview',
  asyncHandler((req, res) => adminController.getOverview(req, res))
);

router.get(
  '/users',
  validate({ query: adminUserQuerySchema }),
  asyncHandler((req, res) => adminController.getUsers(req, res))
);

router.get(
  '/popular-cities',
  asyncHandler((req, res) => adminController.getPopularCities(req, res))
);

router.get(
  '/popular-activities',
  asyncHandler((req, res) => adminController.getPopularActivities(req, res))
);

export default router;
