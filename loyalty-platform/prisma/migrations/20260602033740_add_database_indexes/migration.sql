-- CreateIndex
CREATE INDEX "audit_logs_entityType_idx" ON "audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "campaigns_tenantId_idx" ON "campaigns"("tenantId");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "campaigns_startDate_endDate_idx" ON "campaigns"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "member_vouchers_memberId_idx" ON "member_vouchers"("memberId");

-- CreateIndex
CREATE INDEX "member_vouchers_voucherId_idx" ON "member_vouchers"("voucherId");

-- CreateIndex
CREATE INDEX "member_vouchers_redeemed_idx" ON "member_vouchers"("redeemed");

-- CreateIndex
CREATE INDEX "members_tenantId_idx" ON "members"("tenantId");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE INDEX "members_tierId_idx" ON "members"("tierId");

-- CreateIndex
CREATE INDEX "members_createdAt_idx" ON "members"("createdAt");

-- CreateIndex
CREATE INDEX "point_transactions_memberId_idx" ON "point_transactions"("memberId");

-- CreateIndex
CREATE INDEX "point_transactions_type_idx" ON "point_transactions"("type");

-- CreateIndex
CREATE INDEX "point_transactions_createdAt_idx" ON "point_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "referrals_tenantId_idx" ON "referrals"("tenantId");

-- CreateIndex
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "rewards_tenantId_idx" ON "rewards"("tenantId");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "vouchers_tenantId_idx" ON "vouchers"("tenantId");
