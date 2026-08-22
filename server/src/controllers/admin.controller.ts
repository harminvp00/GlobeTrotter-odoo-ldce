import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';
import { AdminUserQueryInput } from '../schemas/admin.schema';

export class AdminController {
  async getOverview(_req: Request, res: Response): Promise<void> {
    const overview = await adminService.getOverview();
    sendSuccess(res, overview, 'Admin overview stats retrieved successfully', 200);
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as AdminUserQueryInput;
    const result = await adminService.getUsers(query);
    res.status(200).json({
      data: result.users,
      meta: result.pagination,
    });
  }

  async getPopularCities(_req: Request, res: Response): Promise<void> {
    const cities = await adminService.getPopularCities();
    sendSuccess(res, cities, 'Popular cities retrieved successfully', 200);
  }

  async getPopularActivities(_req: Request, res: Response): Promise<void> {
    const activities = await adminService.getPopularActivities();
    sendSuccess(res, activities, 'Popular activities retrieved successfully', 200);
  }
}

export const adminController = new AdminController();
