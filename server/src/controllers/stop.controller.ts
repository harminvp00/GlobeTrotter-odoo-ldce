import { Request, Response } from 'express';
import { stopService } from '../services/stop.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class StopController {
  async createStop(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const stop = await stopService.createStop(tripId, req.user.id, req.body);
    sendSuccess(res, stop, 'Stop added successfully', 201);
  }

  async getStops(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const stops = await stopService.getStops(tripId, req.user.id);
    sendSuccess(res, stops, undefined, 200);
  }

  async updateStop(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const stopId = req.params.stopId as string;
    const stop = await stopService.updateStop(tripId, stopId, req.user.id, req.body);
    sendSuccess(res, stop, 'Stop updated successfully', 200);
  }

  async deleteStop(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const stopId = req.params.stopId as string;
    const result = await stopService.deleteStop(tripId, stopId, req.user.id);
    sendSuccess(res, null, result.message, 200);
  }
}

export const stopController = new StopController();
