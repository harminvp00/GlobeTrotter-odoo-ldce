import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CityQueryInput } from '../schemas/city.schema';

export class CityService {
  async getCities(query: CityQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CityWhereInput = {};

    if (query.q) {
      where.name = {
        contains: query.q,
        mode: 'insensitive',
      };
    }

    if (query.country) {
      where.country = {
        contains: query.country,
        mode: 'insensitive',
      };
    }

    if (query.region) {
      where.region = {
        contains: query.region,
        mode: 'insensitive',
      };
    }

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { popularity: 'desc' },
          { name: 'asc' },
        ],
      }),
      prisma.city.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      cities,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}

export const cityService = new CityService();
