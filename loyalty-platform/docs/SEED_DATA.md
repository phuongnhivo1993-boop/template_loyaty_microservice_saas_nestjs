# Demo Seed Data

Run: `npx ts-node prisma/seed.ts`
Note: Use `npx prisma db push --accept-data-loss` instead of migrate for schema sync.

## Host
| Field | Value |
|-------|-------|
| Email | host@loyalty.vn |
| Password | Host@123456 |

## Tenant
| Field | Value |
|-------|-------|
| Name | Sunshine Real Estate |
| Domain | sunshine.loyalty.vn |
| ID | `8a59c06c-e228-4ddb-8b27-2d799c1db801` |

## Tenant Admin
| Field | Value |
|-------|-------|
| Email | admin@sunshine.vn |
| Password | Admin@123456 |

## Tiers
| ID | Name | Min Points | Max Points | Color | Benefits |
|----|------|------------|------------|-------|----------|
| tier-member | Member | 0 | 999 | #94a3b8 | Basic |
| tier-silver | Silver | 1,000 | 4,999 | #c0c0c0 | 5% discount |
| tier-gold | Gold | 5,000 | 19,999 | #f59e0b | 10% discount, priority support |
| tier-platinum | Platinum | 20,000 | 99,999 | #6366f1 | 15% discount, dedicated support |
| tier-diamond | Diamond | 100,000 | 999,999 | #06b6d4 | 20% discount, VIP treatment |

## Member
| Field | Value |
|-------|-------|
| Email | nguyen.van.a@sunshine.vn |
| Password | Member@123456 |
| Full Name | Nguyen Van A |
| Phone | 0909000111 |
| Tier | Gold |
| Total Points | 15,164 |
| Available Points | 12,164 |
| ID | `eccf51f6-7ab2-4971-accc-a1a5396a2e33` |

### Member Point History
1. EARN +15,000 (Chao mung)
2. BURN -3,000 (Doi thuong)

## Campaign
| Field | Value |
|-------|-------|
| Name | Summer Promotion 2026 |
| Period | June 1 - Aug 31, 2026 |
| Budget | 50,000,000 VND |

## Rewards
| Name | Points Required | Quantity |
|------|----------------|----------|
| Voucher 100k | 2,000 | 100 |
| Cashback 50k | 1,000 | 200 |

## Voucher
| Code | Type | Value | Max Usage | Expires |
|------|------|-------|-----------|---------|
| SUMMER2026 | % discount | 15% | 1,000 | Dec 2026 |

Assigned to member via MemberVoucher with QR code.

## Promotion Rule
- **Name**: Gold Member Bonus
- **Condition**: tier=Gold AND purchaseAmount >= 1,000,000
- **Action**: addPoints 500

## Badges
| Name | Criteria |
|------|----------|
| Top Seller | 10+ sales |
| VIP Customer | 50,000+ points |

## Mission
| Name | Criteria | Reward | Period |
|------|----------|--------|--------|
| Refer 5 customers | 5 referrals | 2,000 points | June 2026 |

## Point Earning Rule
| Name | Points Per Unit | Notes |
|------|----------------|-------|
| Mac dinh 1% | 0.001 | 1 point per 1,000 VND |

## Product Categories
| Name | Slug |
|------|------|
| Thuc pham & Do uong | thuc-pham-do-uong |
| Thoi trang | thoi-trang |
| Dien tu | dien-tu |

## Products
| Name | Price (VND) | SKU | Stock | Category |
|------|-------------|-----|-------|----------|
| Ca phe sua da | 35,000 | CF-001 | 200 | Thuc pham & Do uong |
| Banh mi thit nuong | 25,000 | BM-001 | 100 | Thuc pham & Do uong |
| Tra sua tran chau | 45,000 | TS-001 | 150 | Thuc pham & Do uong |
| Nuoc suoi 500ml | 10,000 | NS-001 | 500 | Thuc pham & Do uong |
| Snack khoai tay | 15,000 | SN-001 | 300 | Thuc pham & Do uong |

Product IDs stable after each seed. "Ca phe sua da" ID: `7792b70b-3207-445f-a593-154c75fa48b2`

## Coupons
| Code | Type | Value | Min Amount | Max Discount | Max Usage | Status |
|------|------|-------|------------|--------------|-----------|--------|
| WELCOME10 | PERCENTAGE | 10% | 50,000 | null | 1,000 | ACTIVE |
| FLAT50K | FIXED | 50,000 VND | 200,000 | null | 500 | ACTIVE |
| SUMMER20 | PERCENTAGE | 20% | 100,000 | 100,000 | 200 | ACTIVE |
