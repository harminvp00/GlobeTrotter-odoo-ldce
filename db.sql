-- ============================================================
-- GLOBETROTTER DATABASE
-- PostgreSQL SQL equivalent of Prisma schema
-- ============================================================


-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE "UserRole" AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TYPE "TripVisibility" AS ENUM (
    'PRIVATE',
    'PUBLIC'
);

CREATE TYPE "ExpenseCategory" AS ENUM (
    'TRANSPORT',
    'STAY',
    'ACTIVITY',
    'MEAL',
    'OTHER'
);

CREATE TYPE "ActivityType" AS ENUM (
    'SIGHTSEEING',
    'FOOD',
    'ADVENTURE',
    'SHOPPING',
    'CULTURE',
    'ENTERTAINMENT',
    'NATURE',
    'OTHER'
);


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "name" VARCHAR(255) NOT NULL,

    "email" VARCHAR(255) NOT NULL UNIQUE,

    "passwordHash" TEXT NOT NULL,

    "profilePhoto" TEXT,

    "role" "UserRole" NOT NULL DEFAULT 'USER',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- USER PREFERENCES
-- ============================================================

CREATE TABLE "user_preferences" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "userId" UUID NOT NULL UNIQUE,

    "language" VARCHAR(20) NOT NULL DEFAULT 'en',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_preferences_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);


-- ============================================================
-- TRIPS
-- ============================================================

CREATE TABLE "trips" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "userId" UUID NOT NULL,

    "name" VARCHAR(255) NOT NULL,

    "description" TEXT,

    "startDate" TIMESTAMP(3) NOT NULL,

    "endDate" TIMESTAMP(3) NOT NULL,

    "coverPhoto" TEXT,

    "budget" DECIMAL(12,2),

    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',

    "visibility" "TripVisibility" NOT NULL DEFAULT 'PRIVATE',

    "shareSlug" VARCHAR(255) UNIQUE,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trips_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);


-- ============================================================
-- CITIES
-- ============================================================

CREATE TABLE "cities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "name" VARCHAR(255) NOT NULL,

    "country" VARCHAR(255) NOT NULL,

    "countryCode" VARCHAR(10),

    "region" VARCHAR(255),

    "description" TEXT,

    "imageUrl" TEXT,

    "latitude" DECIMAL(10,7),

    "longitude" DECIMAL(10,7),

    "costIndex" DECIMAL(5,2),

    "popularity" INTEGER NOT NULL DEFAULT 0,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- TRIP STOPS
-- ============================================================

CREATE TABLE "trip_stops" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "tripId" UUID NOT NULL,

    "cityId" UUID NOT NULL,

    "startDate" TIMESTAMP(3) NOT NULL,

    "endDate" TIMESTAMP(3) NOT NULL,

    "order" INTEGER NOT NULL,

    "notes" TEXT,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_stops_tripId_fkey"
        FOREIGN KEY ("tripId")
        REFERENCES "trips"("id")
        ON DELETE CASCADE,

    CONSTRAINT "trip_stops_cityId_fkey"
        FOREIGN KEY ("cityId")
        REFERENCES "cities"("id")
        ON DELETE RESTRICT,

    CONSTRAINT "trip_stops_tripId_order_key"
        UNIQUE ("tripId", "order")
);


-- ============================================================
-- ACTIVITIES
-- ============================================================

CREATE TABLE "activities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "cityId" UUID NOT NULL,

    "name" VARCHAR(255) NOT NULL,

    "description" TEXT,

    "type" "ActivityType" NOT NULL,

    "durationMinutes" INTEGER,

    "estimatedCost" DECIMAL(10,2),

    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',

    "imageUrl" TEXT,

    "popularity" INTEGER NOT NULL DEFAULT 0,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_cityId_fkey"
        FOREIGN KEY ("cityId")
        REFERENCES "cities"("id")
        ON DELETE CASCADE
);


-- ============================================================
-- STOP ACTIVITIES
-- ============================================================

