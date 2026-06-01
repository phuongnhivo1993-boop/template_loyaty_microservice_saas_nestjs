# Gap Analysis — Loyalty Platform

> **Project state**: Scaffold only. All 12 microservices have only `GET /` returning `"Hello World!"`.
> **Frontend**: Not started (NextJS Admin, NextJS Portal, Expo Mobile).
> **Database**: No Prisma schema defined.

---

## 1. BACKEND — CRUD Endpoints NOT Implemented

| # | Service | Expected Endpoints | Status |
|---|---------|------------------|--------|
| | **Auth (API Gateway)** | | |
| 1 | Host Register | `POST /auth/host/register` | ❌ Missing |
| 2 | Host Login | `POST /auth/host/login` | ❌ Missing |
| 3 | Tenant Admin Register | `POST /auth/tenant/register` | ❌ Missing |
| 4 | Tenant Admin Login | `POST /auth/tenant/login` | ❌ Missing |
| 5 | Token Refresh | `POST /auth/refresh` | ❌ Missing |
| | **Tenant Management** | | |
| 6 | Create Tenant | `POST /tenants` | ❌ Missing |
| 7 | List Tenants | `GET /tenants` | ❌ Missing |
| 8 | Get Tenant | `GET /tenants/:id` | ❌ Missing |
| 9 | Update Tenant | `PUT /tenants/:id` | ❌ Missing |
| 10 | Delete Tenant | `DELETE /tenants/:id` | ❌ Missing |
| | **User Management** | | |
| 11 | Create User | `POST /users` | ❌ Missing |
| 12 | List Users | `GET /users` | ❌ Missing |
| 13 | Get User | `GET /users/:id` | ❌ Missing |
| 14 | Update User | `PUT /users/:id` | ❌ Missing |
| 15 | Delete User | `DELETE /users/:id` | ❌ Missing |
| | **Membership Service** | | |
| 16 | Register Member | `POST /members` | ❌ Missing |
| 17 | KYC Verification | `POST /members/:id/kyc` | ❌ Missing |
| 18 | List Members | `GET /members` | ❌ Missing |
| 19 | Get Member | `GET /members/:id` | ❌ Missing |
| 20 | Update Member | `PUT /members/:id` | ❌ Missing |
| 21 | Lock/Unlock Member | `PATCH /members/:id/status` | ❌ Missing |
| 22 | Delete Member | `DELETE /members/:id` | ❌ Missing |
| 23 | Transaction History | `GET /members/:id/history` | ❌ Missing |
| 24 | Create Tier | `POST /tiers` | ❌ Missing |
| 25 | List Tiers | `GET /tiers` | ❌ Missing |
| 26 | Update Tier | `PUT /tiers/:id` | ❌ Missing |
| 27 | Delete Tier | `DELETE /tiers/:id` | ❌ Missing |
| 28 | Get Member Tier | `GET /members/:id/tier` | ❌ Missing |
| 29 | Tier Rules | `GET /tier-rules` | ❌ Missing |
| | **Loyalty Point Service** | | |
| 30 | Get Point Wallet | `GET /point-wallets/:memberId` | ❌ Missing |
| 31 | Earn Points | `POST /points/earn` | ❌ Missing |
| 32 | Burn Points | `POST /points/burn` | ❌ Missing |
| 33 | List Transactions | `GET /points/transactions` | ❌ Missing |
| 34 | List Expirations | `GET /points/expirations` | ❌ Missing |
| 35 | Get Balance | `GET /points/balance/:memberId` | ❌ Missing |
| | **Campaign Service** | | |
| 36 | Create Campaign | `POST /campaigns` | ❌ Missing |
| 37 | List Campaigns | `GET /campaigns` | ❌ Missing |
| 38 | Get Campaign | `GET /campaigns/:id` | ❌ Missing |
| 39 | Update Campaign | `PUT /campaigns/:id` | ❌ Missing |
| 40 | Delete Campaign | `DELETE /campaigns/:id` | ❌ Missing |
| 41 | Campaign Rules | `POST /campaigns/:id/rules` | ❌ Missing |
| 42 | Campaign KPIs | `GET /campaigns/:id/analytics` | ❌ Missing |
| 43 | Campaign Status | `PATCH /campaigns/:id/status` | ❌ Missing |
| | **Reward Service** | | |
| 44 | Create Reward | `POST /rewards` | ❌ Missing |
| 45 | List Rewards | `GET /rewards` | ❌ Missing |
| 46 | Get Reward | `GET /rewards/:id` | ❌ Missing |
| 47 | Update Reward | `PUT /rewards/:id` | ❌ Missing |
| 48 | Delete Reward | `DELETE /rewards/:id` | ❌ Missing |
| 49 | Reward Inventory | `GET /rewards/:id/inventory` | ❌ Missing |
| 50 | Redeem Reward | `POST /rewards/:id/redeem` | ❌ Missing |
| 51 | Approve Redemption | `POST /rewards/:id/approve` | ❌ Missing |
| 52 | Reject Redemption | `POST /rewards/:id/reject` | ❌ Missing |
| 53 | List Orders | `GET /rewards/orders` | ❌ Missing |
| 54 | Update Delivery | `PUT /rewards/orders/:id/delivery` | ❌ Missing |
| | **Referral Service** | | |
| 55 | Create Referral Link | `POST /referral-links` | ❌ Missing |
| 56 | List Referral Links | `GET /referral-links` | ❌ Missing |
| 57 | Create Referral | `POST /referrals` | ❌ Missing |
| 58 | List Referrals | `GET /referrals` | ❌ Missing |
| 59 | Get Referral | `GET /referrals/:id` | ❌ Missing |
| 60 | Referral Stats | `GET /referrals/stats` | ❌ Missing |
| 61 | Award Referral Reward | `POST /referral-rewards` | ❌ Missing |
| | **Voucher Service** | | |
| 62 | Create Voucher | `POST /vouchers` | ❌ Missing |
| 63 | List Vouchers | `GET /vouchers` | ❌ Missing |
| 64 | Get Voucher | `GET /vouchers/:id` | ❌ Missing |
| 65 | Update Voucher | `PUT /vouchers/:id` | ❌ Missing |
| 66 | Delete Voucher | `DELETE /vouchers/:id` | ❌ Missing |
| 67 | Create Voucher Series | `POST /voucher-series` | ❌ Missing |
| 68 | List Voucher Series | `GET /voucher-series` | ❌ Missing |
| 69 | Claim Voucher | `POST /vouchers/:id/claim` | ❌ Missing |
| 70 | Redeem Voucher | `POST /vouchers/:id/redeem` | ❌ Missing |
| 71 | Expire Voucher | `POST /vouchers/:id/expire` | ❌ Missing |
| | **Promotion Service** | | |
| 72 | Create Promotion | `POST /promotions` | ❌ Missing |
| 73 | List Promotions | `GET /promotions` | ❌ Missing |
| 74 | Get Promotion | `GET /promotions/:id` | ❌ Missing |
| 75 | Update Promotion | `PUT /promotions/:id` | ❌ Missing |
| 76 | Delete Promotion | `DELETE /promotions/:id` | ❌ Missing |
| 77 | Add Condition | `POST /promotions/:id/conditions` | ❌ Missing |
| 78 | Add Action | `POST /promotions/:id/actions` | ❌ Missing |
| 79 | Update Priority | `PUT /promotions/:id/priority` | ❌ Missing |
| 80 | Create Version | `POST /promotions/:id/version` | ❌ Missing |
| | **Gamification Service** | | |
| 81 | Create Badge | `POST /badges` | ❌ Missing |
| 82 | List Badges | `GET /badges` | ❌ Missing |
| 83 | Update Badge | `PUT /badges/:id` | ❌ Missing |
| 84 | Delete Badge | `DELETE /badges/:id` | ❌ Missing |
| 85 | Create Mission | `POST /missions` | ❌ Missing |
| 86 | List Missions | `GET /missions` | ❌ Missing |
| 87 | Update Mission | `PUT /missions/:id` | ❌ Missing |
| 88 | Delete Mission | `DELETE /missions/:id` | ❌ Missing |
| 89 | Get Achievements | `GET /achievements/:memberId` | ❌ Missing |
| 90 | Award Achievement | `POST /achievements` | ❌ Missing |
| | **Notification Service** | | |
| 91 | Send Notification | `POST /notifications/send` | ❌ Missing |
| 92 | Create Template | `POST /notifications/templates` | ❌ Missing |
| 93 | List Templates | `GET /notifications/templates` | ❌ Missing |
| 94 | Update Template | `PUT /notifications/templates/:id` | ❌ Missing |
| 95 | Notification History | `GET /notifications/history` | ❌ Missing |
| 96 | Configure Channel | `POST /notifications/channels` | ❌ Missing |
| | **Analytics Service** | | |
| 97 | Dashboard | `GET /analytics/dashboard` | ❌ Missing |
| 98 | Member Analytics | `GET /analytics/members` | ❌ Missing |
| 99 | Point Analytics | `GET /analytics/points` | ❌ Missing |
| 100 | Campaign Analytics | `GET /analytics/campaigns` | ❌ Missing |
| 101 | Referral Analytics | `GET /analytics/referrals` | ❌ Missing |
| 102 | Voucher Analytics | `GET /analytics/vouchers` | ❌ Missing |
| 103 | Retention Report | `GET /analytics/retention` | ❌ Missing |
| 104 | LTV Report | `GET /analytics/ltv` | ❌ Missing |
| | **Customer 360 Service** | | |
| 105 | Customer Profile | `GET /customer360/:memberId` | ❌ Missing |
| 106 | Customer Activity | `GET /customer360/:memberId/activity` | ❌ Missing |
| 107 | Customer Summary | `GET /customer360/:memberId/summary` | ❌ Missing |

