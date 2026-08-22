import { Router } from 'express';
import { stopController } from '../controllers/stop.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { createStopSchema, updateStopSchema } from '../schemas/stop.schema';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  validate({ body: createStopSchema }),
  asyncHandler((req, res) => stopController.createStop(req, res))
);

router.get(
  '/',
  asyncHandler((req, res) => stopController.getStops(req, res))
);

router.patch(
  '/:stopId',
  validate({ body: updateStopSchema }),
  asyncHandler((req, res) => stopController.updateStop(req, res))
);

router.delete(
  '/:stopId',
  asyncHandler((req, res) => stopController.deleteStop(req, res))
);

router.post(
  '/:stopId/activities',
  asyncHandler((req, res) => stopController.assignActivity(req, res))
);

router.delete(
  '/:stopId/activities/:stopActivityId',
  asyncHandler((req, res) => stopController.unassignActivity(req, res))
);

export default router;
