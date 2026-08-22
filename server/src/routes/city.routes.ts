import { Router } from 'express';
import { cityController } from '../controllers/city.controller';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { cityQuerySchema } from '../schemas/city.schema';

const router = Router();

router.get(
  '/',
  validate({ query: cityQuerySchema }),
  asyncHandler((req, res) => cityController.getCities(req, res))
);

export default router;
