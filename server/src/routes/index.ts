import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import cityRoutes from './city.routes';
import activityRoutes from './activity.routes';
import stopActivityRoutes from './stopActivity.routes';
import dashboardRoutes from './dashboard.routes';
import shareRoutes from './share.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Profile & Settings Module Routes (/api/profile)
router.use('/profile', profileRoutes);

// Cities Discovery Module Routes (/api/cities)
router.use('/cities', cityRoutes);

// Activities Discovery Module Routes (/api/activities)
router.use('/activities', activityRoutes);

// Trips Module Routes (including /trips/:tripId/stops, /trips/:tripId/expenses, and /trips/:tripId/share)
router.use('/trips', tripRoutes);

// Stop Activities Module Routes (/api/stops/:stopId/activities)
router.use('/stops/:stopId/activities', stopActivityRoutes);

// Dashboard Module Routes (/api/dashboard)
router.use('/dashboard', dashboardRoutes);

// Public Sharing Module Routes (/api/shares)
router.use('/shares', shareRoutes);

// Admin / Analytics Module Routes (/api/admin)
router.use('/admin', adminRoutes);

export default router;
