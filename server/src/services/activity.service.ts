import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ActivityQueryInput } from '../schemas/activity.schema';

export class ActivityService {
  async getActivities(query: ActivityQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = {};

    if (query.cityId) {
      where.cityId = query.cityId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.q) {
      where.name = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { popularity: 'desc' },
          { name: 'asc' },
        ],
        include: {
          city: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      activities,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}

export const activityService = new ActivityService();
