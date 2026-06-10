ALTER TABLE "Cabinet" DROP CONSTRAINT IF EXISTS "Cabinet_profileId_fkey";

ALTER TABLE "Cabinet"
  DROP COLUMN IF EXISTS "profileId",
  DROP COLUMN IF EXISTS "provisionCode",
  DROP COLUMN IF EXISTS "provisionCodeExpires";

DROP TABLE IF EXISTS "ProvisionMcpDevice";
DROP TABLE IF EXISTS "ProvisionProfile";
DROP TABLE IF EXISTS "ProvisioningConfig";
