import { z } from 'zod';

export const shareParamsSchema = z.object({
  shareSlug: z.string().trim().min(1, 'shareSlug is required'),
});

export const enableShareSchema = z.object({
  expiresAt: z.coerce.date().optional(),
});

export type ShareParamsInput = z.infer<typeof shareParamsSchema>;
export type EnableShareInput = z.infer<typeof enableShareSchema>;
