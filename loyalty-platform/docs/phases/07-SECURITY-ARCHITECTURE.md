# Phase 7: Security & Architecture Review

## 7.1 Security Review

### 7.1.1 Authentication (Hiện tại)

| Component | Implementation | Status | Ghi chú |
|---|---|---|---|
| **JWT Strategy** | Passport JWT Bearer token | ✅ | |
| **JWT Expiry** | 24h (access token) | ✅ | |
| **Refresh Token** | 7 days | ✅ | Có endpoint refresh |
| **Password Hashing** | bcrypt 12 rounds | ✅ | |
| **Keycloak SSO** | Realm config có sẵn, chưa tích hợp code | ⚠️ | Config có, code chưa dùng |
| **OTP Login** | ❌ Chưa implement | ❌ | |
| **Social Login** | Google/Facebook/Zalo | ❌ | |
| **Token Blacklist** | Logout không revoke token | ❌ | Cần Redis blacklist |

### 7.1.2 Authorization (Hiện tại)

| Component | Implementation | Status |
|---|---|---|
| **RBAC Roles** | HOST, ADMIN, STAFF, MEMBER | ✅ |
| **@Roles() decorator** | Route-level role check | ✅ |
| **RolesGuard** | Global guard kiểm tra roles | ✅ |
| **TenantGuard** | Row-level data isolation | ✅ |
| **@SkipTenantCheck()** | Public endpoints | ✅ |
| **Permission Matrix** | Granular permissions per user | ❌ |

### 7.1.3 Security Vulnerabilities Assessment

| Vulnerability | Risk | Hiện tại | Fix |
|---|---|---|---|
| **No Rate Limiting on Auth** | **HIGH** | Không có rate limit riêng cho auth | Thêm rate limit: 5 attempts/15 phút |
| **No Account Lockout** | **HIGH** | Có thể brute force password | Lock account sau 5 failed attempts |
| **No PII Encryption at Rest** | **MEDIUM** | SĐT, Email, CMND lưu plaintext | Mã hóa AES-256-GCM |
| **No Audit Trail for Auth** | **MEDIUM** | Không log failed login attempts | Log tất cả auth events |
| **No CSRF Protection** | **MEDIUM** | Cookie-based sessions không có CSRF | Double-submit cookie |
| **Token không thể revoke** | **MEDIUM** | Logout không invalidate token | Redis blacklist + short-lived tokens |
| **No File Upload Scanning** | **MEDIUM** | Upload files không scan virus | ClamAV integration |
| **No API Key Rotation** | **LOW** | API keys không có expiry | Auto rotation policy |
| **No SQL Injection** | **LOW** | Prisma ORM bảo vệ | OK (parameterized queries) |
| **XSS Protection** | **LOW** | React/Next.js sanitize output | OK |
| **Helmet Middleware** | **LOW** | HTTP headers security | ✅ Có helmet |
| **CORS Config** | **LOW** | Whitelist allowed origins | ⚠️ Cần kiểm tra production |

### 7.1.4 Security Recommendations (Priority)

| Priority | Action | Mô tả |
|---|---|---|
| **P0** | Add Rate Limiting cho auth endpoints | 5 attempts/15 phút |
| **P0** | Add Account Lockout | Tự động lock sau 5 failed login |
| **P1** | Implement Token Blacklist | Redis set cho revoked tokens |
| **P1** | Add PII Encryption | Mã hóa phone, email, CMND, address |
| **P1** | Add Auth Audit Log | Log login success/fail với IP, User-Agent |
| **P1** | Add OTP Login | SMS OTP for member login |
| **P2** | Integrate Keycloak | SSO cho admin/staff users |
| **P2** | Add Permission Matrix | Granular permissions (CRUD per entity) |
| **P2** | API Keys for Third-party | Generate + scope + expiry |
| **P2** | File Upload Scanning | ClamAV / VirusTotal |

---

## 7.2 Architecture Review

### 7.2.1 Current Architecture

