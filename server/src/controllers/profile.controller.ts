import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class ProfileController {
  async getProfile(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const user = await profileService.getProfile(req.user.id);
    sendSuccess(res, user, undefined, 200);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const user = await profileService.updateProfile(req.user.id, req.body);
    sendSuccess(res, user, 'Profile updated successfully', 200);
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const result = await profileService.deleteAccount(req.user.id);
    sendSuccess(res, null, result.message, 200);
  }

  async getPreferences(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const preferences = await profileService.getPreferences(req.user.id);
    sendSuccess(res, preferences, undefined, 200);
  }

  async updatePreferences(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const preferences = await profileService.updatePreferences(req.user.id, req.body);
    sendSuccess(res, preferences, 'Preferences updated successfully', 200);
  }

  async getSavedDestinations(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const saved = await profileService.getSavedDestinations(req.user.id);
    sendSuccess(res, saved, undefined, 200);
  }

  async addSavedDestination(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const cityId = req.body.cityId as string;
    const saved = await profileService.addSavedDestination(req.user.id, cityId);
    sendSuccess(res, saved, 'Destination saved successfully', 201);
  }

  async deleteSavedDestination(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const id = req.params.id as string;
    const result = await profileService.deleteSavedDestination(req.user.id, id);
    sendSuccess(res, null, result.message, 200);
  }
}

export const profileController = new ProfileController();
