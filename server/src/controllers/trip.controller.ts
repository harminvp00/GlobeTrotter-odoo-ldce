import { Request, Response } from 'express';
import { tripService } from '../services/trip.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class TripController {
  async createTrip(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const trip = await tripService.createTrip(req.user.id, req.body);
    sendSuccess(res, trip, 'Trip created successfully', 201);
  }

  async getTrips(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const result = await tripService.getTrips(req.user.id, req.query as any);
    sendSuccess(res, result.trips, undefined, 200);
  }

  async getTripById(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.id as string;
    const trip = await tripService.getTripById(tripId, req.user.id);
    sendSuccess(res, trip, undefined, 200);
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.id as string;
    const updatedTrip = await tripService.updateTrip(tripId, req.user.id, req.body);
    sendSuccess(res, updatedTrip, 'Trip updated successfully', 200);
  }

  async deleteTrip(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.id as string;
    const result = await tripService.deleteTrip(tripId, req.user.id);
    sendSuccess(res, null, result.message, 200);
  }
}

export const tripController = new TripController();
