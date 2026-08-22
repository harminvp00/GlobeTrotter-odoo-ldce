import { Request, Response } from 'express';
import { stopActivityService } from '../services/stopActivity.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class StopActivityController {
  async assignActivity(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const stopId = req.params.stopId as string;
    const result = await stopActivityService.assignActivity(stopId, req.user.id, req.body);
    sendSuccess(res, result, 'Activity assigned successfully', 201);
  }

  async getStopActivities(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const stopId = req.params.stopId as string;
    const activities = await stopActivityService.getStopActivities(stopId, req.user.id);
    sendSuccess(res, activities, undefined, 200);
  }

  async updateStopActivity(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const stopId = req.params.stopId as string;
    const activityId = req.params.activityId as string;
    const updated = await stopActivityService.updateStopActivity(stopId, activityId, req.user.id, req.body);
    sendSuccess(res, updated, 'Assigned activity updated successfully', 200);
  }

  async deleteStopActivity(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const stopId = req.params.stopId as string;
    const activityId = req.params.activityId as string;
    const result = await stopActivityService.deleteStopActivity(stopId, activityId, req.user.id);
    sendSuccess(res, null, result.message, 200);
  }
}

export const stopActivityController = new StopActivityController();
