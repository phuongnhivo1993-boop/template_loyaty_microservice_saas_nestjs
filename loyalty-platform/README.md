# Loyalty Platform - SaaS Multi-Tenant Loyalty Microservices

A full-stack loyalty platform built with NestJS microservices and Next.js frontends, supporting multi-tenant SaaS operations with real-time updates, gamification, and analytics.

## Tech Stack

- **Backend**: NestJS (monorepo), Prisma ORM, PostgreSQL, Redis, Kafka
- **Frontend**: Next.js 14 (admin-web), Next.js 14 (member-web), React Native (mobile)
- **Infra**: Docker Compose (PostgreSQL, Redis, Kafka, MinIO, Keycloak, ClickHouse, Elasticsearch, Prometheus, Grafana, Jaeger)

## Quick Start

```bash
# Start API Gateway only (no Docker required)
cd loyalty-platform
npx nest build api-gateway
nohup node dist/apps/api-gateway/main.js > /tmp/api-gateway.log 2>&1 & disown

# Start admin web
cd apps/admin-web && nohup npx next dev > /tmp/admin-web.log 2>&1 & disown

# Start member web
cd apps/member-web && nohup npx next dev -p 3002 > /tmp/member-web.log 2>&1 & disown
```

### Ports

| App              | Port |
|------------------|------|
| API Gateway      | 3001 |
| Admin Web        | 3000 |
| Member Web       | 3002 |
| PostgreSQL       | 5432 |
| Redis            | 6379 |

## Architecture

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
    common/               # Shared types, DTOs
  prisma/
    schema.prisma         # Unified Prisma schema (all models)
    seed.ts               # Demo data
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Default Accounts

| Role   | Email                          | Password       |
|--------|--------------------------------|----------------|
| Host   | host@loyalty.vn               | Host@123456    |
| Admin  | admin@sunshine.vn             | Admin@123456   |
| Member | nguyen.van.a@sunshine.vn      | Member@123456  |

See [docs/SEED_DATA.md](docs/SEED_DATA.md) for full seed data details.

## Commands

```bash
# Build
npx nest build api-gateway

# Seed database
npx ts-node prisma/seed.ts

# Sync schema (migrate dev fails in non-interactive)
npx prisma db push --accept-data-loss

# Start with nohup (survives shell exit)
nohup node dist/apps/api-gateway/main.js > /tmp/api-gateway.log 2>&1 & disown
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Endpoints](docs/API_ENDPOINTS.md)
- [Authentication & Authorization](docs/AUTH.md)
- [Database Schema](docs/DATABASE.md)
- [Multi-Tenancy](docs/MULTI_TENANCY.md)
- [Features](docs/FEATURES.md)
- [Seed Data](docs/SEED_DATA.md)
- [WebSocket Events](docs/WEBSOCKET.md)
- [Security](docs/security/)
- [QA & Test Plans](docs/qa/)
- [PRD Documents](docs/prd/)
