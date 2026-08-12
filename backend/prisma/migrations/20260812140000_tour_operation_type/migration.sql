CREATE TYPE "TourOperationType" AS ENUM ('PROPIO', 'TERCERO');

ALTER TABLE "Tour"
ADD COLUMN "operationType" "TourOperationType" NOT NULL DEFAULT 'TERCERO';

CREATE INDEX "Tour_operationType_active_idx" ON "Tour"("operationType", "active");
