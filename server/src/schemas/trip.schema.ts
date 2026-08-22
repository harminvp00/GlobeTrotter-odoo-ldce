import { z } from 'zod';

export const createTripSchema = z
  .object({
    name: z.string().trim().min(1, 'Trip name is required'),
    description: z.string().trim().optional(),
    startDate: z.coerce.date({ message: 'Invalid start date format' }),
    endDate: z.coerce.date({ message: 'Invalid end date format' }),
    budget: z.coerce.number().min(0, 'Budget cannot be negative').optional(),
    currency: z.string().trim().default('INR'),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).default('PRIVATE'),
    coverPhoto: z.string().trim().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'startDate must be less than or equal to endDate',
    path: ['endDate'],
  });

export const updateTripSchema = z
  .object({
    name: z.string().trim().min(1, 'Trip name cannot be empty').optional(),
    description: z.string().trim().optional(),
    startDate: z.coerce.date({ message: 'Invalid start date format' }).optional(),
    endDate: z.coerce.date({ message: 'Invalid end date format' }).optional(),
    budget: z.coerce.number().min(0, 'Budget cannot be negative').optional(),
    currency: z.string().trim().optional(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
    coverPhoto: z.string().trim().optional(),
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

export const tripParamsSchema = z.object({
  id: z.string().trim().min(1, 'Trip ID is required'),
});

export const tripQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
  search: z.string().trim().optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type TripParamsInput = z.infer<typeof tripParamsSchema>;
export type TripQueryInput = z.infer<typeof tripQuerySchema>;
