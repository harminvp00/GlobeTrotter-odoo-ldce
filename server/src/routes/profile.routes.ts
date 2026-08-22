import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  createSavedDestinationSchema,
} from '../schemas/profile.schema';

const router = Router();

router.use(authenticate);

// Profile CRUD
router.get(
  '/',
  asyncHandler((req, res) => profileController.getProfile(req, res))
);

router.patch(
  '/',
  validate({ body: updateProfileSchema }),
  asyncHandler((req, res) => profileController.updateProfile(req, res))
);

router.delete(
  '/',
  asyncHandler((req, res) => profileController.deleteAccount(req, res))
);

// Preferences
router.get(
  '/preferences',
  asyncHandler((req, res) => profileController.getPreferences(req, res))
);

router.patch(
  '/preferences',
  validate({ body: updatePreferencesSchema }),
  asyncHandler((req, res) => profileController.updatePreferences(req, res))
);

// Saved Destinations
router.get(
  '/saved-destinations',
  asyncHandler((req, res) => profileController.getSavedDestinations(req, res))
);

router.post(
  '/saved-destinations',
  validate({ body: createSavedDestinationSchema }),
  asyncHandler((req, res) => profileController.addSavedDestination(req, res))
);

router.delete(
  '/saved-destinations/:id',
  asyncHandler((req, res) => profileController.deleteSavedDestination(req, res))
);

export default router;
