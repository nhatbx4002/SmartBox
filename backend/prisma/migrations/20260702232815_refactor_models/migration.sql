/*
  Warnings:

  - The values [MOBILE] on the enum `PaymentSource` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING] on the enum `RentalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentSource_new" AS ENUM ('KIOSK', 'APP');
ALTER TABLE "Payment" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "source" TYPE "PaymentSource_new" USING ("source"::text::"PaymentSource_new");
ALTER TYPE "PaymentSource" RENAME TO "PaymentSource_old";
ALTER TYPE "PaymentSource_new" RENAME TO "PaymentSource";
DROP TYPE "PaymentSource_old";
ALTER TABLE "Payment" ALTER COLUMN "source" SET DEFAULT 'KIOSK';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RentalStatus_new" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');
ALTER TABLE "Rental" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Rental" ALTER COLUMN "status" TYPE "RentalStatus_new" USING ("status"::text::"RentalStatus_new");
ALTER TYPE "RentalStatus" RENAME TO "RentalStatus_old";
ALTER TYPE "RentalStatus_new" RENAME TO "RentalStatus";
DROP TYPE "RentalStatus_old";
ALTER TABLE "Rental" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- CreateIndex
CREATE INDEX "Cabinet_locationId_idx" ON "Cabinet"("locationId");

-- CreateIndex
CREATE INDEX "Cabinet_status_idx" ON "Cabinet"("status");

-- CreateIndex
CREATE INDEX "Cabinet_hardwareSerial_idx" ON "Cabinet"("hardwareSerial");
