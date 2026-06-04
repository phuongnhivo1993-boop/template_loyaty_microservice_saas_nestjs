# API Endpoints

All endpoints under `/api/v1/`. Authenticated by default. `@SkipTenantCheck()` = public.

## Auth (`/auth`)
| Method | Path | Roles | SkipTenant | Description |
|--------|------|-------|------------|-------------|
| POST | auth/host/register | None | ✅ | Register host |
| POST | auth/host/login | None | ✅ | Host login |
| POST | auth/tenant/login | None | ✅ | Tenant user login |
| POST | auth/member/login | None | ✅ | Member login |
| POST | auth/refresh | JWT | | Refresh token |
| POST | auth/change-password | JWT | | Change password |
| POST | auth/forgot-password | None | ✅ | Request reset |
| POST | auth/reset-password | None | ✅ | Reset password |

## Tenants (`/tenants`)
| Method | Path | Roles |
|--------|------|-------|
| POST | tenants | HOST, ADMIN |
| GET | tenants | HOST, ADMIN, STAFF |
| GET | tenants/:id | JWT |
| PUT | tenants/:id | JWT |
| DELETE | tenants/:id | JWT |

## Users (`/users`)
| Method | Path | Roles |
|--------|------|-------|
| POST | users | HOST, ADMIN |
| GET | users | JWT |
| GET | users/:id | JWT |
| PUT | users/:id | HOST, ADMIN |
| DELETE | users/:id | HOST, ADMIN |

## Members (`/members`)
| Method | Path | Roles | SkipTenant |
|--------|------|-------|------------|
| POST | members/register | None | ✅ |
| POST | members | HOST, ADMIN, STAFF | |
| GET | members | JWT | |
| GET | members/:id | JWT | |
| PUT | members/:id | HOST, ADMIN, STAFF | |
| DELETE | members/:id | HOST, ADMIN | |
| POST | members/:id/kyc | HOST, ADMIN, STAFF | |
| POST | members/:id/toggle-status | HOST, ADMIN, STAFF | |
| POST | members/:id/tags | HOST, ADMIN, STAFF | |
| GET | members/:id/tier-suggestion | JWT | |
| GET | members/:id/activity | JWT | |
| POST | members/:id/points | HOST, ADMIN | |

## Member Self-Service (`/me`)
| Method | Path | Description |
|--------|------|-------------|
| GET | me/profile | Own profile |
| PATCH | me/profile | Update profile |
| GET | me/wallet | Wallet + recent transactions |
| GET | me/transactions | Point transactions (paginated) |
| GET | me/badges | Own badges |
| GET | me/missions | Own missions |
| GET | me/vouchers | Own vouchers |
| GET | me/referrals | Referral code + stats + referred members |
| GET | me/notifications | Own notifications |
| POST | me/set-password | Set initial password |
| POST | me/change-password | Change password |
| POST | me/cart-redeem | Cart redeem rewards |
| GET | me/cashback | Cashback info |
| GET | me/gift-cards | Own gift cards |
| GET | me/stores | Nearby stores |
| POST | me/feedback | Submit feedback |
| GET | me/feedback | Feedback history |

## Tiers (`/tiers`)
| Method | Path | Roles |
|--------|------|-------|
| POST | tiers | HOST, ADMIN |
| GET | tiers | JWT |
| GET | tiers/:id | JWT |
| PUT | tiers/:id | HOST, ADMIN |
| DELETE | tiers/:id | HOST, ADMIN |

## Points (`/points`)
| Method | Path | Roles |
|--------|------|-------|
| GET | points/wallet/:memberId | JWT |
| POST | points/earn | HOST, ADMIN, STAFF |
| POST | points/burn | HOST, ADMIN, STAFF |
| GET | points/transactions | JWT |
| GET | points/transactions/:id | JWT |
| POST | points/adjust | HOST, ADMIN |

## Check-in (`/checkin`)
| Method | Path | Roles |
|--------|------|-------|
| POST | checkin | JWT (member) |
| GET | checkin/stats | JWT (member) |
| GET | checkin/history | JWT (member) |
| GET | checkin/admin/stats | HOST, ADMIN, STAFF |

## Campaigns (`/campaigns`)
CRUD: POST/GET/GET/PUT/DELETE. Roles: HOST, ADMIN for mutations; JWT for reads.
| Method | Path | Roles |
|--------|------|-------|
| GET | campaigns/:id/performance | HOST, ADMIN, STAFF |

## Rewards (`/rewards`)
CRUD + `POST /rewards/:id/redeem` + `GET /rewards/:id/redemptions`

## Vouchers (`/vouchers`)
CRUD + `POST /vouchers/validate` + `POST /vouchers/:id/redeem` + `POST /vouchers/batch-generate` + `GET /vouchers/stats/expired`

## Coupons (`/coupons`)
CRUD + `POST /coupons/validate` + `POST /coupons/apply`

## Products (`/products`)
CRUD with category filtering, search, stock status.

## Product Categories (`/product-categories`)
CRUD with sort order.

## Orders (`/orders`)
| Method | Path | Roles |
|--------|------|-------|
| POST | orders | HOST, ADMIN, STAFF, MEMBER |
| GET | orders | HOST, ADMIN, STAFF |
| GET | orders/:id | JWT |
| PUT | orders/:id/status | HOST, ADMIN, STAFF |
| GET | orders/member/:memberId | Varies |

Order creation auto-earns points and processes coupon usage atomically.

## Promotions (`/promotions`)
CRUD. Conditions/actions as JSON.

## Referrals (`/referrals`)
CRUD + `POST /referrals/links` + `POST /referrals/:id/convert` + `GET /referrals/stats`

## Badges (`/badges`)
CRUD with criteria JSON.

## Missions (`/missions`)
CRUD with criteria JSON + time window.

## Member Segmentation (`/member-segmentation`)
| Method | Path | Roles |
|--------|------|-------|
| GET | member-segmentation | HOST, ADMIN |
| GET | member-segmentation/summary | HOST, ADMIN |
| GET | member-segmentation/:memberId | HOST, ADMIN, STAFF |

## Member Vouchers (`/member-vouchers`)
Assign, list, redeem, QR validation.

## Stores (`/stores`)
CRUD + staff management (create, list, update, delete store staff).

## Cashback (`/cashback`)
CRUD configs + earn/redeem/balance/transactions.

## Partnership (`/partnership/brands`)
CRUD brands + partner rewards + redeem partner reward.

## Gift Cards (`/gift-cards`)
CRUD + assign to member + member gift cards + redeem balance.

## Feedback (`/feedback`)
CRUD + public read by entity type.

## Webhooks (`/webhooks/endpoints`)
CRUD + test endpoint + event logs.

## Earning Rules (`/earning-rules`)
CRUD + calculate points for amount.

## Notifications (`/notifications/templates`)
CRUD templates + send + broadcast + logs.

## Settings (`/settings`)
Platform-level and tenant-level settings (key-value JSON).

## Analytics (`/analytics`)
Points trend, member growth, campaign performance, top members, voucher stats, expiring points, leaderboard.

## Dashboard (`/dashboard`)
Summary stats for HOST/ADMIN/STAFF.

## System
- Audit Logs: GET `/audit-logs`
- Upload: POST `/upload` (multipart, images + PDF, max 5MB)
- Export: GET `/export/:entity` (CSV)
- Import: POST `/import/:entity` (CSV/Excel)
- Bulk: POST `/bulk/delete`, `/bulk/update-status`
