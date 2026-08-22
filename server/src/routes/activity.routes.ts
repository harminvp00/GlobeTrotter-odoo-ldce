import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { activityQuerySchema } from '../schemas/activity.schema';

const router = Router();

router.get(
  '/',
  validate({ query: activityQuerySchema }),
  asyncHandler((req, res) => activityController.getActivities(req, res))
);

export default router;
