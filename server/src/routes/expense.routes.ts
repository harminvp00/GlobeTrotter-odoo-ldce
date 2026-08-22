import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
} from '../schemas/expense.schema';

const router = Router({ mergeParams: true });

router.use(authenticate);

// Financial Summary Route (Registered before /:expenseId parameter route)
router.get(
  '/summary',
  asyncHandler((req, res) => expenseController.getExpenseSummary(req, res))
);

router.post(
  '/',
  validate({ body: createExpenseSchema }),
  asyncHandler((req, res) => expenseController.createExpense(req, res))
);

router.get(
  '/',
  validate({ query: expenseQuerySchema }),
  asyncHandler((req, res) => expenseController.getExpenses(req, res))
);

router.patch(
  '/:expenseId',
  validate({ body: updateExpenseSchema }),
  asyncHandler((req, res) => expenseController.updateExpense(req, res))
);

router.delete(
  '/:expenseId',
  asyncHandler((req, res) => expenseController.deleteExpense(req, res))
);

export default router;
