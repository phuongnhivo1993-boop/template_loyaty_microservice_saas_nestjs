# Key Features

## 1. Product & Order System
- Multi-tenant product catalog with categories
- Product fields: name, slug, price, compareAtPrice, costPrice, imageUrl, unit, stock, sku, barcode, status
- Unique per tenant: `[slug, tenantId]`, `[sku, tenantId]`
- Order lifecycle: PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED | CANCELLED | REFUNDED
- Automatic point earning on order creation
- Coupon application + discount calculation
- Points redemption support
- Order cancellation with **automatic point reversal**
- **Order status change timeline** via `statusHistory` JSON + `GET /orders/:id/timeline`
- **Import products** via CSV/Excel
- **Export products/orders** to CSV
- WebSocket real-time events: `order.created`, `order.status_changed`

**Files**: `apps/api-gateway/src/{product,product-category,order}/`

## 2. Member Segmentation (RFM)
- **R**ecency (days since last order): 5(<=7d) → 4(<=30) → 3(<=60) → 2(<=90) → 1(>90)
- **F**requency (order count): 5(>=10) → 4(>=5) → 3(>=3) → 2(>=2) → 1(>=0)
- **M**onetary (total spend VND): 5(>=10M) → 4(>=5M) → 3(>=1M) → 2(>=500K) → 1(<500K)
- Segments: Champions(13-15) → Loyal(10-12) → Potential(7-9) → New(5-6) → AtRisk(3-4) → Lost(0-2)
- **Filter members by segment**
- **Export segment data** as CSV

**Files**: `apps/api-gateway/src/member-segmentation/`

## 3. Coupon Engine
- Types: PERCENTAGE (e.g., 10% off) and FIXED (e.g., 50,000 VND off)
- Config: minAmount, maxDiscount, maxUsage, maxUsagePerMember, validity dates
- Unique per tenant: `[code, tenantId]`
- Usage tracked via CouponUsage (coupon + member + order + discountAmount)
- Validate endpoint: checks code, min amount, usage limits, expiry, per-member limits
- Apply endpoint: calculates discount without recording (usage recorded at order creation)
- Integrated into OrderService for atomic coupon processing

**Files**: `apps/api-gateway/src/coupon/`

## 4. Daily Check-in
- One check-in per day per member (unique: [memberId, date])
- Streak tracking (consecutive days)
- Points awarded per check-in
- Endpoints: POST (check-in), GET stats, GET history (monthly)
- Admin analytics per tenant

**Files**: `apps/api-gateway/src/checkin/`

## 5. Referral System
- Unique referral code per referrer (`REF-{memberId[:8]}`)
- Status flow: PENDING -> CONVERTED -> REWARDED
- Reward tracking
- Member self-service: view referral code, referred members, stats

**Files**: `apps/api-gateway/src/referral/`

## 6. Gamification (Badges & Missions)
- **Badges**: criteria as JSON (e.g., `{ salesCount: { gte: 10 } }`), icon URL
- **Missions**: time-limited (startDate/endDate), points reward, criteria JSON (e.g., `{ referralCount: 5 }`)
- Both tenant-scoped
- Member can view earned badges and mission progress

**Files**: `apps/api-gateway/src/gamification/`

## 7. Point Earning Rules
- Configurable `pointsPerUnit` (e.g., 0.001 = 1 point per 1,000 VND)
- Min/max amount constraints, category-based rules
- Status control (ACTIVE/INACTIVE)
- Calculate endpoint: `GET /earning-rules/calculate?tenantId=X&amount=50000`

**Files**: `apps/api-gateway/src/earning-rule/`

## 8. Additional Features
- **Stores**: Multi-outlet management, staff with PIN codes, opening hours
- **Cashback**: Configurable rates, earn/redeem, per-member balance
- **Gift Cards**: Physical/digital, assign to members, balance tracking
- **Partnership**: Partner brands with commissions, partner-specific rewards
- **Webhooks**: Configurable endpoints, event subscriptions, delivery logs
- **Feedback/Ratings**: 1-5 star reviews on entities
- **Audit Log**: Automatic CRUD logging via interceptor
- **Import/Export**: CSV and Excel for members, campaigns, rewards, vouchers
- **Upload**: File upload with type/size validation (images + PDF, max 5MB)

## 9. Real-time WebSocket
- socket.io on `/ws` namespace
- JWT authentication on connect
- Room-based routing: `member:{id}`, `admin`, `tenant:{id}`
- Events: order.created, order.status_changed, points.earned, coupon.applied, notification
- **Redis adapter** for multi-instance scaling (@socket.io/redis-adapter)
- **Connection status indicator** in admin UI (connected/disconnected/reconnecting)
- **Event history/replay** via WebSocketEventLog model
- **Ping/pong keepalive** with reconnection backoff

## 10. Multi-Tenancy
- Row-level isolation via tenantId column on all core entities
- TenantGuard (global): auto-scopes queries to user's tenant
- HOST role can access any tenant
- Cross-tenant access blocked with 403
- **Subdomain-based tenant resolution** middleware (e.g., sunshine.loyalty.vn)
- Subdomain field on Tenant model (+ unique index)

## 11. Frontend Apps

### Admin Web (Next.js 14, port 3000)
34 page directories covering all admin features. Sidebar navigation. RealtimeNotifications component. Socket.io client. API client with 100+ typed functions.

### Member Portal (Next.js 14, port 3002)
Mobile-optimized (480px max-width), bottom tab navigation (Home/Wallet/Vouchers/Orders/Profile). Pages: login, dashboard, wallet, vouchers, orders, profile, referrals, badges, missions.

### Member Portal (Mobile-optimized PWA)
Mobile-first responsive design (480px max-width), bottom tab navigation (5 tabs), pull-to-refresh, QR code display, tier progress bar, forgot/reset password flow.

### Mobile App (React Native)
26 screens, Zustand state management, React Navigation stack. Auth flow, home, wallet, rewards, vouchers, referrals, badges, missions, check-in, profile, membership card, KYC, stores, feedback.