> **Total: 107+ API endpoints missing. Only `GET /` (Hello World) exists.**

---

## 2. ADMIN WEB (NextJS) — Screens NOT Implemented

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| | **Auth** | | |
| 1 | Host Login Page | Login form for host/super-admin | ❌ Missing |
| 2 | Tenant Admin Login | Login form for tenant admin | ❌ Missing |
| | **Dashboard** | | |
| 3 | Host Dashboard | Overview of all tenants, platform metrics | ❌ Missing |
| 4 | Tenant Dashboard | Tenant-specific KPIs, charts | ❌ Missing |
| | **Tenant Management** | | |
| 5 | Tenant List | CRUD table for tenants (host only) | ❌ Missing |
| 6 | Tenant Detail | View/edit tenant settings | ❌ Missing |
| 7 | Tenant Create Form | New tenant registration | ❌ Missing |
| | **User Management** | | |
| 8 | User List | CRUD table for users within tenant | ❌ Missing |
| 9 | User Detail | View/edit user profile | ❌ Missing |
| 10 | User Create Form | New user creation | ❌ Missing |
| | **Membership** | | |
| 11 | Member List | Table of all members with search/filter | ❌ Missing |
| 12 | Member Detail | Full member profile, history, points | ❌ Missing |
| 13 | Member Create | Register new member form | ❌ Missing |
| 14 | KYC Review | Approve/reject KYC submissions | ❌ Missing |
| 15 | Tier Management | CRUD for membership tiers | ❌ Missing |
| 16 | Tier Rule Builder | Configure tier upgrade rules | ❌ Missing |
| | **Loyalty Points** | | |
| 17 | Point Wallet View | Member point balance & history | ❌ Missing |
| 18 | Point Transactions | List all point transactions with filter | ❌ Missing |
| 19 | Point Expiration | View/manage expiring points | ❌ Missing |
| 20 | Manual Point Adjustment | Add/deduct points manually | ❌ Missing |
| | **Campaign** | | |
| 21 | Campaign List | CRUD table for campaigns | ❌ Missing |
| 22 | Campaign Detail | Campaign settings, rules, budget | ❌ Missing |
| 23 | Campaign Create | New campaign wizard | ❌ Missing |
| 24 | Campaign Analytics | KPI charts per campaign | ❌ Missing |
| | **Reward** | | |
| 25 | Reward Catalog | CRUD grid/list of rewards | ❌ Missing |
| 26 | Reward Detail | Edit reward settings | ❌ Missing |
| 27 | Reward Create | New reward form | ❌ Missing |
| 28 | Inventory Management | Stock levels per reward | ❌ Missing |
| 29 | Redemption Queue | Approve/reject pending redemptions | ❌ Missing |
| 30 | Order Management | Track delivery status | ❌ Missing |
| | **Referral** | | |
| 31 | Referral Links | Generate & manage referral links | ❌ Missing |
| 32 | Referral List | Table of all referrals | ❌ Missing |
| 33 | Referral Analytics | Conversion stats, charts | ❌ Missing |
| | **Voucher** | | |
| 34 | Voucher List | CRUD table of vouchers | ❌ Missing |
| 35 | Voucher Create | New voucher form | ❌ Missing |
| 36 | Voucher Series | Manage series/groups | ❌ Missing |
| 37 | Voucher Claims | Claim history | ❌ Missing |
| 38 | Voucher Redemptions | Redeem history | ❌ Missing |
| | **Promotion** | | |
| 39 | Promotion Rules | List of rules with drag priority | ❌ Missing |
| 40 | Rule Builder | IF-THEN rule editor | ❌ Missing |
| 41 | Rule Version History | Version comparison | ❌ Missing |
| | **Gamification** | | |
| 42 | Badge Management | CRUD badges & icons | ❌ Missing |
| 43 | Mission Management | CRUD missions & rewards | ❌ Missing |
| 44 | Achievement Board | Member achievements view | ❌ Missing |
| 45 | Leaderboard | Top members ranking | ❌ Missing |
| | **Notification** | | |
| 46 | Template Management | Email/SMS/Zalo templates | ❌ Missing |
| 47 | Send Notification | Compose & send ad-hoc | ❌ Missing |
| 48 | Notification History | Sent log with status | ❌ Missing |
| 49 | Channel Config | SMTP, SMS gateway setup | ❌ Missing |
| | **Analytics / Reports** | | |
| 50 | Dashboard | MAU, retention, churn, LTV charts | ❌ Missing |
| 51 | Member Reports | Cohort analysis, growth trends | ❌ Missing |
| 52 | Point Reports | Earn/burn patterns | ❌ Missing |
| 53 | Campaign Reports | ROl, conversion | ❌ Missing |
| 54 | Export | CSV/PDF export for reports | ❌ Missing |
| | **Settings** | | |
| 55 | Tenant Settings | Branding, domain, config | ❌ Missing |
| 56 | API Keys | Manage integration keys | ❌ Missing |
| 57 | Audit Log | Admin action history | ❌ Missing |

