import { prisma } from '../lib/prisma';
import { AdminUserQueryInput } from '../schemas/admin.schema';

export class AdminService {
  async getOverview() {
    const [totalUsers, totalTrips, totalCities, totalActivities] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.city.count(),
      prisma.activity.count(),
    ]);

    return {
      totalUsers,
      totalTrips,
      totalCities,
      totalActivities,
    };
  }

  async getUsers(query: AdminUserQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getPopularCities() {
    const cities = await prisma.city.findMany({
      orderBy: [
        { popularity: 'desc' },
        { name: 'asc' },
      ],
      take: 10,
      include: {
        _count: {
          select: { tripStops: true },
        },
      },
    });

    return cities.map((c) => ({
      id: c.id,
      name: c.name,
      country: c.country,
      region: c.region,
      imageUrl: c.imageUrl,
      popularity: c.popularity,
      tripStopCount: c._count.tripStops,
    }));
  }

  async getPopularActivities() {
    const activities = await prisma.activity.findMany({
      orderBy: [
        { popularity: 'desc' },
        { name: 'asc' },
      ],
      take: 10,
      include: {
        city: {
          select: {
            name: true,
            country: true,
          },
        },
        _count: {
          select: { stopActivities: true },
        },
      },
    });

    return activities.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      estimatedCost: a.estimatedCost ? Number(a.estimatedCost) : 0,
      currency: a.currency,
      popularity: a.popularity,
      city: a.city,
      usageCount: a._count.stopActivities,
    }));
  }
}

export const adminService = new AdminService();
