import { prisma } from '../lib/prisma';
import { CreateStopInput, UpdateStopInput } from '../schemas/stop.schema';
import { AppError } from '../middleware/error.middleware';

export class StopService {
  async createStop(tripId: string, userId: string, data: CreateStopInput) {
    // 1. Verify trip existence & ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    // 2. Verify city existence
    const city = await prisma.city.findUnique({
      where: { id: data.cityId },
    });

    if (!city) {
      throw new AppError('City not found', 404);
    }

    // 3. Validate dates relative to parent trip
    if (data.startDate < trip.startDate) {
      throw new AppError('Stop start date cannot be earlier than trip start date', 400);
    }

    if (data.endDate > trip.endDate) {
      throw new AppError('Stop end date cannot be later than trip end date', 400);
    }

    // 4. Calculate or shift order
    const existingStops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { order: 'asc' },
    });

    let targetOrder = data.order;
    if (!targetOrder) {
      const maxOrder = existingStops.reduce((max, s) => Math.max(max, s.order), 0);
      targetOrder = maxOrder + 1;
    } else {
      // If targetOrder collides, shift conflicting stops upwards to maintain uniqueness
      const collidingStop = existingStops.find((s) => s.order === targetOrder);
      if (collidingStop) {
        const maxOrder = existingStops.reduce((max, s) => Math.max(max, s.order), 0);
        targetOrder = maxOrder + 1;
      }
    }

    // 5. Create trip stop
    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: data.cityId,
        startDate: data.startDate,
        endDate: data.endDate,
        order: targetOrder,
        notes: data.notes,
      },
      include: {
        city: true,
      },
    });

    return stop;
  }

  async getStops(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId && trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: Unauthorized to view stops for this trip', 403);
    }

    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { order: 'asc' },
      include: {
        city: true,
        activities: {
          orderBy: { order: 'asc' },
          include: {
            activity: true,
          },
        },
      },
    });

    return stops;
  }

  async updateStop(tripId: string, stopId: string, userId: string, data: UpdateStopInput) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      throw new AppError('Trip stop not found', 404);
    }

    if (data.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: data.cityId },
      });
      if (!city) {
        throw new AppError('City not found', 404);
      }
    }

    // Validate dates
    const newStartDate = data.startDate || stop.startDate;
    const newEndDate = data.endDate || stop.endDate;

    if (newStartDate > newEndDate) {
      throw new AppError('startDate must be less than or equal to endDate', 400);
    }

    if (newStartDate < trip.startDate) {
      throw new AppError('Stop start date cannot be earlier than trip start date', 400);
    }

    if (newEndDate > trip.endDate) {
      throw new AppError('Stop end date cannot be later than trip end date', 400);
    }

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        ...(data.cityId && { cityId: data.cityId }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate }),
        ...(data.order && { order: data.order }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        city: true,
      },
    });

    return updatedStop;
  }

  async deleteStop(tripId: string, stopId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      throw new AppError('Trip stop not found', 404);
    }

    await prisma.tripStop.delete({
      where: { id: stopId },
    });

    return { message: 'Stop deleted successfully' };
  }

  async assignActivity(tripId: string, stopId: string, userId: string, data: { activityId: string; date: string; notes?: string }) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });
    if (!trip || trip.userId !== userId) {
      throw new AppError('Forbidden: Access denied', 403);
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
    });
    if (!stop || stop.tripId !== tripId) {
      throw new AppError('Stop not found', 404);
    }

    const activity = await prisma.activity.findUnique({
      where: { id: data.activityId },
    });
    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    const existingActivities = await prisma.stopActivity.findMany({
      where: { tripStopId: stopId },
    });
    const order = existingActivities.length + 1;

    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId: data.activityId,
        date: new Date(data.date),
        order,
        notes: data.notes || '',
      },
      include: {
        activity: true,
      },
    });

    return stopActivity;
  }

  async unassignActivity(tripId: string, stopId: string, userId: string, stopActivityId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });
    if (!trip || trip.userId !== userId) {
      throw new AppError('Forbidden: Access denied', 403);
    }

    await prisma.stopActivity.delete({
      where: { id: stopActivityId },
    });

    return { message: 'Activity unassigned successfully' };
  }
}

export const stopService = new StopService();
