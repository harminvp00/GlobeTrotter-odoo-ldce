import { Router } from 'express';
import authRoutes from './auth.routes';
import tripRoutes from './trip.routes';
import cityRoutes from './city.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Trips Module Routes
router.use('/trips', tripRoutes);

// Cities Module Routes
router.use('/cities', cityRoutes);

export default router;