> **Total: 57 admin screens missing. Zero frontend code exists.**

---

## 3. MOBILE (Expo) — Screens NOT Implemented

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| | **Auth** | | |
| 1 | Login | User login with email/phone | ❌ Missing |
| 2 | Register | New user registration | ❌ Missing |
| 3 | Forgot Password | Password reset flow | ❌ Missing |
| | **Home / Dashboard** | | |
| 4 | Home Feed | Points balance, quick actions | ❌ Missing |
| 5 | Profile | User profile & settings | ❌ Missing |
| | **Membership** | | |
| 6 | My Membership Card | Digital membership card | ❌ Missing |
| 7 | My Tier | Current tier, progress to next | ❌ Missing |
| 8 | KYC Upload | Submit identity documents | ❌ Missing |
| | **Points** | | |
| 9 | Point Wallet | Balance, earn/burn history | ❌ Missing |
| 10 | Point Transactions | Full transaction list | ❌ Missing |
| 11 | Earn Points | Available actions to earn | ❌ Missing |
| | **Referral** | | |
| 12 | My Referral Code | Share referral code/link/QR | ❌ Missing |
| 13 | Referral History | List of referrals & rewards | ❌ Missing |
| | **Rewards** | | |
| 14 | Reward Catalog | Browse available rewards | ❌ Missing |
| 15 | Reward Detail | Description, points needed | ❌ Missing |
| 16 | Redeem | Confirm redemption | ❌ Missing |
| 17 | My Orders | Redemption history & status | ❌ Missing |
| | **Vouchers** | | |
| 18 | My Vouchers | List of owned vouchers | ❌ Missing |
| 19 | Voucher Detail | Code, expiry, usage | ❌ Missing |
| 20 | Redeem Voucher | Use voucher at store | ❌ Missing |
| | **Campaigns** | | |
| 21 | Campaign List | Active campaigns | ❌ Missing |
| 22 | Campaign Detail | Rules, rewards, progress | ❌ Missing |
| | **Gamification** | | |
| 23 | My Badges | Earned badges collection | ❌ Missing |
| 24 | Missions | Available missions & progress | ❌ Missing |
| 25 | Leaderboard | Ranking among peers | ❌ Missing |
| | **Notifications** | | |
| 26 | Notification List | In-app notification history | ❌ Missing |
| 27 | Notification Settings | Push/email preferences | ❌ Missing |
| | **Events** | | |
| 28 | Event List | Upcoming events/workshops | ❌ Missing |
| 29 | Event Detail | Register, check-in | ❌ Missing |
| 30 | QR Check-in | Scan QR at event | ❌ Missing |

