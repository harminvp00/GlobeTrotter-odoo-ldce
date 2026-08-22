import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class DashboardController {
  async getDashboard(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const data = await dashboardService.getDashboardData(req.user.id);
    sendSuccess(res, data, 'Dashboard data retrieved successfully', 200);
  }
}

export const dashboardController = new DashboardController();
