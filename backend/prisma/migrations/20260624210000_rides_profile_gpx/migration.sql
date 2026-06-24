-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "monthlyGoalKm" DOUBLE PRECISION NOT NULL DEFAULT 80;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN IF NOT EXISTS "gpxFile" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE IF NOT EXISTS "Ride" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routeSlug" TEXT,
    "routeTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "elapsedSec" INTEGER NOT NULL DEFAULT 0,
    "movingSec" INTEGER NOT NULL DEFAULT 0,
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgSpeedKmh" DOUBLE PRECISION,
    "maxSpeedKmh" DOUBLE PRECISION,
    "avgPaceMinPerKm" DOUBLE PRECISION,
    "maxOffRouteKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "routeCompletion" DOUBLE PRECISION,
    "trackPoints" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ride_userId_startedAt_idx" ON "Ride"("userId", "startedAt");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Ride_userId_fkey'
  ) THEN
    ALTER TABLE "Ride" ADD CONSTRAINT "Ride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
