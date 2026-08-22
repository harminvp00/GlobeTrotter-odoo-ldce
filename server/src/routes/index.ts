import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import stopActivityRoutes from './stopActivity.routes';
import dashboardRoutes from './dashboard.routes';
import shareRoutes from './share.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Trips Module Routes (including /trips/:tripId/stops, /trips/:tripId/expenses, and /trips/:tripId/share)
router.use('/trips', tripRoutes);

// Stop Activities Module Routes (/api/stops/:stopId/activities)
router.use('/stops/:stopId/activities', stopActivityRoutes);

// Dashboard Module Routes (/api/dashboard)
router.use('/dashboard', dashboardRoutes);

// Public Sharing Module Routes (/api/shares)
router.use('/shares', shareRoutes);

export default router;
