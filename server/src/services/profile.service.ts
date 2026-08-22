import { prisma } from '../lib/prisma';
import { UpdateProfileInput, UpdatePreferencesInput } from '../schemas/profile.schema';
import { AppError } from '../middleware/error.middleware';

export class ProfileService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: { equals: data.email, mode: 'insensitive' },
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new AppError('Email is already in use', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email.toLowerCase() }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getPreferences(userId: string) {
    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          language: 'en',
        },
      });
    }

    return preferences;
  }

  async updatePreferences(userId: string, data: UpdatePreferencesInput) {
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        ...(data.language && { language: data.language }),
      },
      create: {
        userId,
        language: data.language || 'en',
      },
    });

    return preferences;
  }

  async getSavedDestinations(userId: string) {
    const savedDestinations = await prisma.savedDestination.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        city: true,
      },
    });

    return savedDestinations;
  }

  async addSavedDestination(userId: string, cityId: string) {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      throw new AppError('City not found', 404);
    }

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: { userId, cityId },
      },
      include: { city: true },
    });

    if (existing) {
      return existing;
    }

    const savedDestination = await prisma.savedDestination.create({
      data: {
        userId,
        cityId,
      },
      include: {
        city: true,
      },
    });

    return savedDestination;
  }

  async deleteSavedDestination(userId: string, savedDestinationId: string) {
    const record = await prisma.savedDestination.findUnique({
      where: { id: savedDestinationId },
    });

    if (!record) {
      throw new AppError('Saved destination not found', 404);
    }

    if (record.userId !== userId) {
      throw new AppError('Forbidden: You do not own this record', 403);
    }

    await prisma.savedDestination.delete({
      where: { id: savedDestinationId },
    });

    return { message: 'Saved destination removed successfully' };
  }

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}

export const profileService = new ProfileService();
