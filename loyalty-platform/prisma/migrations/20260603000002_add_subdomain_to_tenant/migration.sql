-- Add subdomain field to Tenant model
ALTER TABLE "tenants" ADD COLUMN "subdomain" TEXT;
CREATE UNIQUE INDEX "tenants_subdomain_key" ON "tenants"("subdomain");
