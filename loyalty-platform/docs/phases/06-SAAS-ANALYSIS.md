# Phase 6: SaaS Multi-Tenant Analysis

## 6.1 Multi-Tenant Model

### 6.1.1 Kiến trúc hiện tại

| Component | Implementation | Status |
|---|---|---|
| **Strategy** | Shared database, row-level isolation via `tenantId` | ✅ |
| **TenantGuard** | Global APP_GUARD, extracts `req.user.tenantId` | ✅ |
| **@SkipTenantCheck()** | Public endpoints (auth, member register, public feedback) | ✅ |
| **@CurrentTenant()** | Param decorator to extract `req.tenantId` | ✅ |
| **tenantId field** | All tenant-scoped models have `tenantId String @map("tenant_id")` | ✅ |
| **Index on tenantId** | `@@index([tenantId])` trên tất cả tenant-scoped models | ✅ |
| **HOST role** | Super admin có thể access cross-tenant | ✅ |
| **Subdomain resolution** | Middleware xác định tenant từ subdomain | ✅ |

### 6.1.2 Tenant-Scoped Models (Đã có tenantId)

```
Tenant, User, Member, Tier, Campaign, Reward, Voucher, Promotion,
Referral, Badge, Mission, NotificationLog, NotificationTemplate,
PointEarningRule, Store, CashbackConfig, PartnerBrand, WebhookEndpoint,
GiftCard, ProductCategory, Product, Order, Coupon, Settings
```

### 6.1.3 Global Models (Không có tenantId)

```
Host, AuditLog, Upload
```

### 6.1.4 SaaS Gaps & Improvements

| Gap | Hiện tại | Khuyến nghị | Priority |
|---|---|---|---|
| **Subscription Management** | ❌ Không có | Thêm Subscription model + billing | P1 |
| **Feature Toggle per Tenant** | ❌ Không có | Thêm feature flags (max members, max campaigns, etc.) | P1 |
| **Usage Tracking** | ❌ Không có | Track API calls, storage, members per tenant | P1 |
| **Tenant Analytics (Host)** | ⚠️ Partial | Dashboard tổng quan các tenant | P1 |
| **Onboarding Flow** | ❌ Không có | Wizard cho tenant mới (setup tiers, branding, invite) | P2 |
| **Tenant Trial Period** | ❌ Không có | Trial 14 days → upgrade | P2 |
| **Billing Integration** | ❌ Không có | Stripe/VNPay integration | P2 |
| **Plan Limits Enforcement** | ❌ Không có | Block actions khi vượt limit | P1 |

---

## 6.2 SaaS Subscription Design

### 6.2.1 Subscription Plans

| Feature | Free | Starter | Professional | Enterprise |
|---|---|---|---|---|
| **Price** | $0 | $199/mo | $499/mo | Custom |
| **Max Members** | 100 | 1,000 | 10,000 | Unlimited |
| **Max Campaigns** | 2 | 10 | 50 | Unlimited |
| **Max Rewards** | 5 | 20 | 100 | Unlimited |
| **Tiers** | 3 | 5 | 10 | Custom |
| **Referral Program** | ❌ | ✅ | ✅ | ✅ |
| **Gamification** | ❌ | ❌ | ✅ | ✅ |
| **Analytics** | Basic | Basic | Advanced | Custom |
| **API Access** | ❌ | ✅ | ✅ | ✅ |
| **Custom Domain** | ❌ | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ❌ | ✅ |
| **Support** | Email | Email + Chat | Priority | Dedicated |

### 6.2.2 Database Models cần thêm

```prisma
model Subscription {
  id            String   @id @default(uuid())
  tenantId      String   @map("tenant_id")
  plan          PlanType // FREE, STARTER, PROFESSIONAL, ENTERPRISE
  status        SubscriptionStatus // ACTIVE, TRIAL, EXPIRED, CANCELLED
  startDate     DateTime @map("start_date")
  endDate       DateTime @map("end_date")
  trialEndDate  DateTime? @map("trial_end_date")
  maxMembers    Int      @default(100)
  maxCampaigns  Int      @default(2)
  maxRewards    Int      @default(5)
  maxTiers      Int      @default(3)
  features      Json     // Feature flags
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("subscriptions")
}

model UsageRecord {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  metric    String   // MEMBER_COUNT, API_CALLS, STORAGE_MB, CAMPAIGN_COUNT
  value     Int
  date      DateTime @default(now())
  
  @@index([tenantId, metric, date])
  @@map("usage_records")
}
```

