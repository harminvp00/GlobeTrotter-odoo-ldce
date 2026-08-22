import { z } from 'zod';

export const cityQuerySchema = z.object({
  q: z.string().trim().optional(),
  country: z.string().trim().optional(),
  region: z.string().trim().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CityQueryInput = z.infer<typeof cityQuerySchema>;
