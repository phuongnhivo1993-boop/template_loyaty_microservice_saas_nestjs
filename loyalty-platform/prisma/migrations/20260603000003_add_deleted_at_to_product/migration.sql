ALTER TABLE "products" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "products_deletedAt_idx" ON "products"("deletedAt");
