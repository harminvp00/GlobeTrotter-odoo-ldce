import { z } from 'zod';

export const createStopSchema = z
  .object({
    cityId: z.string().trim().min(1, 'cityId is required'),
    startDate: z.coerce.date({ message: 'Invalid start date format' }),
    endDate: z.coerce.date({ message: 'Invalid end date format' }),
    order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
    notes: z.string().trim().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'startDate must be less than or equal to endDate',
    path: ['endDate'],
  });

export const updateStopSchema = z
  .object({
    cityId: z.string().trim().min(1, 'cityId cannot be empty').optional(),
    startDate: z.coerce.date({ message: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ message: 'Invalid end date format' }).optional(),
    order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: 'startDate must be less than or equal to endDate',
      path: ['endDate'],
    }
  );

export const stopParamsSchema = z.object({
  tripId: z.string().trim().min(1, 'tripId is required'),
  stopId: z.string().trim().min(1, 'stopId is required').optional(),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type StopParamsInput = z.infer<typeof stopParamsSchema>;
