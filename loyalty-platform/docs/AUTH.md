# Authentication & Authorization

## JWT Authentication
- **Strategy**: Passport JWT (bearer token)
- **Header**: `Authorization: Bearer <token>`
- **Secret**: `JWT_SECRET` env (default: `loyalty_jwt_secret_key_change_in_production`)
- **Expiry**: 24h (configurable via `JWT_EXPIRATION`)

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "HOST|ADMIN|STAFF|MEMBER",
  "tenantId": "tenant-uuid"
}
```

### Login Endpoints
All under `POST /api/v1/auth/`:

| Endpoint | Body | Returns |
|----------|------|---------|
| host/login | { email, password } | accessToken, refreshToken |
| tenant/login | { email, password, tenantId? } | accessToken, refreshToken |
| member/login | { email, password } | accessToken, refreshToken |

## Role-Based Access Control (RBAC)

### Roles
| Role | Scope | Description |
|------|-------|-------------|
| HOST | Platform | Super admin, can access all tenants |
| ADMIN | Tenant | Tenant administrator |
| STAFF | Tenant | Tenant staff (limited access) |
| MEMBER | Self | End customer (own data only) |

### @Roles() decorator
Applied per-endpoint. If omitted, any authenticated user can access.
```typescript
@Roles('HOST', 'ADMIN')
@ApiOperation({ summary: 'Create campaign' })
create(@Body() body: CreateCampaignDto) { ... }
```

### RolesGuard (global)
- Checks `requiredRoles` metadata against `req.user.role`
- If no roles specified → allows all
- If user is null (unauthenticated) → allows (actual auth check is in JwtAuthGuard)

## Guards

| Guard | Type | Purpose |
|-------|------|---------|
| JwtAuthGuard | Route-level | Validates JWT via Passport |
| OptionalAuthGuard | Route-level | Allows anonymous access |
| RolesGuard | Global | Enforces RBAC |
| TenantGuard | Global | Enforces tenant isolation |
| ThrottlerGuard | Global | 60 req/min rate limit |

## Password Management
- Passwords hashed with bcrypt (12 rounds)
- Forgot/reset password flow via email token
- Change password (authenticated) and set password (first-time) supported
