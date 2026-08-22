import { Router } from 'express';
import { shareController } from '../controllers/share.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { shareParamsSchema } from '../schemas/share.schema';

const router = Router();

// Public Itinerary View (NO authentication required)
router.get(
  '/:shareSlug',
  validate({ params: shareParamsSchema }),
  asyncHandler((req, res) => shareController.getPublicTrip(req, res))
);

// Copy Shared Trip (Requires Authentication)
router.post(
  '/:shareSlug/copy',
  authenticate,
  validate({ params: shareParamsSchema }),
  asyncHandler((req, res) => shareController.copyTrip(req, res))
);

export default router;
