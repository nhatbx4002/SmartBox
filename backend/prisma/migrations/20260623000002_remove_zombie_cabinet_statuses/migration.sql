/*
  Warnings:

  - The values [DRAFT, PENDING_PROVISION, PENDING_REGISTRATION, PROVISION_FAILED] on the enum `CabinetStatus` will be removed. If these variants are still used in the database, this will fail.

*/
ALTER TYPE "CabinetStatus" RENAME TO "CabinetStatus_old";
CREATE TYPE "CabinetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OFFLINE', 'CONFIGURING');
ALTER TABLE "Cabinet" ALTER COLUMN "status" TYPE "CabinetStatus" USING "status"::text::"CabinetStatus";
DROP TYPE "CabinetStatus_old";