### 6.2.3 Subscription Workflow

```
Tenant Register
    │
    ├── Choose Plan (Free/Trial)
    │
    ├── Create Tenant
    │
    ├── Subscription Created (TRIAL)
    │
    ├── Trial Period (14 days)
    │       │
    │       ├── Reminder: Day 10 → email "3 days left"
    │       ├── Reminder: Day 13 → email "1 day left"
    │       │
    │       ├── Upgrade → ACTIVE
    │       └── Expire → SUSPENDED (read-only)
    │
    ├── Active Subscription
    │       │
    │       ├── Monthly billing
    │       ├── Usage tracking
    │       ├── Upgrade/Downgrade/Cancel
    │       └── Renew
    │
    └── Expired/Cancelled
            │
            ├── Grace period (30 days)
            ├── Data retention
            └── Hard delete after 90 days
```

---

## 6.3 Tenant Self-Service Portal

### Màn hình cần thêm cho Host Dashboard

| Màn hình | Mô tả | Priority |
|---|---|---|
| **Tenant List (enhanced)** | Search, filter: plan, status, date; sort by members/revenue | P1 |
| **Tenant Detail (enhanced)** | Usage stats, billing history, current plan | P1 |
| **Subscription Management** | Change plan, cancel, reactivate | P1 |
| **Platform Analytics** | Total members, total points, MRR, churn rate | P1 |
| **Billing Dashboard** | Invoices, payments, failed payments | P2 |

---

## 6.4 Data Isolation Strategy

| Layer | Strategy | Implementation |
|---|---|---|
| **Database** | Row-level tenantId | Prisma schema: `tenantId @map("tenant_id")` |
| **API** | TenantGuard | Global guard extracts tenantId from JWT |
| **Cache (Redis)** | Key prefix: `tenant:{tenantId}:*` | CacheService tự động prefix |
| **File Storage (MinIO)** | Bucket prefix: `/{tenantId}/` | Upload path auto-scoped |
| **Kafka Events** | Header: `x-tenant-id` | Event producer tự động gắn header |
| **Search (ES)** | Index per tenant: `loyalty-{tenantId}-*` | Hoặc field filter: `tenantId` |
| **Analytics (ClickHouse)** | Field: `tenant_id` | WHERE clause trên mọi query |
| **Backup** | Per-tenant backup script | Script dump theo tenantId |

---

## 6.5 Feature Limit Enforcement

```typescript
// Ví dụ: Kiểm tra limit khi tạo member mới
async canCreateMember(tenantId: string): Promise<boolean> {
  const subscription = await this.prisma.subscription.findFirst({
    where: { tenantId, status: 'ACTIVE' }
  });
  
  const memberCount = await this.prisma.member.count({
    where: { tenantId, deletedAt: null }
  });
  
  return memberCount < subscription.maxMembers;
}

// Sử dụng trong service
async createMember(dto: CreateMemberDto) {
  const canCreate = await this.canCreateMember(dto.tenantId);
  if (!canCreate) {
    throw new ServiceException(
      'Member limit reached. Please upgrade your plan.',
      ErrorCodes.LIMIT_EXCEEDED,
      403
    );
  }
  // ... create member
}
```

---

## 6.6 SaaS Readiness Score

| Tiêu chí | Score | Ghi chú |
|---|---|---|
| Multi-Tenant Data Isolation | **95%** | Thiếu tenant-level encryption key |
| Tenant Provisioning | **80%** | Thiếu self-service registration flow |
| Subscription Management | **0%** | Chưa implement |
| Billing Integration | **0%** | Chưa có |
| Feature Limit Enforcement | **0%** | Chưa implement |
| Usage Tracking | **0%** | Chưa có |
| Tenant Onboarding | **30%** | Có seed data nhưng chưa có wizard |
| Host Dashboard | **60%** | Có dashboard cơ bản, thiếu SaaS metrics |
| Plan Management | **0%** | Chưa có |
| Tenant Suspension Flow | **50%** | Có suspend nhưng chưa có auto-suspend |
| **Overall SaaS Readiness** | **~35%** | Cần ưu tiên subscription & billing |
