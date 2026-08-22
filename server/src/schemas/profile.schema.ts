import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty').optional(),
  email: z.string().trim().email('Invalid email address').optional(),
});

export const updatePreferencesSchema = z.object({
  language: z.string().trim().min(1, 'Language cannot be empty').optional(),
});

export const createSavedDestinationSchema = z.object({
  cityId: z.string().trim().min(1, 'cityId is required'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type CreateSavedDestinationInput = z.infer<typeof createSavedDestinationSchema>;
