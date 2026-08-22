import { Request, Response } from 'express';
import { expenseService } from '../services/expense.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class ExpenseController {
  async createExpense(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const expense = await expenseService.createExpense(tripId, req.user.id, req.body);
    sendSuccess(res, expense, 'Expense logged successfully', 201);
  }

  async getExpenses(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const expenses = await expenseService.getExpenses(tripId, req.user.id, req.query as any);
    sendSuccess(res, expenses, undefined, 200);
  }

  async getExpenseSummary(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const summary = await expenseService.getExpenseSummary(tripId, req.user.id);
    sendSuccess(res, summary, undefined, 200);
  }

  async updateExpense(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const expenseId = req.params.expenseId as string;
    const updated = await expenseService.updateExpense(tripId, expenseId, req.user.id, req.body);
    sendSuccess(res, updated, 'Expense updated successfully', 200);
  }

  async deleteExpense(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User context missing', 401);
    }

    const tripId = req.params.tripId as string;
    const expenseId = req.params.expenseId as string;
    const result = await expenseService.deleteExpense(tripId, expenseId, req.user.id);
    sendSuccess(res, null, result.message, 200);
  }
}

export const expenseController = new ExpenseController();
