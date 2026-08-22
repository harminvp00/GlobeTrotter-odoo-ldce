import { Request, Response } from 'express';
import { shareService } from '../services/share.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class ShareController {
  async getPublicTrip(req: Request, res: Response): Promise<void> {
    const shareSlug = req.params.shareSlug as string;
    const data = await shareService.getPublicTrip(shareSlug);
    sendSuccess(res, data, 'Shared trip retrieved successfully', 200);
  }

  async enableSharing(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const result = await shareService.enableSharing(tripId, req.user.id);
    sendSuccess(res, result, 'Trip sharing enabled successfully', 200);
  }

  async disableSharing(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const result = await shareService.disableSharing(tripId, req.user.id);
    sendSuccess(res, result, 'Trip sharing disabled successfully', 200);
  }

  async copyTrip(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const shareSlug = req.params.shareSlug as string;
    const newTrip = await shareService.copyTrip(shareSlug, req.user.id);
    sendSuccess(res, newTrip, 'Trip copied successfully', 201);
  }
}

export const shareController = new ShareController();
