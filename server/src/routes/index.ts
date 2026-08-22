import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Trips Module Routes
router.use('/trips', tripRoutes);

export default router;
