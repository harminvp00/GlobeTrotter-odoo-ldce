import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class DashboardService {
  async getDashboardData(userId: string) {
    // 1. Fetch User details for personalized welcome message
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const welcomeMessage = user.name ? `Welcome back, ${user.name}!` : 'Welcome back!';

    // 2. Parallel data fetching for stats, recent trips, and recommendations
    const [
      totalTrips,
      savedDestinationsCount,
      budgetAggregate,
      recentTripsRaw,
      topCities,
    ] = await Promise.all([
      // Count total user trips
      prisma.trip.count({
        where: { userId },
      }),
      // Count saved destinations for user
      prisma.savedDestination.count({
        where: { userId },
      }),
      // Aggregate total planned budget across user's trips
      prisma.trip.aggregate({
        where: { userId },
        _sum: { budget: true },
      }),
      // Fetch recent/upcoming trips (up to 5) with stop count
      prisma.trip.findMany({
        where: { userId },
        orderBy: [
          { startDate: 'asc' },
          { createdAt: 'desc' },
        ],
        take: 5,
        include: {
          _count: {
            select: { stops: true },
          },
        },
      }),
      // Fetch top 5 popular cities as simple recommendations
      prisma.city.findMany({
        orderBy: [
          { popularity: 'desc' },
          { name: 'asc' },
        ],
        take: 5,
        select: {
          id: true,
          name: true,
          country: true,
          region: true,
          imageUrl: true,
          popularity: true,
        },
      }),
    ]);

    const totalPlannedBudget = budgetAggregate._sum.budget ? Number(budgetAggregate._sum.budget) : 0;

    const recentTrips = recentTripsRaw.map((trip) => ({
      id: trip.id,
      name: trip.name,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget ? Number(trip.budget) : 0,
      currency: trip.currency,
      visibility: trip.visibility,
      stopCount: trip._count.stops,
    }));

    return {
      welcomeMessage,
      stats: {
        totalTrips,
        savedDestinationsCount,
        totalPlannedBudget,
      },
      recentTrips,
      recommendations: topCities,
    };
  }
}

export const dashboardService = new DashboardService();
