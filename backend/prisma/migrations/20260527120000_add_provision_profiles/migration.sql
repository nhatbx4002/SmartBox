ALTER TYPE "CabinetStatus" ADD VALUE IF NOT EXISTS 'PENDING_REGISTRATION';

ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'CREATE_PROVISION_PROFILE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'UPDATE_PROVISION_PROFILE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'DELETE_PROVISION_PROFILE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'CABINET_AUTO_PROVISIONED';

ALTER TABLE "Cabinet"
  ADD COLUMN IF NOT EXISTS "profileId" TEXT;

CREATE TABLE IF NOT EXISTS "ProvisionProfile" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "provisionKey" TEXT NOT NULL,
  "provisionSecret" TEXT,
  "mode" TEXT NOT NULL DEFAULT 'ALLOW_NEW',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "templateRows" INTEGER NOT NULL,
  "templateCols" INTEGER NOT NULL,
  "templateSizes" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProvisionProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProvisionMcpDevice" (
  "id" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "bus" INTEGER NOT NULL DEFAULT 1,
  "address" INTEGER NOT NULL,
  "role" TEXT NOT NULL,
  "name" TEXT,
  CONSTRAINT "ProvisionMcpDevice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CabinetCredential" (
  "id" TEXT NOT NULL,
  "cabinetId" TEXT NOT NULL,
  "mqttUsername" TEXT NOT NULL,
  "mqttPassword" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CabinetCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProvisionProfile_name_key" ON "ProvisionProfile"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "ProvisionProfile_provisionKey_key" ON "ProvisionProfile"("provisionKey");
CREATE INDEX IF NOT EXISTS "ProvisionProfile_provisionKey_idx" ON "ProvisionProfile"("provisionKey");

CREATE UNIQUE INDEX IF NOT EXISTS "ProvisionMcpDevice_profileId_bus_address_key"
  ON "ProvisionMcpDevice"("profileId", "bus", "address");
CREATE INDEX IF NOT EXISTS "ProvisionMcpDevice_profileId_idx" ON "ProvisionMcpDevice"("profileId");

CREATE UNIQUE INDEX IF NOT EXISTS "CabinetCredential_cabinetId_key" ON "CabinetCredential"("cabinetId");
CREATE INDEX IF NOT EXISTS "Cabinet_profileId_idx" ON "Cabinet"("profileId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Cabinet_profileId_fkey'
  ) THEN
    ALTER TABLE "Cabinet"
      ADD CONSTRAINT "Cabinet_profileId_fkey"
      FOREIGN KEY ("profileId") REFERENCES "ProvisionProfile"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProvisionMcpDevice_profileId_fkey'
  ) THEN
    ALTER TABLE "ProvisionMcpDevice"
      ADD CONSTRAINT "ProvisionMcpDevice_profileId_fkey"
      FOREIGN KEY ("profileId") REFERENCES "ProvisionProfile"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'CabinetCredential_cabinetId_fkey'
  ) THEN
    ALTER TABLE "CabinetCredential"
      ADD CONSTRAINT "CabinetCredential_cabinetId_fkey"
      FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
