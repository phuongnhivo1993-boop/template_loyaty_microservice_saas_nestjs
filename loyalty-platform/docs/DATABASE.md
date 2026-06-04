# Database Schema

**ORM**: Prisma ORM (single unified schema: `prisma/schema.prisma`)
**Database**: PostgreSQL (primary on port 5432)
**Migrations**: `prisma/migrations/20260603000001_init/`

## Enums
- **UserRole**: `HOST | ADMIN | STAFF | MEMBER`
- **TenantStatus**: `ACTIVE | SUSPENDED | DISABLED`
- **MemberStatus**: `ACTIVE | INACTIVE | LOCKED | PENDING_KYC`
- **OrderStatus**: `PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED`
- **StoreStatus**: `ACTIVE | INACTIVE | CLOSED`

## Core Models

### Tenant (multi-tenant root)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | String | |
| domain | String | UNIQUE - used for subdomain lookup |
| email | String | |
| phone | String? | |
| address | String? | |
| logo | String? | URL |
| status | TenantStatus | ACTIVE/SUSPENDED/DISABLED |
| hostId | UUID | FK -> Host |

All tenant-scoped models have: `tenantId UUID FK` with `@@index([tenantId])`

### Host (platform super admin)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | String | UNIQUE |
| password | String | bcrypt hashed |
| name | String | |

Has many: Tenant

### User (tenant admin/staff)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | String | UNIQUE |
| password | String | bcrypt |
| fullName | String | |
| phone | String? | |
| role | UserRole | ADMIN or STAFF |
| tenantId | UUID | FK -> Tenant |

### Member (loyalty customer)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | String | UNIQUE |
| password | String? | nullable (set later) |
| fullName | String | |
| phone | String? | |
| avatar | String? | |
| birthday | DateTime? | |
| tags | String[] | PostgreSQL array |
| status | MemberStatus | ACTIVE/INACTIVE/LOCKED/PENDING_KYC |
| kycVerified | Boolean | |
| totalPoints | Int | lifetime earned |
| availablePoints | Int | current balance |
| tenantId | UUID | FK -> Tenant |
| tierId | String? | FK -> Tier |

### Tier
| Field | Type | Notes |
|-------|------|-------|
| id | String | e.g. "tier-gold" |
| name | String | |
| minPoints | Int | |
| maxPoints | Int | |
| pointsMultiplier | Float | e.g. 1.0 = 1x points |
| benefits | String | text description |
| color | String | hex color for UI |
| tenantId | UUID | FK -> Tenant |

### PointTransaction
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| memberId | UUID | FK -> Member |
| type | String | EARN/BURN/EXPIRE/ADJUST |
| amount | Int | positive = earn, negative = burn |
| balance | Int | running balance after tx |
| reason | String | description |
| reference | String? | order code, etc. |

### Order
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| orderCode | String | UNIQUE |
| memberId | UUID | FK -> Member |
| tenantId | UUID | FK -> Tenant |
| storeId | UUID? | FK -> Store |
| status | OrderStatus | PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED |
| subtotal | Float | |
| discount | Float | |
| shippingFee | Float | |
| tax | Float | |
| total | Float | |
| pointsEarned | Int | auto-calculated |
| pointsUsed | Int | redeemed points |
| couponCode | String? | applied coupon |
| notes | String? | |
| shippingAddress | Json? | JSON object |
| paymentMethod | String? | | 

### OrderItem
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| orderId | UUID | FK -> Order |
| productId | UUID? | FK -> Product |
| name | String | snapshot at order time |
| price | Float | |
| quantity | Int | |
| subtotal | Float | |

### Product
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | String | |
| slug | String | UNIQUE with tenantId |
| description | String? | |
| price | Float | |
| compareAtPrice | Float? | original/comparison price |
| costPrice | Float? | |
| imageUrl | String? | |
| unit | String | e.g. "ly", "cai", "chai" |
| stock | Int | |
| sku | String | UNIQUE with tenantId |
| barcode | String? | |
| status | String | ACTIVE/INACTIVE/OUT_OF_STOCK |
| categoryId | UUID? | FK -> ProductCategory |
| tenantId | UUID | FK -> Tenant |

### ProductCategory
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | String | |
| slug | String | UNIQUE with tenantId |
| description | String? | |
| icon | String? | |
| sortOrder | Int | |
| tenantId | UUID | FK -> Tenant |

### Coupon
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| code | String | UNIQUE with tenantId |
| type | String | PERCENTAGE or FIXED |
| value | Float | e.g. 10 = 10% or 50000 = 50K VND |
| minAmount | Float | minimum order amount |
| maxDiscount | Float? | max discount for percentage type |
| maxUsage | Int | total usage limit |
| usedCount | Int | current usage count |
| maxUsagePerMember | Int? | per-member limit |
| description | String? | |
| startDate | DateTime | |
| endDate | DateTime | |
| status | String | ACTIVE/INACTIVE/EXPIRED |
| tenantId | UUID | FK -> Tenant |

### CouponUsage
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| couponId | UUID | FK -> Coupon |
| memberId | UUID | FK -> Member |
| orderId | UUID? | FK -> Order |
| discountAmount | Float | actual discount given |

### DailyCheckin
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| memberId | UUID | FK -> Member |
| date | DateTime | date only |
| streak | Int | consecutive days |
| pointsAwarded | Int | |
| UNIQUE | [memberId, date] | one check-in per day |

### Referral
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| code | String | UNIQUE |
| referrerId | UUID | FK -> Member |
| refereeId | UUID? | FK -> Member |
| status | String | PENDING/CONVERTED/REWARDED |
| rewardGiven | Boolean | |
| tenantId | UUID | FK -> Tenant |

### Badge
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | String | |
| description | String? | |
| iconUrl | String? | |
| criteria | Json | JSON criteria |
| tenantId | UUID | FK -> Tenant |

### Mission
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | String | |
| description | String? | |
| pointsReward | Int | |
| criteria | Json | JSON criteria |
| startDate | DateTime? | |
| endDate | DateTime? | |
| tenantId | UUID | FK -> Tenant |

## Full Model List (30+ models)
See `prisma/schema.prisma` for complete definitions.

Additional models not detailed above:
- Settings (scope + scopeId pattern)
- Campaign, Reward, Voucher, MemberVoucher
- Promotion, PointEarningRule
- Store, StoreStaff
- CashbackConfig, CashbackTransaction
- PartnerBrand, PartnerReward
- WebhookEndpoint, WebhookEventLog
- GiftCard, MemberGiftCard
- MemberFeedback, NotificationLog, NotificationTemplate
- AuditLog
