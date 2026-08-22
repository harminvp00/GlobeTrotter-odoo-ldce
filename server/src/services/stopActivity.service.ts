import { prisma } from '../lib/prisma';
import { CreateStopActivityInput, UpdateStopActivityInput } from '../schemas/stopActivity.schema';
import { AppError } from '../middleware/error.middleware';

export class StopActivityService {
  async assignActivity(stopId: string, userId: string, data: CreateStopActivityInput) {
    // 1. Verify tripStop existence & ownership
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: {
        trip: true,
      },
    });

    if (!tripStop) {
      throw new AppError('Trip stop not found', 404);
    }

    if (tripStop.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    // 2. Verify activity existence
    const activity = await prisma.activity.findUnique({
      where: { id: data.activityId },
    });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    // 3. Verify activity belongs to stop city
    if (activity.cityId !== tripStop.cityId) {
      throw new AppError('Activity does not belong to the city of this trip stop', 400);
    }

    // 4. Validate date falls within stop dates
    if (data.date < tripStop.startDate || data.date > tripStop.endDate) {
      throw new AppError('Activity date must fall within trip stop dates', 400);
    }

    // 5. Order calculation
    let targetOrder = data.order;
    if (!targetOrder) {
      const existing = await prisma.stopActivity.findMany({
        where: { tripStopId: stopId },
      });
      const maxOrder = existing.reduce((max, a) => Math.max(max, a.order), 0);
      targetOrder = maxOrder + 1;
    }

    // 6. Create StopActivity record
    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId: data.activityId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        order: targetOrder,
        notes: data.notes,
        customCost: data.customCost,
      },
      include: {
        activity: true,
      },
    });

    return stopActivity;
  }

  async getStopActivities(stopId: string, userId: string) {
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: {
        trip: true,
      },
    });

    if (!tripStop) {
      throw new AppError('Trip stop not found', 404);
    }

    if (tripStop.trip.userId !== userId && tripStop.trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: Unauthorized to view activities for this trip stop', 403);
    }

    const activities = await prisma.stopActivity.findMany({
      where: { tripStopId: stopId },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
        { order: 'asc' },
      ],
      include: {
        activity: true,
      },
    });

    return activities;
  }

  async updateStopActivity(stopId: string, activityId: string, userId: string, data: UpdateStopActivityInput) {
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: {
        trip: true,
      },
    });

    if (!tripStop) {
      throw new AppError('Trip stop not found', 404);
    }

    if (tripStop.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const stopActivity = await prisma.stopActivity.findFirst({
      where: { id: activityId, tripStopId: stopId },
    });

    if (!stopActivity) {
      throw new AppError('Assigned activity not found for this trip stop', 404);
    }

    if (data.activityId) {
      const newActivity = await prisma.activity.findUnique({
        where: { id: data.activityId },
      });
      if (!newActivity) {
        throw new AppError('Activity not found', 404);
      }
      if (newActivity.cityId !== tripStop.cityId) {
        throw new AppError('Activity does not belong to the city of this trip stop', 400);
      }
    }

    const newDate = data.date || stopActivity.date;
    if (newDate < tripStop.startDate || newDate > tripStop.endDate) {
      throw new AppError('Activity date must fall within trip stop dates', 400);
    }

    const newStart = data.startTime !== undefined ? data.startTime : stopActivity.startTime;
    const newEnd = data.endTime !== undefined ? data.endTime : stopActivity.endTime;

    if (newStart && newEnd && newStart > newEnd) {
      throw new AppError('startTime must be less than or equal to endTime', 400);
    }

    const updated = await prisma.stopActivity.update({
      where: { id: activityId },
      data: {
        ...(data.activityId && { activityId: data.activityId }),
        ...(data.date && { date: data.date }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.order && { order: data.order }),
        ...(data.customCost !== undefined && { customCost: data.customCost }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        activity: true,
      },
    });

    return updated;
  }

  async deleteStopActivity(stopId: string, activityId: string, userId: string) {
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: {
        trip: true,
      },
    });

    if (!tripStop) {
      throw new AppError('Trip stop not found', 404);
    }

    if (tripStop.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const stopActivity = await prisma.stopActivity.findFirst({
      where: { id: activityId, tripStopId: stopId },
    });

    if (!stopActivity) {
      throw new AppError('Assigned activity not found for this trip stop', 404);
    }

    await prisma.stopActivity.delete({
      where: { id: activityId },
    });

    return { message: 'Assigned activity removed successfully' };
  }
}

export const stopActivityService = new StopActivityService();