CREATE TABLE "stop_activities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "tripStopId" UUID NOT NULL,

    "activityId" UUID NOT NULL,

    "date" TIMESTAMP(3) NOT NULL,

    "startTime" TIMESTAMP(3),

    "endTime" TIMESTAMP(3),

    "order" INTEGER NOT NULL,

    "notes" TEXT,

    "customCost" DECIMAL(10,2),

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stop_activities_tripStopId_fkey"
        FOREIGN KEY ("tripStopId")
        REFERENCES "trip_stops"("id")
        ON DELETE CASCADE,

    CONSTRAINT "stop_activities_activityId_fkey"
        FOREIGN KEY ("activityId")
        REFERENCES "activities"("id")
        ON DELETE RESTRICT
);


-- ============================================================
-- EXPENSES
-- ============================================================

CREATE TABLE "expenses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "tripId" UUID NOT NULL,

    "tripStopId" UUID,

    "category" "ExpenseCategory" NOT NULL,

    "description" TEXT NOT NULL,

    "amount" DECIMAL(12,2) NOT NULL,

    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',

    "date" TIMESTAMP(3) NOT NULL,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_tripId_fkey"
        FOREIGN KEY ("tripId")
        REFERENCES "trips"("id")
        ON DELETE CASCADE,

    CONSTRAINT "expenses_tripStopId_fkey"
        FOREIGN KEY ("tripStopId")
        REFERENCES "trip_stops"("id")
        ON DELETE SET NULL
);


-- ============================================================
-- TRIP SHARES
-- ============================================================

CREATE TABLE "trip_shares" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "tripId" UUID NOT NULL,

    "userId" UUID,

    "canEdit" BOOLEAN NOT NULL DEFAULT FALSE,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_shares_tripId_fkey"
        FOREIGN KEY ("tripId")
        REFERENCES "trips"("id")
        ON DELETE CASCADE,

    CONSTRAINT "trip_shares_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);


-- ============================================================
-- SAVED DESTINATIONS
-- ============================================================

CREATE TABLE "saved_destinations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "userId" UUID NOT NULL,

    "cityId" UUID NOT NULL,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_destinations_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE,

    CONSTRAINT "saved_destinations_cityId_fkey"
        FOREIGN KEY ("cityId")
        REFERENCES "cities"("id")
        ON DELETE CASCADE,

    CONSTRAINT "saved_destinations_userId_cityId_key"
        UNIQUE ("userId", "cityId")
);


-- ============================================================
-- INDEXES
-- ============================================================


-- TRIPS
CREATE INDEX "trips_userId_idx"
ON "trips" ("userId");

CREATE INDEX "trips_startDate_idx"
ON "trips" ("startDate");


-- CITIES
CREATE INDEX "cities_name_idx"
ON "cities" ("name");

CREATE INDEX "cities_country_idx"
ON "cities" ("country");

CREATE INDEX "cities_region_idx"
ON "cities" ("region");


-- TRIP STOPS
CREATE INDEX "trip_stops_tripId_idx"
ON "trip_stops" ("tripId");

CREATE INDEX "trip_stops_cityId_idx"
ON "trip_stops" ("cityId");


-- ACTIVITIES
CREATE INDEX "activities_cityId_idx"
ON "activities" ("cityId");

CREATE INDEX "activities_type_idx"
ON "activities" ("type");

CREATE INDEX "activities_name_idx"
ON "activities" ("name");


-- STOP ACTIVITIES
CREATE INDEX "stop_activities_tripStopId_idx"
ON "stop_activities" ("tripStopId");

CREATE INDEX "stop_activities_activityId_idx"
ON "stop_activities" ("activityId");

CREATE INDEX "stop_activities_date_idx"
ON "stop_activities" ("date");


-- EXPENSES
CREATE INDEX "expenses_tripId_idx"
ON "expenses" ("tripId");

CREATE INDEX "expenses_tripStopId_idx"
ON "expenses" ("tripStopId");

CREATE INDEX "expenses_category_idx"
ON "expenses" ("category");

CREATE INDEX "expenses_date_idx"
ON "expenses" ("date");


-- TRIP SHARES
CREATE INDEX "trip_shares_tripId_idx"
ON "trip_shares" ("tripId");

CREATE INDEX "trip_shares_userId_idx"
ON "trip_shares" ("userId");


-- SAVED DESTINATIONS
CREATE INDEX "saved_destinations_userId_idx"
ON "saved_destinations" ("userId");

CREATE INDEX "saved_destinations_cityId_idx"
ON "saved_destinations" ("cityId");