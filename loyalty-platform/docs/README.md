# Loyalty Platform - SaaS Multi-Tenant Loyalty Microservices

## Tech Stack
- **Backend**: NestJS (monorepo), Prisma ORM, PostgreSQL, Redis, Kafka
- **Frontend**: Next.js 14 (admin + member portal), React Native (mobile)
- **Infra**: Docker Compose (7x Postgres, Redis, Kafka, MinIO, Keycloak, ClickHouse, ES, Prometheus, Grafana, Jaeger)

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

## Ports
| App | Port |
|-----|------|
| API Gateway | 3001 |
| Admin Web | 3000 |
| Member Web | 3002 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Default Logins
| Role | Email | Password |
|------|-------|----------|
| Host | host@loyalty.vn | Host@123456 |
| Admin | admin@sunshine.vn | Admin@123456 |
| Member | nguyen.van.a@sunshine.vn | Member@123456 |

## Seed Data IDs (stable)
- Tenant: `8a59c06c-e228-4ddb-8b27-2d799c1db801`
- Member: `eccf51f6-7ab2-4971-accc-a1a5396a2e33`
- Gold Tier: `tier-gold`
- Product "Ca phe sua da" (35K VND): `7792b70b-3207-445f-a593-154c75fa48b2`

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

## Key Environment Variables
- `JWT_SECRET`: loyalty_jwt_secret_key_change_in_production
- `JWT_EXPIRATION`: 24h
- `API_GATEWAY_PORT`: 3001
