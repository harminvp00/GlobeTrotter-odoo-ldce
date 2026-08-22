import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Authentication Module Routes
router.use('/auth', authRoutes);

// Future module routes should be registered here:
// router.use('/profile', profileRoutes);
// router.use('/trips', tripRoutes);
// router.use('/dashboard', dashboardRoutes);
// router.use('/cities', cityRoutes);
// router.use('/activities', activityRoutes);
// router.use('/stops', stopRoutes);
// router.use('/expenses', expenseRoutes);
// router.use('/shares', shareRoutes);
// router.use('/admin', adminRoutes);

export default router;
