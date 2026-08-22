import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import cityRoutes from './city.routes';
import activityRoutes from './activity.routes';
import stopActivityRoutes from './stopActivity.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Trips Module Routes (including /trips/:tripId/stops)
router.use('/trips', tripRoutes);

// Cities Module Routes
router.use('/cities', cityRoutes);

// Activities Module Routes
router.use('/activities', activityRoutes);

// Stop Activities Module Routes (/api/stops/:stopId/activities)
router.use('/stops/:stopId/activities', stopActivityRoutes);

export default router;
