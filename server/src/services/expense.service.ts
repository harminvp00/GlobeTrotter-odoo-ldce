import { ExpenseCategory, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateExpenseInput, UpdateExpenseInput, ExpenseQueryInput } from '../schemas/expense.schema';
import { AppError } from '../middleware/error.middleware';

export class ExpenseService {
  async createExpense(tripId: string, userId: string, data: CreateExpenseInput) {
    // 1. Verify parent trip & ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    // 2. If tripStopId is provided, verify it belongs to this trip
    if (data.tripStopId) {
      const stop = await prisma.tripStop.findFirst({
        where: { id: data.tripStopId, tripId },
      });
      if (!stop) {
        throw new AppError('Trip stop not found in this trip', 400);
      }
    }

    // 3. Create Expense
    const expense = await prisma.expense.create({
      data: {
        tripId,
        tripStopId: data.tripStopId || null,
        category: data.category,
        description: data.description,
        amount: data.amount,
        currency: data.currency || trip.currency || 'INR',
        date: data.date,
      },
      include: {
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    return expense;
  }

  async getExpenses(tripId: string, userId: string, query: ExpenseQueryInput) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId && trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: Unauthorized to view expenses for this trip', 403);
    }

    const where: Prisma.ExpenseWhereInput = {
      tripId,
    };

    if (query.category) {
      where.category = query.category;
    }

    if (query.tripStopId) {
      where.tripStopId = query.tripStopId;
    }

    if (query.date) {
      where.date = query.date;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' },
      ],
      include: {
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    return expenses;
  }

  async getExpenseSummary(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId && trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: Unauthorized to view expense summary for this trip', 403);
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
    });

    const tripBudget = trip.budget ? Number(trip.budget) : 0;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const remainingBudget = tripBudget - totalExpenses;
    const isOverBudget = trip.budget !== null && totalExpenses > tripBudget;

    const byCategory: Record<ExpenseCategory, number> = {
      TRANSPORT: 0,
      STAY: 0,
      ACTIVITY: 0,
      MEAL: 0,
      OTHER: 0,
    };

    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
    }

    return {
      tripId: trip.id,
      tripBudget,
      totalExpenses,
      remainingBudget,
      isOverBudget,
      currency: trip.currency,
      byCategory,
    };
  }

  async updateExpense(tripId: string, expenseId: string, userId: string, data: UpdateExpenseInput) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });

    if (!expense) {
      throw new AppError('Expense not found in this trip', 404);
    }

    if (data.tripStopId) {
      const stop = await prisma.tripStop.findFirst({
        where: { id: data.tripStopId, tripId },
      });
      if (!stop) {
        throw new AppError('Trip stop not found in this trip', 400);
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(data.tripStopId !== undefined && { tripStopId: data.tripStopId || null }),
        ...(data.category && { category: data.category }),
        ...(data.description && { description: data.description }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.currency && { currency: data.currency }),
        ...(data.date && { date: data.date }),
      },
      include: {
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    return updatedExpense;
  }

  async deleteExpense(tripId: string, expenseId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId },
    });

    if (!expense) {
      throw new AppError('Expense not found in this trip', 404);
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return { message: 'Expense deleted successfully' };
  }
}

export const expenseService = new ExpenseService();
