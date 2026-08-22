import { Request, Response } from 'express';
import { activityService } from '../services/activity.service';
import { ActivityQueryInput } from '../schemas/activity.schema';

export class ActivityController {
  async getActivities(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ActivityQueryInput;
    const result = await activityService.getActivities(query);

    res.status(200).json({
      data: result.activities,
      meta: result.pagination,
    });
  }
}

export const activityController = new ActivityController();
