import { PrismaClient, UserRole, TripVisibility, ExpenseCategory, ActivityType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GlobeTrotter Database Seed...\n');

  // Password hashes
  const userPasswordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);

  // 1. SEED USERS
  console.log('👤 Seeding Users...');
  const user1 = await prisma.user.upsert({
    where: { email: 'ashu.test@example.com' },
    update: {
      name: 'Ashu Vekariya',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
    },
    create: {
      email: 'ashu.test@example.com',
      name: 'Ashu Vekariya',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test.user@example.com' },
    update: {
      name: 'Jane Doe',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
    },
    create: {
      email: 'test.user@example.com',
      name: 'Jane Doe',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin.test@example.com' },
    update: {
      name: 'GlobeTrotter Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin.test@example.com',
      name: 'GlobeTrotter Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  // 2. SEED USER PREFERENCES
  console.log('⚙️ Seeding User Preferences...');
  await prisma.userPreference.upsert({
    where: { userId: user1.id },
    update: { language: 'en' },
    create: { userId: user1.id, language: 'en' },
  });
  await prisma.userPreference.upsert({
    where: { userId: user2.id },
    update: { language: 'en' },
    create: { userId: user2.id, language: 'en' },
  });
  await prisma.userPreference.upsert({
    where: { userId: adminUser.id },
    update: { language: 'en' },
    create: { userId: adminUser.id, language: 'en' },
  });

  // 3. SEED CITIES
  console.log('🏙️ Seeding Cities...');
  const citiesData = [
    { name: 'Paris', country: 'France', countryCode: 'FR', region: 'Western Europe', description: 'City of Light and Romance', costIndex: 85.0, popularity: 98 },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB', region: 'Western Europe', description: 'Historic capital of Britain', costIndex: 90.0, popularity: 96 },
    { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', region: 'Middle East', description: 'Luxury shopping and futuristic architecture', costIndex: 80.0, popularity: 94 },
    { name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'East Asia', description: 'Vibrant metropolis blending tradition and modern tech', costIndex: 88.0, popularity: 97 },
    { name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Southeast Asia', description: 'Garden city and global financial hub', costIndex: 82.0, popularity: 92 },
    { name: 'New York', country: 'United States', countryCode: 'US', region: 'North America', description: 'The Big Apple, culture and theater hub', costIndex: 95.0, popularity: 99 },
    { name: 'Barcelona', country: 'Spain', countryCode: 'ES', region: 'Southern Europe', description: 'Catalan art and Mediterranean beaches', costIndex: 75.0, popularity: 91 },
    { name: 'Mumbai', country: 'India', countryCode: 'IN', region: 'South Asia', description: 'Financial capital of India and Bollywood home', costIndex: 40.0, popularity: 88 },
    { name: 'Delhi', country: 'India', countryCode: 'IN', region: 'South Asia', description: 'Capital city rich in history and monuments', costIndex: 38.0, popularity: 85 },
    { name: 'Goa', country: 'India', countryCode: 'IN', region: 'South Asia', description: 'Tropical paradise known for beaches and nightlife', costIndex: 45.0, popularity: 90 },
    { name: 'Shimla', country: 'India', countryCode: 'IN', region: 'South Asia', description: 'Scenic Himalayan hill station', costIndex: 35.0, popularity: 80 },
  ];

  const citiesMap: Record<string, any> = {};
  for (const cData of citiesData) {
    const existing = await prisma.city.findFirst({
      where: { name: cData.name, country: cData.country },
    });
    if (existing) {
      const updated = await prisma.city.update({
        where: { id: existing.id },
        data: cData,
      });
      citiesMap[cData.name] = updated;
    } else {
      const created = await prisma.city.create({
        data: cData,
      });
      citiesMap[cData.name] = created;
    }
  }

  // 4. SEED ACTIVITIES
  console.log('🎭 Seeding Activities...');
  const activitiesData = [
    { city: 'Paris', name: 'Eiffel Tower Summit Tour', description: 'Panoramic views of Paris from the top deck', type: ActivityType.SIGHTSEEING, durationMinutes: 120, estimatedCost: 2500, popularity: 100 },
    { city: 'Paris', name: 'Louvre Museum Guided Tour', description: 'Explore Mona Lisa and classic masterpieces', type: ActivityType.CULTURE, durationMinutes: 180, estimatedCost: 3000, popularity: 98 },
    { city: 'Paris', name: 'French Pastry & Bakery Workshop', description: 'Learn to bake authentic croissants and macarons', type: ActivityType.FOOD, durationMinutes: 150, estimatedCost: 4500, popularity: 85 },
    { city: 'London', name: 'Tower of London & Crown Jewels', description: 'Historic fortress housing crown jewels', type: ActivityType.SIGHTSEEING, durationMinutes: 150, estimatedCost: 3200, popularity: 95 },
    { city: 'London', name: 'West End Musical Theater Show', description: 'World-class theatrical performance', type: ActivityType.ENTERTAINMENT, durationMinutes: 180, estimatedCost: 5500, popularity: 90 },
    { city: 'Dubai', name: 'Burj Khalifa At The Top', description: 'Observation deck on 124th and 125th floors', type: ActivityType.SIGHTSEEING, durationMinutes: 90, estimatedCost: 4000, popularity: 99 },
    { city: 'Dubai', name: 'Desert Safari & BBQ Dinner', description: 'Dune bashing, camel riding, and traditional dinner', type: ActivityType.ADVENTURE, durationMinutes: 360, estimatedCost: 5000, popularity: 96 },
    { city: 'Tokyo', name: 'Senso-ji Temple & Asakusa Walking', description: 'Ancient Buddhist temple in historic Asakusa', type: ActivityType.CULTURE, durationMinutes: 120, estimatedCost: 1500, popularity: 94 },
    { city: 'Tokyo', name: 'Shibuya Crossing & Izakaya Crawl', description: 'Famous crossing and local street food tasting', type: ActivityType.FOOD, durationMinutes: 180, estimatedCost: 4000, popularity: 96 },
    { city: 'Goa', name: 'Scuba Diving at Grand Island', description: 'Underwater coral reef exploration', type: ActivityType.ADVENTURE, durationMinutes: 300, estimatedCost: 3500, popularity: 92 },
    { city: 'Goa', name: 'Seafood Sunset Dinner at Baga Beach', description: 'Fresh catch dinner right on the shoreline', type: ActivityType.FOOD, durationMinutes: 120, estimatedCost: 2000, popularity: 88 },
    { city: 'Shimla', name: 'Mall Road Walking & Heritage Tour', description: 'Colonial architecture walking trail', type: ActivityType.SIGHTSEEING, durationMinutes: 120, estimatedCost: 500, popularity: 82 },
    { city: 'Shimla', name: 'Kufri Adventure Park Rides', description: 'High altitude adventure rides and nature trail', type: ActivityType.ADVENTURE, durationMinutes: 240, estimatedCost: 1500, popularity: 78 },
  ];

  const activitiesMap: Record<string, any> = {};
  for (const act of activitiesData) {
    const city = citiesMap[act.city];
    if (!city) continue;

    const existingAct = await prisma.activity.findFirst({
      where: { cityId: city.id, name: act.name },
    });

    const actPayload = {
      cityId: city.id,
      name: act.name,
      description: act.description,
      type: act.type,
      durationMinutes: act.durationMinutes,
      estimatedCost: act.estimatedCost,
      currency: 'INR',
      popularity: act.popularity,
    };

    if (existingAct) {
      const updated = await prisma.activity.update({
        where: { id: existingAct.id },
        data: actPayload,
      });
      activitiesMap[act.name] = updated;
    } else {
      const created = await prisma.activity.create({
        data: actPayload,
      });
      activitiesMap[act.name] = created;
    }
  }

  // 5. SEED TRIPS
  console.log('✈️ Seeding Trips...');
  const tripsData = [
    {
      slug: 'euro-dream-2026',
      userId: user1.id,
      name: 'European Dream Tour',
      description: 'Exploring Paris and London',
      startDate: new Date('2026-10-01T00:00:00.000Z'),
      endDate: new Date('2026-10-15T00:00:00.000Z'),
      budget: 150000.00,
      currency: 'INR',
      visibility: TripVisibility.PRIVATE,
    },
    {
      slug: 'dubai-escape-2026',
      userId: user1.id,
      name: 'Dubai Desert & Luxury Escape',
      description: '5 days of luxury in Dubai (Intentionally Over Budget)',
      startDate: new Date('2026-11-10T00:00:00.000Z'),
      endDate: new Date('2026-11-15T00:00:00.000Z'),
      budget: 60000.00,
      currency: 'INR',
      visibility: TripVisibility.PUBLIC,
    },
    {
      slug: 'goa-beach-2026',
      userId: user2.id,
      name: 'Goa Beach Getaway',
      description: 'Relaxing trip to Goa beaches',
      startDate: new Date('2026-12-01T00:00:00.000Z'),
      endDate: new Date('2026-12-05T00:00:00.000Z'),
      budget: 30000.00,
      currency: 'INR',
      visibility: TripVisibility.PRIVATE,
    },
    {
      slug: 'quick-weekend-2026',
      userId: user2.id,
      name: 'Quick Weekend Break',
      description: 'Short weekend trip with no stops',
      startDate: new Date('2026-12-25T00:00:00.000Z'),
      endDate: new Date('2026-12-27T00:00:00.000Z'),
      budget: 15000.00,
      currency: 'INR',
      visibility: TripVisibility.PRIVATE,
    },
  ];

  const tripsMap: Record<string, any> = {};
  for (const tData of tripsData) {
    const existingTrip = await prisma.trip.findFirst({
      where: { shareSlug: tData.slug },
    });

    const tripPayload = {
      userId: tData.userId,
      name: tData.name,
      description: tData.description,
      startDate: tData.startDate,
      endDate: tData.endDate,
      budget: tData.budget,
      currency: tData.currency,
      visibility: tData.visibility,
      shareSlug: tData.slug,
    };

    if (existingTrip) {
      const updated = await prisma.trip.update({
        where: { id: existingTrip.id },
        data: tripPayload,
      });
      tripsMap[tData.slug] = updated;
    } else {
      const created = await prisma.trip.create({
        data: tripPayload,
      });
      tripsMap[tData.slug] = created;
    }
  }

  // 6. SEED TRIP STOPS & STOP ACTIVITIES
  console.log('📍 Seeding Trip Stops & Stop Activities...');

  // Trip 1 (Euro Dream) Stops
  const trip1 = tripsMap['euro-dream-2026'];
  if (trip1) {
    // Delete existing stops & activities for clean idempotency
    await prisma.tripStop.deleteMany({ where: { tripId: trip1.id } });

    const stop1 = await prisma.tripStop.create({
      data: {
        tripId: trip1.id,
        cityId: citiesMap['Paris'].id,
        startDate: new Date('2026-10-01T00:00:00.000Z'),
        endDate: new Date('2026-10-07T00:00:00.000Z'),
        order: 1,
        notes: 'Stay at Hotel Ibis Paris',
      },
    });

    const stop2 = await prisma.tripStop.create({
      data: {
        tripId: trip1.id,
        cityId: citiesMap['London'].id,
        startDate: new Date('2026-10-07T00:00:00.000Z'),
        endDate: new Date('2026-10-14T00:00:00.000Z'),
        order: 2,
        notes: 'Stay near West End',
      },
    });

    // Assign Activities to Stop 1
    if (activitiesMap['Eiffel Tower Summit Tour']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stop1.id,
          activityId: activitiesMap['Eiffel Tower Summit Tour'].id,
          date: new Date('2026-10-02T00:00:00.000Z'),
          startTime: new Date('2026-10-02T10:00:00.000Z'),
          endTime: new Date('2026-10-02T12:00:00.000Z'),
          order: 1,
          customCost: 2500,
          notes: 'Pre-booked online ticket',
        },
      });
    }

    if (activitiesMap['Louvre Museum Guided Tour']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stop1.id,
          activityId: activitiesMap['Louvre Museum Guided Tour'].id,
          date: new Date('2026-10-03T00:00:00.000Z'),
          startTime: new Date('2026-10-03T14:00:00.000Z'),
          endTime: new Date('2026-10-03T17:00:00.000Z'),
          order: 2,
          customCost: 3000,
        },
      });
    }

    // Assign Activities to Stop 2
    if (activitiesMap['Tower of London & Crown Jewels']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stop2.id,
          activityId: activitiesMap['Tower of London & Crown Jewels'].id,
          date: new Date('2026-10-08T00:00:00.000Z'),
          startTime: new Date('2026-10-08T11:00:00.000Z'),
          endTime: new Date('2026-10-08T13:30:00.000Z'),
          order: 1,
          customCost: 3200,
        },
      });
    }
  }

  // Trip 2 (Dubai Escape) Stops
  const trip2 = tripsMap['dubai-escape-2026'];
  if (trip2) {
    await prisma.tripStop.deleteMany({ where: { tripId: trip2.id } });

    const stopDubai = await prisma.tripStop.create({
      data: {
        tripId: trip2.id,
        cityId: citiesMap['Dubai'].id,
        startDate: new Date('2026-11-10T00:00:00.000Z'),
        endDate: new Date('2026-11-15T00:00:00.000Z'),
        order: 1,
        notes: 'Atlantis Palm stay',
      },
    });

    if (activitiesMap['Burj Khalifa At The Top']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stopDubai.id,
          activityId: activitiesMap['Burj Khalifa At The Top'].id,
          date: new Date('2026-11-11T00:00:00.000Z'),
          startTime: new Date('2026-11-11T16:00:00.000Z'),
          endTime: new Date('2026-11-11T18:00:00.000Z'),
          order: 1,
          customCost: 4000,
        },
      });
    }

    if (activitiesMap['Desert Safari & BBQ Dinner']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stopDubai.id,
          activityId: activitiesMap['Desert Safari & BBQ Dinner'].id,
          date: new Date('2026-11-12T00:00:00.000Z'),
          startTime: new Date('2026-11-12T15:00:00.000Z'),
          endTime: new Date('2026-11-12T21:00:00.000Z'),
          order: 2,
          customCost: 5000,
        },
      });
    }
  }

  // Trip 3 (Goa Beach) Stops
  const trip3 = tripsMap['goa-beach-2026'];
  if (trip3) {
    await prisma.tripStop.deleteMany({ where: { tripId: trip3.id } });

    const stopGoa = await prisma.tripStop.create({
      data: {
        tripId: trip3.id,
        cityId: citiesMap['Goa'].id,
        startDate: new Date('2026-12-01T00:00:00.000Z'),
        endDate: new Date('2026-12-05T00:00:00.000Z'),
        order: 1,
      },
    });

    if (activitiesMap['Scuba Diving at Grand Island']) {
      await prisma.stopActivity.create({
        data: {
          tripStopId: stopGoa.id,
          activityId: activitiesMap['Scuba Diving at Grand Island'].id,
          date: new Date('2026-12-02T00:00:00.000Z'),
          order: 1,
          customCost: 3500,
        },
      });
    }
  }

  // 7. SEED EXPENSES
  console.log('💳 Seeding Expenses...');
  if (trip1) {
    await prisma.expense.deleteMany({ where: { tripId: trip1.id } });
    await prisma.expense.createMany({
      data: [
        { tripId: trip1.id, category: ExpenseCategory.STAY, description: 'Hotel Ibis Paris', amount: 35000, date: new Date('2026-10-01') },
        { tripId: trip1.id, category: ExpenseCategory.TRANSPORT, description: 'Eurostar Paris to London', amount: 8000, date: new Date('2026-10-07') },
        { tripId: trip1.id, category: ExpenseCategory.MEAL, description: 'Gourmet French Dinner', amount: 5000, date: new Date('2026-10-03') },
        { tripId: trip1.id, category: ExpenseCategory.ACTIVITY, description: 'Eiffel Tower Entry', amount: 2500, date: new Date('2026-10-02') },
      ],
    });
  }

  if (trip2) {
    await prisma.expense.deleteMany({ where: { tripId: trip2.id } });
    // Intentionally over budget: Total 90,000 INR vs Budget 60,000 INR
    await prisma.expense.createMany({
      data: [
        { tripId: trip2.id, category: ExpenseCategory.STAY, description: 'Atlantis The Palm Hotel', amount: 55000, date: new Date('2026-11-10') },
        { tripId: trip2.id, category: ExpenseCategory.MEAL, description: 'Atmosphere Burj Khalifa Dining', amount: 15000, date: new Date('2026-11-11') },
        { tripId: trip2.id, category: ExpenseCategory.OTHER, description: 'Private Yacht Cruise', amount: 20000, date: new Date('2026-11-13') },
      ],
    });
  }

  if (trip3) {
    await prisma.expense.deleteMany({ where: { tripId: trip3.id } });
    await prisma.expense.createMany({
      data: [
        { tripId: trip3.id, category: ExpenseCategory.STAY, description: 'Goa Beach Resort', amount: 12000, date: new Date('2026-12-01') },
        { tripId: trip3.id, category: ExpenseCategory.MEAL, description: 'Beach Shack Dinners', amount: 4000, date: new Date('2026-12-02') },
      ],
    });
  }

  // 8. SEED SAVED DESTINATIONS
  console.log('📌 Seeding Saved Destinations...');
  await prisma.savedDestination.deleteMany({
    where: { userId: { in: [user1.id, user2.id] } },
  });
  await prisma.savedDestination.createMany({
    data: [
      { userId: user1.id, cityId: citiesMap['Paris'].id },
      { userId: user1.id, cityId: citiesMap['Tokyo'].id },
      { userId: user1.id, cityId: citiesMap['Dubai'].id },
      { userId: user2.id, cityId: citiesMap['Goa'].id },
      { userId: user2.id, cityId: citiesMap['Barcelona'].id },
    ],
  });

  // 9. SEED TRIP SHARES
  console.log('🔗 Seeding Trip Shares...');
  if (trip2) {
    await prisma.tripShare.deleteMany({ where: { tripId: trip2.id } });
    await prisma.tripShare.create({
      data: {
        tripId: trip2.id,
        userId: user2.id,
        canEdit: true,
      },
    });
  }

  // SUMMARY & CREDENTIALS PRINT
  const [usersCount, citiesCount, activitiesCount, tripsCount, stopsCount, stopActivitiesCount, expensesCount, savedCount, sharesCount] = await Promise.all([
    prisma.user.count(),
    prisma.city.count(),
    prisma.activity.count(),
    prisma.trip.count(),
    prisma.tripStop.count(),
    prisma.stopActivity.count(),
    prisma.expense.count(),
    prisma.savedDestination.count(),
    prisma.tripShare.count(),
  ]);

  console.log('\n==================================================');
  console.log('✅ Seed completed successfully.\n');
  console.log(`Users: ${usersCount}`);
  console.log(`User Preferences: ${await prisma.userPreference.count()}`);
  console.log(`Cities: ${citiesCount}`);
  console.log(`Activities: ${activitiesCount}`);
  console.log(`Trips: ${tripsCount}`);
  console.log(`Stops: ${stopsCount}`);
  console.log(`Stop Activities: ${stopActivitiesCount}`);
  console.log(`Expenses: ${expensesCount}`);
  console.log(`Saved Destinations: ${savedCount}`);
  console.log(`Trip Shares: ${sharesCount}`);
  console.log('==================================================\n');

  console.log('🔑 Development Test Login Credentials:');
  console.log('--------------------------------------------------');
  console.log('1. User A (Ashu Vekariya):');
  console.log('   Email: ashu.test@example.com');
  console.log('   Password: Password123!');
  console.log('   Role: USER\n');
  console.log('2. User B (Jane Doe):');
  console.log('   Email: test.user@example.com');
  console.log('   Password: Password123!');
  console.log('   Role: USER\n');
  console.log('3. Admin User (GlobeTrotter Admin):');
  console.log('   Email: admin.test@example.com');
  console.log('   Password: AdminPassword123!');
  console.log('   Role: ADMIN');
  console.log('--------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
