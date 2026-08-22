import { z } from 'zod';

export const createStopActivitySchema = z
  .object({
    activityId: z.string().trim().min(1, 'activityId is required'),
    date: z.coerce.date({ message: 'Invalid date format' }),
    startTime: z.coerce.date({ message: 'Invalid startTime format' }).optional(),
    endTime: z.coerce.date({ message: 'Invalid endTime format' }).optional(),
    order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
    customCost: z.coerce.number().min(0, 'customCost cannot be negative').optional(),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime <= data.endTime;
      }
      return true;
    },
    {
      message: 'startTime must be less than or equal to endTime',
      path: ['endTime'],
    }
  );

export const updateStopActivitySchema = z
  .object({
    activityId: z.string().trim().min(1, 'activityId cannot be empty').optional(),
    date: z.coerce.date({ message: 'Invalid date format' }).optional(),
    startTime: z.coerce.date({ message: 'Invalid startTime format' }).optional(),
    endTime: z.coerce.date({ message: 'Invalid endTime format' }).optional(),
    order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
    customCost: z.coerce.number().min(0, 'customCost cannot be negative').optional(),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime <= data.endTime;
      }
      return true;
    },
    {
      message: 'startTime must be less than or equal to endTime',
      path: ['endTime'],
    }
  );

export type CreateStopActivityInput = z.infer<typeof createStopActivitySchema>;
export type UpdateStopActivityInput = z.infer<typeof updateStopActivitySchema>;
