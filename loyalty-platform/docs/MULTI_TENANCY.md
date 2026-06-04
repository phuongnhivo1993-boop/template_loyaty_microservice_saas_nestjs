# Multi-Tenancy System

**Strategy**: Shared database, row-level isolation via `tenantId` column

## TenantGuard (global APP_GUARD)
Runs on EVERY request. Logic:

1. **Skip check** if `@SkipTenantCheck()` decorator is present (public endpoints)
2. Extract `req.user.tenantId` OR decode JWT manually to get `tenantId` (works before Passport runs)
3. If `role === 'HOST'`: allows access to any tenant; sets `req.tenantId = req.query.tenantId || user.tenantId`
4. If non-HOST and `req.query.tenantId` differs from JWT `tenantId`: **throws 403 Forbidden** (cross-tenant access denied)
5. Otherwise: sets `req.tenantId = user.tenantId` (auto-scoped)

## @SkipTenantCheck() decorator
Applied to public endpoints that don't need tenant context:
- All auth endpoints (`/auth/*`)
- Public member registration (`POST /members/register`)
- Public feedback (`GET /feedback/public/:entityType/:entityId`)

## @CurrentTenant() param decorator
Extracts `req.tenantId` for use in controllers:
```typescript
@Get()
findAll(@CurrentTenant() tenantId: string, @Query() query: TierQueryDto) { ... }
```

## Controller Pattern
All tenant-scoped controllers use `req.tenantId ?? query.tenantId` pattern:
```typescript
// Before TenantGuard: services relied on explicit tenantId from query
// After: TenantGuard sets req.tenantId, controllers use it as default
findAll(@Req() req: any, @Query() query: TierQueryDto) {
    return this.tierService.findAll(req.tenantId ?? query.tenantId, ...);
}

create(@Req() req: any, @Body() body: CreateTierDto) {
    return this.tierService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
}
```

## Database Schema
All tenant-scoped models have:
```prisma
tenantId        String   @map("tenant_id")
@@index([tenantId])
```

Models with tenant-scoped unique constraints:
- `Product`: `@@unique([slug, tenantId])`, `@@unique([sku, tenantId])`
- `ProductCategory`: `@@unique([slug, tenantId])`
- `Coupon`: `@@unique([code, tenantId])`
- `Settings`: `@@unique([scope, scopeId, key])`

## Key Models with tenantId
User, Member, Tier, Campaign, Reward, Voucher, Promotion, Referral, Badge, Mission, NotificationLog, NotificationTemplate, PointEarningRule, Store, CashbackConfig, PartnerBrand, WebhookEndpoint, GiftCard, ProductCategory, Product, Order, Coupon

## Tenant Entity
```prisma
model Tenant {
  id      String       @id @default(uuid())
  name    String
  domain  String       @unique
  email   String
  phone   String?
  address String?
  logo    String?
  status  TenantStatus @default(ACTIVE)
  hostId  String       @map("host_id")
  host    Host         @relation(fields: [hostId], references: [id])
  // hasMany: User, Member, Tier, Campaign, Reward, Voucher, ...
}
```

## Tenant Resolution for Public Registration
Tenant is resolved from `body.tenantDomain` using `MemberService.findTenantByDomain()` or passed directly as `body.tenantId`.