```
                    ┌──────────────┐
                    │  API Gateway │ (Port 3001)
                    │  (Monolith)  │ ← ALL business logic here
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌───┴────┐
        │ Microservice│ │ Micro  │ │ Micro  │ (ALL STUBS)
        │ membership │ │ loyalty│ │campaign│
        └───────────┘ └────────┘ └────────┘
```

### 7.2.2 Architecture Issues

| Issue | Severity | Mô tả | Fix |
|---|---|---|---|
| **Monolith disguised as microservices** | **HIGH** | API Gateway chứa 100% logic, microservices là stub | Di chuyển logic từ API Gateway → microservices |
| **Kafka không được dùng** | **HIGH** | Kafka có trong docker-compose nhưng code không dùng | Implement event-driven communication |
| **No distributed tracing** | **MEDIUM** | Jaeger có sẵn nhưng không tích hợp | Thêm OpenTelemetry instrumentation |
| **No circuit breaker** | **MEDIUM** | Microservices call nhau không có fallback | Thêm resilient patterns |
| **Shared database (single schema)** | **LOW** | Tất cả service dùng 1 Prisma schema | OK (shared DB approach) |
| **No API versioning** | **LOW** | Routes không có version prefix | Thêm `/api/v1/` prefix |

### 7.2.3 Target Architecture (Event-Driven Microservices)

```
                          ┌─────────────┐
                          │  API Gateway │ (Light proxy, auth, rate limit)
                          └──────┬───────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     │                           │                           │
┌────┴────┐                ┌────┴────┐                ┌────┴────┐
│Membership│               │ Loyalty │               │ Campaign │
│ Service  │               │ Service │               │ Service  │
└────┬────┘               └────┬────┘               └────┬────┘
     │                         │                         │
     └─────────────────────────┼─────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │     Kafka Event Bus  │
                    └──────────┬──────────┘
                               │
     ┌──────────┬──────────┬───┴───┬──────────┬──────────┐
     │          │          │       │          │          │
┌────┴────┐ ┌──┴────┐ ┌──┴────┐ ┌┴────┐ ┌───┴───┐ ┌───┴───┐
│ Voucher │ │Promo │ │Gamify │ │Notif│ │Analyt │ │Cust360│
│ Service │ │Service│ │Service│ │Svc  │ │Service│ │Service│
└─────────┘ └──────┘ └───────┘ └─────┘ └───────┘ └───────┘
```

### 7.2.4 Event Catalog

| Event | Producer | Consumers | Payload |
|---|---|---|---|
| `member.registered` | Membership | Loyalty, Notification, Analytics, Customer360 | `{memberId, tenantId, tierId}` |
| `member.kyc_approved` | Membership | Notification, Analytics | `{memberId, tenantId}` |
| `member.tier_changed` | Membership | Loyalty, Notification, Analytics, Customer360 | `{memberId, oldTier, newTier}` |
| `points.earned` | Loyalty | Notification, Analytics, Customer360, Gamification | `{memberId, amount, source}` |
| `points.burned` | Loyalty | Notification, Analytics, Customer360 | `{memberId, amount, source}` |
| `points.expired` | Loyalty | Notification, Analytics | `{memberId, amount}` |
| `order.created` | API Gateway | Loyalty, Analytics, Customer360 | `{orderId, memberId, total}` |
| `order.delivered` | API Gateway | Loyalty, Voucher, Analytics, Customer360 | `{orderId, memberId, total}` |
| `referral.created` | Referral | Notification, Analytics | `{referralId, referrerId, refereeId}` |
| `referral.converted` | Referral | Loyalty, Notification, Analytics, Gamification | `{referralId, referrerId, reward}` |
| `campaign.started` | Campaign | Notification, Analytics | `{campaignId, tenantId, audience}` |
| `campaign.ended` | Campaign | Analytics | `{campaignId, tenantId, stats}` |
| `reward.redeemed` | Reward | Loyalty, Notification, Analytics, Customer360 | `{rewardId, memberId, points}` |
| `achievement.unlocked` | Gamification | Notification, Analytics | `{memberId, badgeId/missionId}` |

### 7.2.5 Database Per Service (Target)

