import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import stopActivityRoutes from './stopActivity.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Trips Module Routes (including /trips/:tripId/stops and /trips/:tripId/expenses)
router.use('/trips', tripRoutes);

// Stop Activities Module Routes (/api/stops/:stopId/activities)
router.use('/stops/:stopId/activities', stopActivityRoutes);

// Dashboard Module Routes (/api/dashboard)
router.use('/dashboard', dashboardRoutes);

export default router;