> **Total: 30 mobile screens missing. Zero mobile code exists.**

---

## 4. INFRASTRUCTURE — NOT Configured

| Component | Purpose | Status |
|-----------|---------|--------|
| Prisma Schema | Database models for all 12 services | ❌ Missing |
| PostgreSQL | Primary database (per-service DB in SaaS model) | ❌ Not configured |
| Redis | Caching, Bull job queues, session store | ❌ Not configured |
| Kafka | Event bus between microservices | ❌ Not configured |
| Keycloak | SSO / Identity management (Host, Admin, Tenant, User roles) | ❌ Not configured |
| Elasticsearch | Full-text search for members, transactions | ❌ Not configured |
| MinIO | S3-compatible object storage (KYC docs, reward images) | ❌ Not configured |
| ClickHouse | Time-series analytics database | ❌ Not configured |
| Prometheus + Grafana | Monitoring & alerting | ❌ Not configured |
| Docker Compose | Local development orchestration | ❌ Missing |
| Environment Config | `.env` files for each service | ❌ Missing |

---

## 5. SHARED LIBRARIES — Empty

| Library | Purpose | Status |
|---------|---------|--------|
| `libs/common` | Shared DTOs, decorators, guards, interceptors | Empty skeleton |
| `libs/database` | Prisma service, DB connection management | Empty skeleton |
| `libs/messaging` | Kafka/RabbitMQ client wrappers | Empty skeleton |

---

## 6. CURRENT STATE SUMMARY

| Layer | Progress |
|-------|----------|
| **Backend scaffold** | 100% (12 microservices created) |
| **Backend business logic** | 0% (all return "Hello World!") |
| **Database schema** | 0% |
| **Authentication & Authorization** | 0% |
| **Admin Web (NextJS)** | 0% |
| **Loyalty Portal (NextJS)** | 0% |
| **Mobile App (Expo)** | 0% |
| **Infrastructure** | 0% |
| **Tests (business logic)** | 0% |
| **CI/CD** | 0% |

---

## 7. HOW TO USE THE TEST SCRIPT

The test script at `apps/api-gateway/test/api-flow.e2e-spec.ts` defines the **expected API contracts** for the entire platform flow:

```bash
# Run the test script (all tests skipped/todo since endpoints don't exist yet)
npx nest build api-gateway
npx jest --config ./apps/api-gateway/test/jest-e2e.json --testPathPatterns "api-flow"
```

As each endpoint is implemented, remove the `.skip` or `.todo` to validate it.
