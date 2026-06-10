ALTER TYPE "CabinetStatus" ADD VALUE IF NOT EXISTS 'CONFIGURING';

CREATE TABLE IF NOT EXISTS "PairingSession" (
  "id" TEXT NOT NULL,
  "hardwareSerial" TEXT NOT NULL,
  "discoveredMcpDevices" JSONB NOT NULL,
  "pairingCode" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "cabinetId" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PairingSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PairingSession_pairingCode_key" ON "PairingSession"("pairingCode");
CREATE UNIQUE INDEX IF NOT EXISTS "PairingSession_cabinetId_key" ON "PairingSession"("cabinetId");
CREATE INDEX IF NOT EXISTS "PairingSession_pairingCode_idx" ON "PairingSession"("pairingCode");
CREATE INDEX IF NOT EXISTS "PairingSession_status_expiresAt_idx" ON "PairingSession"("status", "expiresAt");
CREATE INDEX IF NOT EXISTS "PairingSession_cabinetId_idx" ON "PairingSession"("cabinetId");
