# Audit Report – Round 6

## Summary
Round 6 focused on mobile app UX polish, Excel import support, rate limiting, and database optimization via indexes.

## Changes Made

### 1. Mobile App – Loading/Error/Empty States (all 6 screens)
- **HomeScreen**: Added `ActivityIndicator` while loading, error text with retry button, `ListEmptyComponent` for empty missions/vouchers.
- **WalletScreen**: Loading spinner, error with retry, empty state when no transactions.
- **RewardsScreen**: Loading spinner, error state, empty rewards message.
- **ReferralsScreen**: Loading spinner, error retry, empty state for no referrals.
- **VouchersScreen**: Loading spinner, error retry, empty vouchers message.
- **MissionsScreen**: Loading spinner, error retry, empty missions state.

Each screen uses consistent patterns: `useState` for loading/error, `useEffect` to fetch, try/catch, `ActivityIndicator`, red error text + retry button, `ListEmptyComponent` or fallback empty view.

### 2. Excel (.xlsx) Import Support
- **Backend** (`import.service.ts`): Added `importExcel()` method that reads base64-encoded .xlsx buffers via `xlsx` package, converts each sheet to JSON rows, then runs the same per-entity validation/transform/insert pipeline.
- **Backend** (`import.controller.ts`): Added `POST /:entity/excel` endpoint accepting `{ file: base64string }`.
- **Admin-web** (`ImportModal.tsx`): Added tab toggle (CSV / Excel). Excel tab shows file input; on file selection, reads as base64 via `FileReader.readAsDataURL` and posts to `/api/import/:entity/excel`.

### 3. Rate Limiting
- **Installed** `@nestjs/throttler` package.
- **Added** `ThrottlerModule.forRoot()` in `api-gateway.module.ts` with 60 requests per 60 seconds (1 req/s average).
- **Registered** `ThrottlerGuard` as a global `APP_GUARD` to protect all endpoints.

### 4. Database Indexes (Prisma)
Added `@@index` annotations to optimize queries for these frequently filtered/sorted fields:

| Model | Indexes |
|---|---|
| Member | tenantId, status, tierId, createdAt |
| PointTransaction | memberId, type, createdAt |
| Campaign | tenantId, status, startDate/endDate |
| Reward | tenantId |
| Voucher | tenantId |
| MemberVoucher | memberId, voucherId, redeemed |
| Referral | tenantId, referrerId, status |
| AuditLog | entityType, entityId, action, createdAt |
| User | tenantId |

Generated and applied migration: `20260602033740_add_database_indexes`.

### 5. Package Installation
- `xlsx` (Excel parsing)
- `@nestjs/throttler` (rate limiting guard)

## Files Changed
```
apps/api-gateway/package.json
apps/api-gateway/src/api-gateway.module.ts
apps/api-gateway/src/import/import.controller.ts
apps/api-gateway/src/import/import.service.ts
apps/mobile-app/src/screens/HomeScreen.tsx
apps/mobile-app/src/screens/WalletScreen.tsx
apps/mobile-app/src/screens/RewardsScreen.tsx
apps/mobile-app/src/screens/ReferralsScreen.tsx
apps/mobile-app/src/screens/VouchersScreen.tsx
apps/mobile-app/src/screens/MissionsScreen.tsx
apps/admin-web/src/components/ImportModal.tsx
prisma/schema.prisma
prisma/migrations/20260602033740_add_database_indexes/
```

## Test Results
- **All tests pass**: 61 passed, 18 suites (unchanged from R5).
- **Admin-web TypeScript**: Clean compile (0 errors).
- **Mobile TypeScript**: Pre-existing node_modules/jsx config warnings; no new errors.

## Backward Compatibility
All changes are non-breaking:
- New endpoints (`POST /:entity/excel`) are additive.
- ThrottlerGuard is additive (no required config).
- DB indexes are additive (no schema changes to existing columns/relations).
- ImportModal UI additions (Excel tab) don't affect CSV workflow.
- Mobile loading/error states are additive (existing rendering paths unchanged).

## Next Steps
- Add more mobile tests to complement the 61 backend tests.
- Consider adding search/filter fields to more list endpoints.
- Add import support for remaining entities (promotions, member-vouchers, etc.).
- Review ThrottlerGuard for integration test compatibility (may need to disable in test env).
