import { z } from 'zod';
import { ActivityType } from '@prisma/client';

export const activityQuerySchema = z.object({
  cityId: z.string().trim().optional(),
  type: z.nativeEnum(ActivityType).optional(),
  q: z.string().trim().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ActivityQueryInput = z.infer<typeof activityQuerySchema>;
