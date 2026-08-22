import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { CreateTripInput, UpdateTripInput, TripQueryInput } from '../schemas/trip.schema';
import { AppError } from '../middleware/error.middleware';

export class TripService {
  async createTrip(userId: string, data: CreateTripInput) {
    const shareSlug = crypto.randomBytes(8).toString('hex');

    const trip = await prisma.trip.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget !== undefined ? data.budget : null,
        currency: data.currency || 'INR',
        visibility: data.visibility || 'PRIVATE',
        coverPhoto: data.coverPhoto,
        shareSlug,
      },
    });

    return trip;
  }

  async getTrips(userId: string, query: TripQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (query.visibility) {
      where.visibility = query.visibility;
    }

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              stops: true,
              expenses: true,
            },
          },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      trips,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getTripById(tripId: string, currentUserId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
        stops: {
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
        },
        expenses: {
          orderBy: { date: 'asc' },
        },
        shares: true,
      },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    // Ownership & Visibility Check
    if (trip.userId !== currentUserId && trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: You do not have permission to view this trip', 403);
    }

    return trip;
  }

  async updateTrip(tripId: string, currentUserId: string, data: UpdateTripInput) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: true,
      },
    });

    if (!existingTrip) {
      throw new AppError('Trip not found', 404);
    }

    // Enforce Ownership
    if (existingTrip.userId !== currentUserId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    // Date validations
    const newStartDate = data.startDate || existingTrip.startDate;
    const newEndDate = data.endDate || existingTrip.endDate;

    if (newStartDate > newEndDate) {
      throw new AppError('startDate must be less than or equal to endDate', 400);
    }

    // Validate that existing stops remain within new trip dates
    if (existingTrip.stops.length > 0) {
      const invalidStops = existingTrip.stops.filter(
        (stop) => stop.startDate < newStartDate || stop.endDate > newEndDate
      );

      if (invalidStops.length > 0) {
        throw new AppError(
          'Cannot update trip dates: existing stops fall outside the new trip date range',
          400
        );
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.visibility !== undefined && { visibility: data.visibility }),
        ...(data.coverPhoto !== undefined && { coverPhoto: data.coverPhoto }),
      },
    });

    return updatedTrip;
  }

  async deleteTrip(tripId: string, currentUserId: string) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new AppError('Trip not found', 404);
    }

    // Enforce Ownership
    if (existingTrip.userId !== currentUserId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return { message: 'Trip deleted successfully' };
  }
}

export const tripService = new TripService();
