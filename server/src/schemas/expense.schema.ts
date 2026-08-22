import { z } from 'zod';
import { ExpenseCategory } from '@prisma/client';

export const createExpenseSchema = z.object({
  tripStopId: z.string().trim().optional(),
  category: z.nativeEnum(ExpenseCategory, { message: 'Invalid expense category' }),
  description: z.string().trim().min(1, 'Description is required'),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  currency: z.string().trim().default('INR'),
  date: z.coerce.date({ message: 'Invalid date format' }),
});

export const updateExpenseSchema = z.object({
  tripStopId: z.string().trim().optional(),
  category: z.nativeEnum(ExpenseCategory, { message: 'Invalid expense category' }).optional(),
  description: z.string().trim().min(1, 'Description cannot be empty').optional(),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0').optional(),
  currency: z.string().trim().optional(),
  date: z.coerce.date({ message: 'Invalid date format' }).optional(),
});

export const expenseQuerySchema = z.object({
  category: z.nativeEnum(ExpenseCategory).optional(),
  tripStopId: z.string().trim().optional(),
  date: z.coerce.date().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
