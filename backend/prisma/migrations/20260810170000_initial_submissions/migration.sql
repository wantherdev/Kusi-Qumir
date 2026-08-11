CREATE TYPE "SubmissionStatus" AS ENUM ('RECEIVED', 'IN_REVIEW', 'ANSWERED', 'CLOSED');
CREATE TYPE "ClaimType" AS ENUM ('CLAIM', 'COMPLAINT');

CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "approximateDate" TEXT,
    "travelers" INTEGER,
    "interest" TEXT,
    "message" TEXT,
    "privacyPolicyVersion" TEXT NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "type" "ClaimType" NOT NULL,
    "consumerName" TEXT NOT NULL,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "guardianName" TEXT,
    "identityDocument" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "claimedAmount" DECIMAL(12,2),
    "detail" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "privacyPolicyVersion" TEXT NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContactRequest_trackingCode_key" ON "ContactRequest"("trackingCode");
CREATE INDEX "ContactRequest_status_createdAt_idx" ON "ContactRequest"("status", "createdAt");
CREATE INDEX "ContactRequest_email_createdAt_idx" ON "ContactRequest"("email", "createdAt");
CREATE UNIQUE INDEX "Claim_trackingCode_key" ON "Claim"("trackingCode");
CREATE INDEX "Claim_status_createdAt_idx" ON "Claim"("status", "createdAt");
CREATE INDEX "Claim_email_createdAt_idx" ON "Claim"("email", "createdAt");
