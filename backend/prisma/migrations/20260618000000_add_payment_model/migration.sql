-- Create PaymentSource enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentSource') THEN
    CREATE TYPE "PaymentSource" AS ENUM ('KIOSK', 'APP');
  END IF;
END $$;

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
  "id"            TEXT NOT NULL,
  "rentalId"      TEXT NOT NULL,
  "orderCode"     INTEGER NOT NULL,
  "amount"        INTEGER NOT NULL,
  "status"        "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "paymentLinkId" TEXT,
  "checkoutUrl"   TEXT,
  "qrCode"        TEXT,
  "method"        "PaymentMethod" NOT NULL DEFAULT 'PAYOS',
  "source"        "PaymentSource" NOT NULL DEFAULT 'KIOSK',
  "paidAt"        TIMESTAMP(3),
  "expiresAt"     TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_rentalId_key"  ON "Payment"("rentalId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_orderCode_key" ON "Payment"("orderCode");
CREATE INDEX IF NOT EXISTS "Payment_orderCode_idx"        ON "Payment"("orderCode");
CREATE INDEX IF NOT EXISTS "Payment_status_idx"           ON "Payment"("status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Payment_rentalId_fkey'
  ) THEN
    ALTER TABLE "Payment"
      ADD CONSTRAINT "Payment_rentalId_fkey"
      FOREIGN KEY ("rentalId") REFERENCES "Rental"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
