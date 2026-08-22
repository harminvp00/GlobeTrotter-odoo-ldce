import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class ShareService {
  async getPublicTrip(shareSlug: string) {
    const trip = await prisma.trip.findFirst({
      where: {
        shareSlug,
      },
      include: {
        user: {
          select: { name: true },
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
      },
    });

    if (!trip) {
      throw new AppError('Shared trip not found', 404);
    }

    if (trip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: This trip is private', 403);
    }

    return {
      id: trip.id,
      tripName: trip.name,
      description: trip.description,
      creator: trip.user.name || 'Anonymous Traveler',
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget ? Number(trip.budget) : 0,
      currency: trip.currency,
      stops: trip.stops.map((stop) => ({
        id: stop.id,
        order: stop.order,
        startDate: stop.startDate,
        endDate: stop.endDate,
        notes: stop.notes,
        city: {
          id: stop.city.id,
          name: stop.city.name,
          country: stop.city.country,
          region: stop.city.region,
          imageUrl: stop.city.imageUrl,
        },
        activities: stop.activities.map((sa) => ({
          id: sa.id,
          date: sa.date,
          startTime: sa.startTime,
          endTime: sa.endTime,
          notes: sa.notes,
          customCost: sa.customCost ? Number(sa.customCost) : null,
          activity: {
            id: sa.activity.id,
            name: sa.activity.name,
            type: sa.activity.type,
            durationMinutes: sa.activity.durationMinutes,
            description: sa.activity.description,
            imageUrl: sa.activity.imageUrl,
          },
        })),
      })),
    };
  }

  async enableSharing(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const slug = trip.shareSlug || `trip-${tripId.slice(0, 8)}-${Math.random().toString(36).substring(2, 6)}`;

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        visibility: 'PUBLIC',
        shareSlug: slug,
      },
    });

    return {
      shareSlug: updatedTrip.shareSlug,
      shareUrl: `/api/shares/${updatedTrip.shareSlug}`,
      isPublic: true,
    };
  }

  async disableSharing(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        visibility: 'PRIVATE',
      },
    });

    return {
      isPublic: false,
    };
  }

  async copyTrip(shareSlug: string, userId: string) {
    const sourceTrip = await prisma.trip.findFirst({
      where: {
        shareSlug,
      },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            activities: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!sourceTrip) {
      throw new AppError('Shared trip not found', 404);
    }

    if (sourceTrip.visibility !== 'PUBLIC') {
      throw new AppError('Access denied: Private trip cannot be copied', 403);
    }

    // Execute atomic copy transaction
    const newTrip = await prisma.$transaction(async (tx) => {
      const createdTrip = await tx.trip.create({
        data: {
          userId,
          name: `${sourceTrip.name} (Copy)`,
          description: sourceTrip.description,
          startDate: sourceTrip.startDate,
          endDate: sourceTrip.endDate,
          budget: sourceTrip.budget,
          currency: sourceTrip.currency,
          visibility: 'PRIVATE',
          shareSlug: null,
        },
      });

      for (const stop of sourceTrip.stops) {
        const createdStop = await tx.tripStop.create({
          data: {
            tripId: createdTrip.id,
            cityId: stop.cityId,
            startDate: stop.startDate,
            endDate: stop.endDate,
            order: stop.order,
            notes: stop.notes,
          },
        });

        for (const sa of stop.activities) {
          await tx.stopActivity.create({
            data: {
              tripStopId: createdStop.id,
              activityId: sa.activityId,
              date: sa.date,
              startTime: sa.startTime,
              endTime: sa.endTime,
              order: sa.order,
              notes: sa.notes,
              customCost: sa.customCost,
            },
          });
        }
      }

      return tx.trip.findUnique({
        where: { id: createdTrip.id },
        include: {
          stops: {
            include: {
              city: true,
              activities: {
                include: {
                  activity: true,
                },
              },
            },
          },
        },
      });
    });

    return newTrip;
  }
}

export const shareService = new ShareService();
