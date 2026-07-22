-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'CABINET_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CabinetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OFFLINE', 'CONFIGURING');

-- CreateEnum
CREATE TYPE "CompartmentSize" AS ENUM ('SMALL', 'LARGE');

-- CreateEnum
CREATE TYPE "CompartmentStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');

-- CreateEnum
CREATE TYPE "LockStatus" AS ENUM ('UNKNOWN', 'LOCKED', 'UNLOCKED', 'FAULTY');

-- CreateEnum
CREATE TYPE "DoorStatus" AS ENUM ('CLOSED', 'OPEN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('ONCE', 'DAILY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LockerAction" AS ENUM ('OPENED', 'CLOSED', 'EXPIRED', 'DENIED', 'NO_SHOW', 'HEARTBEAT', 'FAULTY');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_LOCATION', 'UPDATE_LOCATION', 'DELETE_LOCATION', 'CREATE_CABINET', 'UPDATE_CABINET', 'DELETE_CABINET', 'UNLOCK_COMPARTMENT', 'CANCEL_RENTAL', 'CREATE_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN', 'ASSIGN_ADMIN_CABINET', 'UNASSIGN_ADMIN_CABINET', 'CREATE_PRICE_PLAN', 'UPDATE_PRICE_PLAN', 'DELETE_PRICE_PLAN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RENTAL_EXPIRED', 'CABINET_OFFLINE', 'RENTAL_STARTED', 'PAYMENT_SUCCESS', 'HARDWARE_FAULT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAYOS', 'NONE');

-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('KIOSK', 'MOBILE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'CABINET_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "fcmToken" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mapImageUrl" TEXT,
    "status" "LocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCabinet" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminCabinet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cabinet" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CabinetStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastHeartbeatAt" TIMESTAMP(3),
    "configVersion" INTEGER NOT NULL DEFAULT 1,
    "hardwareSerial" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cabinet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McpDevice" (
    "id" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,
    "bus" INTEGER NOT NULL DEFAULT 1,
    "address" INTEGER NOT NULL DEFAULT 32,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "McpDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compartment" (
    "id" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" "CompartmentSize" NOT NULL,
    "mcp23017PinLock" INTEGER NOT NULL,
    "mcp23017PinSensor" INTEGER NOT NULL,
    "lockMcpDeviceId" TEXT,
    "sensorMcpDeviceId" TEXT,
    "status" "CompartmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingSession" (
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

-- CreateTable
CREATE TABLE "PricePlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" "CompartmentSize" NOT NULL,
    "rentalType" "RentalType" NOT NULL,
    "price" INTEGER NOT NULL,
    "maxOpens" INTEGER,
    "durationDays" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "compartmentId" TEXT NOT NULL,
    "pricePlanId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "maxOpens" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockerLog" (
    "id" TEXT NOT NULL,
    "cabinetId" TEXT,
    "compartmentId" TEXT,
    "rentalId" TEXT,
    "action" "LockerAction" NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LockerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "orderCode" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentLinkId" TEXT,
    "checkoutUrl" TEXT,
    "qrCode" TEXT,
    "method" "PaymentMethod" NOT NULL DEFAULT 'PAYOS',
    "source" "PaymentSource" NOT NULL DEFAULT 'KIOSK',
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Location_status_idx" ON "Location"("status");

-- CreateIndex
CREATE INDEX "AdminCabinet_cabinetId_idx" ON "AdminCabinet"("cabinetId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCabinet_adminId_cabinetId_key" ON "AdminCabinet"("adminId", "cabinetId");

-- CreateIndex
CREATE INDEX "McpDevice_cabinetId_idx" ON "McpDevice"("cabinetId");

-- CreateIndex
CREATE UNIQUE INDEX "McpDevice_cabinetId_bus_address_key" ON "McpDevice"("cabinetId", "bus", "address");

-- CreateIndex
CREATE INDEX "Compartment_cabinetId_idx" ON "Compartment"("cabinetId");

-- CreateIndex
CREATE INDEX "Compartment_lockMcpDeviceId_idx" ON "Compartment"("lockMcpDeviceId");

-- CreateIndex
CREATE INDEX "Compartment_sensorMcpDeviceId_idx" ON "Compartment"("sensorMcpDeviceId");

-- CreateIndex
CREATE INDEX "Compartment_status_idx" ON "Compartment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Compartment_cabinetId_name_key" ON "Compartment"("cabinetId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PairingSession_pairingCode_key" ON "PairingSession"("pairingCode");

-- CreateIndex
CREATE UNIQUE INDEX "PairingSession_cabinetId_key" ON "PairingSession"("cabinetId");

-- CreateIndex
CREATE INDEX "PairingSession_pairingCode_idx" ON "PairingSession"("pairingCode");

-- CreateIndex
CREATE INDEX "PairingSession_status_expiresAt_idx" ON "PairingSession"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "PairingSession_cabinetId_idx" ON "PairingSession"("cabinetId");

-- CreateIndex
CREATE INDEX "PricePlan_size_isActive_idx" ON "PricePlan"("size", "isActive");

-- CreateIndex
CREATE INDEX "PricePlan_rentalType_idx" ON "PricePlan"("rentalType");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_code_key" ON "Rental"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_qrToken_key" ON "Rental"("qrToken");

-- CreateIndex
CREATE INDEX "Rental_code_idx" ON "Rental"("code");

-- CreateIndex
CREATE INDEX "Rental_qrToken_idx" ON "Rental"("qrToken");

-- CreateIndex
CREATE INDEX "Rental_userId_idx" ON "Rental"("userId");

-- CreateIndex
CREATE INDEX "Rental_compartmentId_idx" ON "Rental"("compartmentId");

-- CreateIndex
CREATE INDEX "Rental_status_idx" ON "Rental"("status");

-- CreateIndex
CREATE INDEX "Rental_expiresAt_idx" ON "Rental"("expiresAt");

-- CreateIndex
CREATE INDEX "LockerLog_compartmentId_idx" ON "LockerLog"("compartmentId");

-- CreateIndex
CREATE INDEX "LockerLog_cabinetId_idx" ON "LockerLog"("cabinetId");

-- CreateIndex
CREATE INDEX "LockerLog_rentalId_idx" ON "LockerLog"("rentalId");

-- CreateIndex
CREATE INDEX "LockerLog_action_idx" ON "LockerLog"("action");

-- CreateIndex
CREATE INDEX "LockerLog_createdAt_idx" ON "LockerLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_rentalId_key" ON "Payment"("rentalId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderCode_key" ON "Payment"("orderCode");

-- CreateIndex
CREATE INDEX "Payment_orderCode_idx" ON "Payment"("orderCode");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- AddForeignKey
ALTER TABLE "AdminCabinet" ADD CONSTRAINT "AdminCabinet_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCabinet" ADD CONSTRAINT "AdminCabinet_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cabinet" ADD CONSTRAINT "Cabinet_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McpDevice" ADD CONSTRAINT "McpDevice_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compartment" ADD CONSTRAINT "Compartment_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compartment" ADD CONSTRAINT "Compartment_lockMcpDeviceId_fkey" FOREIGN KEY ("lockMcpDeviceId") REFERENCES "McpDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compartment" ADD CONSTRAINT "Compartment_sensorMcpDeviceId_fkey" FOREIGN KEY ("sensorMcpDeviceId") REFERENCES "McpDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "Compartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_pricePlanId_fkey" FOREIGN KEY ("pricePlanId") REFERENCES "PricePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerLog" ADD CONSTRAINT "LockerLog_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerLog" ADD CONSTRAINT "LockerLog_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "Compartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerLog" ADD CONSTRAINT "LockerLog_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
