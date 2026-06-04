# Architecture

## Monorepo Structure
```
loyalty-platform/
  apps/
    api-gateway/          # NestJS - central API gateway (port 3001)
    membership-service/   # NestJS - member CRUD, tiers, KYC (port 3002)
    loyalty-service/      # NestJS - points wallet, earn/burn (port 3003)
    campaign-service/     # NestJS - campaigns, rules (port 3004)
    reward-service/       # NestJS - reward catalog, redemption (port 3005)
    referral-service/     # NestJS - referral links, tracking (port 3006)
    voucher-service/      # NestJS - voucher series, redemption (port 3007)
    promotion-service/    # NestJS - promotion engine (port 3008)
    gamification-service/ # NestJS - badges, missions, leaderboard (port 3009)
    notification-service/ # NestJS - email, SMS, push (port 3010)
    analytics-service/    # NestJS - dashboards, ClickHouse (port 3011)
    customer360-service/  # NestJS - unified profiles (port 3012)
    admin-web/            # Next.js 14 - admin dashboard (port 3000)
    member-web/           # Next.js 14 - member portal (port 3002)
    mobile-app/           # React Native - mobile app
  libs/
    common/               # Shared types, DTOs (mostly empty)
  prisma/
    schema.prisma         # Unified Prisma schema (all models)
    seed.ts               # Demo data
```

## API Gateway Architecture
The API gateway is the single entry point. It contains ALL business logic directly (44 modules imported):

**Module groups:**
1. **Infrastructure**: PrismaModule, AuthModule, ThrottlerModule, ScheduleModule, MulterModule
2. **Tenant Management**: TenantModule, UserModule, SettingsModule
3. **Member Management**: MemberModule, MemberSelfModule, TierModule, PointModule, CheckinModule
4. **Commerce**: ProductModule, ProductCategoryModule, OrderModule, CouponModule, StoreModule
5. **Promotions**: CampaignModule, RewardModule, VoucherModule, PromotionModule, MemberVoucherModule
6. **Engagement**: ReferralModule, GamificationModule, MemberSegmentationModule
7. **Additional**: CashbackModule, PartnershipModule, GiftCardModule, FeedbackModule, WebhookModule, EarningRuleModule
8. **System**: DashboardModule, AnalyticsModule, NotificationModule, AuditLogModule, ExportModule, ImportModule, BulkModule, UploadModule
9. **Real-time**: WebSocketModule

## Global Guards (execution order)
1. **ThrottlerGuard** - Rate limiting (60 req/min)
2. **RolesGuard** - Checks user.role against @Roles() decorator
3. **TenantGuard** - Enforces tenant data isolation

## Response Format
All endpoints return wrapped responses via TransformInterceptor:
```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": [],
  "pagination": { "page": 1, "size": 20, "totalItems": 100, "totalPages": 5 }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "errors": ["Error message"]
}
```

## Common Query Parameters (list endpoints)
- `page` (default: 1)
- `limit` (default: 20)
- `search` (full-text search)
- `sort` (field_direction, e.g. `createdAt_desc`)
- `tenantId` (auto-scoped by TenantGuard)

## Microservices (standalone)
Each microservice app is a standalone NestJS HTTP service with its own Prisma client. They share the same schema but operate on different PostgreSQL instances (defined in docker-compose). Currently, the API Gateway implements most business logic directly; microservices exist as parallel implementations that can be swapped in.

## Kafka Event Bus
Kafka is provisioned (port 9092) for async communication between microservices. Not yet deeply integrated in code — Bull (Redis queue) is also configured for job processing.
