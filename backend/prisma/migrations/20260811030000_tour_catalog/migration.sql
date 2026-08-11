CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Moderate', 'Challenging');
CREATE TYPE "GroupType" AS ENUM ('Shared', 'Private');
CREATE TYPE "ServiceType" AS ENUM ('HalfDay', 'FullDay', 'MultiDay');

CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "groupType" "GroupType" NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "categorySlug" TEXT NOT NULL,
    "recommendedFor" JSONB NOT NULL,
    "prices" JSONB NOT NULL,
    "itineraryDays" JSONB NOT NULL,
    "includes" JSONB NOT NULL,
    "excludes" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "seo" JSONB,
    "destinations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");
CREATE UNIQUE INDEX "Tour_code_key" ON "Tour"("code");
CREATE INDEX "Tour_active_featured_idx" ON "Tour"("active", "featured");
CREATE INDEX "Tour_categorySlug_active_idx" ON "Tour"("categorySlug", "active");