| Service | Database | Tables |
|---|---|---|
| API Gateway | `loyalty_api_gateway` | tenants, users, hosts, audit_logs, settings |
| Membership | `loyalty_membership` | members, tiers, tier_rules, member_tiers, kyc_docs |
| Loyalty | `loyalty_loyalty` | point_wallets, point_transactions, point_expirations |
| Campaign | `loyalty_campaign` | campaigns, campaign_rules, campaign_targets |
| Reward | `loyalty_reward` | rewards, reward_inventories, reward_orders |
| Referral | `loyalty_referral` | referrals, referral_links, referral_rewards |
| Voucher | `loyalty_voucher` | vouchers, voucher_series, voucher_redemptions |
| Promotion | `loyalty_promotion` | promotions, promotion_conditions, promotion_actions |
| Gamification | `loyalty_gamification` | badges, missions, achievements |
| Notification | `loyalty_notification` | templates, logs, channel_configs |
| Analytics | `loyalty_analytics` | ClickHouse dashboards, materialized views |
| Customer360 | `loyalty_customer360` | Unified profiles (read-only cache) |

### 7.2.6 Infrastructure Components

| Component | Purpose | Status | Notes |
|---|---|---|---|
| **PostgreSQL x7** | Primary databases | ✅ Docker config | 7 instances for service groups |
| **Redis** | Cache + Bull queues | ✅ Docker config | Chưa dùng cache |
| **Kafka** | Event bus | ✅ Docker config | Chưa integrate |
| **Keycloak** | SSO | ✅ Docker + realm config | Chưa tích hợp code |
| **MinIO** | File storage (KYC, images) | ✅ Docker config | Chưa tích hợp code |
| **ClickHouse** | Analytics DB | ✅ Docker config | Chưa integrate |
| **Elasticsearch** | Full-text search | ✅ Docker config | Chưa integrate |
| **Prometheus** | Metrics | ✅ Docker + config | Chưa instrument code |
| **Grafana** | Dashboards | ✅ Docker + config | Chưa có custom dashboards |
| **Jaeger** | Distributed tracing | ✅ Docker config | Chưa integrate |

### 7.2.7 Infrastructure Migration Plan

| Phase | Action | Timeline |
|---|---|---|
| **Phase 1** | Move business logic from API Gateway → dedicated microservices | 4 weeks |
| **Phase 2** | Implement Kafka event bus + event producers/consumers | 2 weeks |
| **Phase 3** | Integrate Redis caching (CacheService) | 1 week |
| **Phase 4** | Integrate MinIO file storage | 1 week |
| **Phase 5** | Integrate Keycloak SSO | 2 weeks |
| **Phase 6** | Add ClickHouse analytics | 2 weeks |
| **Phase 7** | Add Prometheus/Grafana custom metrics | 1 week |
| **Phase 8** | Add OpenTelemetry + Jaeger | 1 week |
| **Phase 9** | Add Elasticsearch for search | 1 week |
| **Total** | | **~15 weeks** |

---

## 7.3 API Architecture

### 7.3.1 API Versioning

```
Hiện tại: /members, /campaigns, /rewards...
Target:   /api/v1/members, /api/v1/campaigns...
```

### 7.3.2 Response Format

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 7.3.3 Error Codes

| Code | Mô tả | HTTP Status |
|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | Sai email/password | 401 |
| `AUTH_TOKEN_EXPIRED` | Token hết hạn | 401 |
| `AUTH_TOKEN_REVOKED` | Token đã revoke | 401 |
| `FORBIDDEN` | Không có quyền | 403 |
| `TENANT_SUSPENDED` | Tenant bị khóa | 403 |
| `LIMIT_EXCEEDED` | Vượt quá giới hạn plan | 403 |
| `NOT_FOUND` | Không tìm thấy | 404 |
| `CONFLICT` | Duplicate (email, code, slug) | 409 |
| `VALIDATION_ERROR` | Input không hợp lệ | 422 |
| `RATE_LIMIT_EXCEEDED` | Quá nhiều request | 429 |
| `INTERNAL_ERROR` | Lỗi server | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily down | 503 |
