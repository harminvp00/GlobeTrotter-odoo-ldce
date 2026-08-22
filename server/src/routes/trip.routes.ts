import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createTripSchema,
  updateTripSchema,
  tripParamsSchema,
  tripQuerySchema,
} from '../schemas/trip.schema';

const router = Router();

// All trip routes require authentication
router.use(authenticate);

router.post(
  '/',
  validate({ body: createTripSchema }),
  asyncHandler((req, res) => tripController.createTrip(req, res))
);

router.get(
  '/',
  validate({ query: tripQuerySchema }),
  asyncHandler((req, res) => tripController.getTrips(req, res))
);

router.get(
  '/:id',
  validate({ params: tripParamsSchema }),
  asyncHandler((req, res) => tripController.getTripById(req, res))
);

router.patch(
  '/:id',
  validate({ params: tripParamsSchema, body: updateTripSchema }),
  asyncHandler((req, res) => tripController.updateTrip(req, res))
);

router.delete(
  '/:id',
  validate({ params: tripParamsSchema }),
  asyncHandler((req, res) => tripController.deleteTrip(req, res))
);

export default router;
