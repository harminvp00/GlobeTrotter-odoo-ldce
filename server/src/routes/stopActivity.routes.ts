import { Router } from 'express';
import { stopActivityController } from '../controllers/stopActivity.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { createStopActivitySchema, updateStopActivitySchema } from '../schemas/stopActivity.schema';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  validate({ body: createStopActivitySchema }),
  asyncHandler((req, res) => stopActivityController.assignActivity(req, res))
);

router.get(
  '/',
  asyncHandler((req, res) => stopActivityController.getStopActivities(req, res))
);

router.patch(
  '/:activityId',
  validate({ body: updateStopActivitySchema }),
  asyncHandler((req, res) => stopActivityController.updateStopActivity(req, res))
);

router.delete(
  '/:activityId',
  asyncHandler((req, res) => stopActivityController.deleteStopActivity(req, res))
);

export default router;
