# Master Prompt — Complete Deliverables

## 1. Product Requirements Document (PRD)
→ See `PRD_PRODUCT_ORDER.md`, `PRD_RFM.md`, `PRD_COUPON.md`, `PRD_MEMBER_PORTAL.md`, `PRD_MULTI_TENANCY.md`, `PRD_WEBSOCKET.md`

## 2. Business Requirements

### BR-001: Mobile Real-time Engagement
**Problem**: Member không nhận được thông báo real-time khi có điểm mới, đơn hàng thay đổi trạng thái.
**Solution**: Tích hợp WebSocket vào mobile app, push notification khi app background.
**ROI**: Tăng engagement 30%, giảm thời gian member check điểm.

### BR-002: Self-service Order Management
**Problem**: Member muốn tạo đơn hàng và hủy đơn từ mobile.
**Solution**: Thêm Create Order và Cancel Order screens.
**ROI**: Giảm tải staff 40%, tăng member satisfaction.

### BR-003: Tenant Branding Self-service
**Problem**: Tenant admin muốn custom logo, màu sắc riêng.
**Solution**: Settings page cho tenant admin để config theme.
**ROI**: Tăng tenant retention, brand consistency.

### BR-004: HOST Multi-tenant Management
**Problem**: HOST cần switch tenant nhanh để hỗ trợ.
**Solution**: Tenant switcher dropdown trong admin sidebar.
**ROI**: Giảm thời gian support, tăng operational efficiency.

## 3. User Stories

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| US-001 | As a member, I want to receive push notifications when my points change | P1 | Sprint 3 |
| US-002 | As a member, I want to create orders from my phone | P1 | Sprint 3 |
| US-003 | As a member, I want to cancel my pending orders | P1 | Sprint 3 |
| US-004 | As a member, I want to scan QR codes to redeem vouchers | P1 | Sprint 3 |
| US-005 | As a member, I want real-time updates via WebSocket | P1 | Sprint 3 |
| US-006 | As a member, I want offline access to my data | P2 | Sprint 4 |
| US-007 | As a tenant admin, I want to customize my brand logo and colors | P1 | Sprint 3 |
| US-008 | As a HOST, I want to switch between tenants from the sidebar | P1 | Sprint 3 |
| US-009 | As a developer, I want Redis cache keys scoped per tenant | P1 | Sprint 3 |
| US-010 | As a tenant admin, I want to see usage statistics | P2 | Sprint 4 |

## 4. Use Cases

### UC-MOBILE-001: WebSocket Connection
**Main Flow**:
1. App connects to WS on auth
2. JWT sent as auth token
3. Join member:{id} room
4. Listen for events (points.earned, order.status_changed, notification)
5. Show in-app toast/banner

**Alternative Flow**: Token expired → refresh token → reconnect
**Exception Flow**: No connection → offline mode with reconnect queue

### UC-MOBILE-002: QR Code Scanner
**Main Flow**:
1. Staff opens scanner from voucher detail
2. Camera permission requested
3. Scan QR code from member's phone
4. Parse voucher ID
5. Call redeem API
6. Show success/error

**Validation Rules**:
- Camera permission required
- QR format: voucher UUID
- Voucher must be unredeemed + valid

### UC-MOBILE-003: Create Order (Staff)
**Main Flow**:
1. Staff selects member
2. Searches products
3. Adds items + quantities
4. Optionally applies coupon + points
5. Confirms order
6. Order created → points earned → WS event emitted

### UC-TENANT-001: Configure Branding
**Main Flow**:
1. Admin opens Settings > Branding
2. Uploads logo (image, max 2MB)
3. Picks primary color (color picker)
4. Enters brand name
5. Saves → persisted to Settings API
6. Theme applied immediately to admin UI

### UC-TENANT-002: Switch Tenant (HOST)
**Main Flow**:
1. HOST clicks tenant switcher in sidebar
2. Dropdown shows all tenants
3. Selects target tenant
4. UI reloads with tenant context
5. All subsequent API calls use new tenantId

## 5. UI/UX Specification

### Mobile: WebSocket Status Indicator
- Small colored dot at top of HomeScreen
- Green = connected, Yellow = reconnecting, Red = disconnected
- Tap for details (connection info, last event time)

### Mobile: Create Order Screen
```
┌──────────────────────────┐
│ ← Create Order           │
├──────────────────────────┤
│ Member: [Search...]      │
│ ┌──────────────────────┐ │
│ │ 👤 Nguyen Van A      │ │
│ │ 📧 a@example.com     │ │
│ │ 🪙 12,500 points     │ │
│ └──────────────────────┘ │
│                          │
│ Products: [Search...]    │
│ ┌──────────────────────┐ │
│ │ ☕ Coffee      x2    │ │
│ │   35,000đ     70,000 │ │
│ ├──────────────────────┤ │
│ │ 🥪 Sandwich    x1    │ │
│ │   45,000đ     45,000 │ │
│ └──────────────────────┘ │
│ [+ Add Product]          │
│                          │
│ Coupon: [Enter code]     │
│ Points: [0] / 12,500     │
│                          │
│ Total: 115,000đ          │
│ ┌──────────────────────┐ │
│ │   Confirm Order      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

### Mobile: QR Code Scanner Screen
```
┌──────────────────────────┐
│ ← Scan Voucher QR        │
├──────────────────────────┤
│                          │
│     ┌──────────────┐     │
│     │              │     │
│     │  📷CAMERA    │     │
│     │  VIEWFINDER  │     │
│     │              │     │
│     └──────────────┘     │
│                          │
│ Align QR code within     │
│ the frame to scan        │
│                          │
│ Or enter code manually:  │
│ [__________________]     │
│ [ Redeem ]               │
└──────────────────────────┘
```

### Admin: Tenant Branding Settings
```
┌────────────────────────────────┐
│ Settings › Branding            │
├────────────────────────────────┤
│ Brand Name                     │
│ [Sunshine Real Estate______]   │
│                                │
│ Logo                           │
│ ┌──────────────────────────┐   │
│ │     [Upload Image]       │   │
│ │     Max 2MB (PNG/JPG)    │   │
│ └──────────────────────────┘   │
│                                │
│ Primary Color                  │
│ [#2563eb________________] [🎨] │
│ · Preview:                     │
│ ┌──────────────────────┐       │
│ │ Button  │ Card       │       │
│ └──────────────────────┘       │
│                                │
│ [Save Changes]                 │
└────────────────────────────────┘
```

### Admin: Tenant Switcher
```
┌──────────────────────────────┐
│ 🔍 [Search tenants...]       │
├──────────────────────────────┤
│ ● Sunshine Real Estate     → │
│ ○ Golden Lotus Mall        → │
│ ○ Pacific Group            → │
│ ○ ...                      → │
└──────────────────────────────┘
```

## 6. API Specification

### Mobile Order Endpoints

```
POST /api/v1/orders { memberId, tenantId, items[], storeId?, couponCode?, pointsUsed? }
→ 201 { id, orderCode, total, pointsEarned, status }

PUT /api/v1/orders/:id/cancel { cancelReason? }
→ 200 { id, status: CANCELLED, pointReversal }

POST /api/v1/member-vouchers/redeem-qr { qrCode }
→ 200 { success, voucher }

GET /api/v1/products?search=&categoryId=&page=&limit=
→ 200 { data[], pagination }

GET /api/v1/me/orders?status=&page=&limit=
→ 200 { data[], pagination }
```

### Tenant Branding Endpoints
```
GET /api/v1/settings/tenant/:tenantId
→ 200 { theme: { primaryColor, logoUrl, brandName }, ... }

PUT /api/v1/settings/tenant/:tenantId { theme: { primaryColor, logoUrl, brandName } }
→ 200 { success }

GET /api/v1/tenants?page=&limit=&search=
→ 200 { data[], pagination }  // For HOST tenant switcher
```

### WebSocket Events (Mobile)
```
Client → Server:
  subscribe: { room: string }
  unsubscribe: { room: string }
  replay: { since?: string, limit?: number }
  ping: {}

Server → Client:
  points.earned: { amount, balance, reason }
  order.status_changed: { orderId, orderCode, status }
  notification: { title, message, type, data? }
  pong: { time }
  replay.events: Array<{ event, data, createdAt }>
```

## 7. Database Design

### New Models (None required)
All data models already exist. Only need:
- `Tenant.logo` ✅ exists
- `Settings` model with `scope=tenant` ✅ exists
- `Order`, `Product`, `Coupon`, `MemberVoucher` ✅ all exist

### Cache Key Design
```
tenant:{tenantId}:products:list:{page}:{limit}:{search}
tenant:{tenantId}:segment:summary
tenant:{tenantId}:coupon:performance
```

## 8. Architecture Design

### Mobile WebSocket Integration
```
┌──────────────┐    socket.io-client    ┌──────────────────┐
│  Mobile App  │ ◄────────────────────► │  API Gateway     │
│  (RN/Expo)   │    ws://host/ws        │  /ws namespace   │
└──────┬───────┘                        └────────┬─────────┘
       │                                          │ Redis Adapter
  ┌────▼──────┐                            ┌──────▼───────┐
  │ Zustand   │                            │  Redis Pub/  │
  │ useWSStore│                            │  Sub         │
  └───────────┘                            └──────────────┘
```

### Tenant Branding Flow
```
Admin UI → Settings API → Prisma Settings (scope=tenant)
                              │
                         Admin UI reads
                         theme + applies
                         CSS variables
```

### Cache Isolation
```
CacheService.get('products:list:1:20')
→ internally: get('tenant:{tenantId}:products:list:1:20')
```

## 9. Security Design

| Aspect | Implementation |
|--------|---------------|
| Mobile WS Auth | JWT sent as `auth.token` on connect |
| QR Code | Signed voucher ID, validate on server |
| Tenant Settings | HOST/ADMIN only (RolesGuard) |
| Tenant Switcher | HOST role only |
| Cache Isolation | No PII in cache keys |
| Input Validation | class-validator on all endpoints |

## 10. Test Cases

### Mobile WebSocket
- TC-WS-001: Connect with valid JWT → room joined, events received
- TC-WS-002: Connect with expired JWT → disconnected
- TC-WS-003: Reconnect after disconnect → events replayed
- TC-WS-004: Points earned event → balance updated in UI
- TC-WS-005: Multiple rapid reconnects → only 1 connection active

### Mobile QR Scanner
- TC-QR-001: Scan valid QR → voucher redeemed
- TC-QR-002: Scan already redeemed QR → error message
- TC-QR-003: Scan invalid QR → error message
- TC-QR-004: Camera permission denied → fallback to manual entry

### Tenant Branding
- TC-BR-001: Upload logo (PNG, 500KB) → saved, returned in GET
- TC-BR-002: Upload logo (>2MB) → rejected
- TC-BR-003: Update primary color → reflected in UI immediately
- TC-BR-004: Cross-tenant branding isolation

## 11. Sprint Backlog

### Sprint 3 — Mobile + Multi-tenant UI (Target: all ≥95%)

| # | Task | Effort | Dependencies |
|---|------|--------|-------------|
| 1 | Mobile WebSocket client (useWSStore + socket.io-client) | 4h | None |
| 2 | Mobile push notification setup (expo-notifications) | 3h | None |
| 3 | Mobile QR code scanner screen | 4h | expo-camera |
| 4 | Mobile Create Order screen | 5h | Product + Member APIs |
| 5 | Mobile Cancel Order flow | 2h | Order cancel API |
| 6 | Admin: Tenant branding settings page | 4h | Settings API |
| 7 | Admin: Tenant switcher component (HOST) | 3h | Tenants API |
| 8 | Cache isolation (tenant prefix) | 2h | CacheService |
| 9 | Unit tests for new features | 4h | All above |
| 10 | E2E tests for mobile flows | 4h | All above |

## 12. Development Tasks

### Task 1: Mobile WebSocket
**Files**: `apps/mobile-app/src/services/wsStore.ts`, `apps/mobile-app/App.tsx`
**Acceptance**: On login, WS connects. When points earned, banner shows.

### Task 2: Mobile QR Scanner
**Files**: `apps/mobile-app/src/screens/QRScannerScreen.tsx`
**Acceptance**: Camera opens → scan QR → voucher redeemed → success screen.

### Task 3: Mobile Create Order
**Files**: `apps/mobile-app/src/screens/CreateOrderScreen.tsx`
**Acceptance**: Select member → add products → apply coupon → confirm → order created.

### Task 4: Admin Tenant Branding
**Files**: `apps/admin-web/src/app/settings/branding/page.tsx`
**Acceptance**: Upload logo, pick color, save → UI updates.

### Task 5: Admin Tenant Switcher
**Files**: `apps/admin-web/src/components/TenantSwitcher.tsx`, `apps/admin-web/src/components/Sidebar.tsx`
**Acceptance**: HOST sees dropdown, switches tenant, UI reloads.

## 13. Code Generation Guide

### Mobile WebSocket Store
```typescript
// src/services/wsStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface WSState {
  socket: Socket | null;
  connected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}
```

### Mobile QR Scanner Screen
```typescript
// src/screens/QRScannerScreen.tsx
// Uses expo-camera (BarCodeScanner)
// On scan → calls memberVoucher.redeem(qrCode)
// Shows success/error
```

### Admin Tenant Branding Page
```tsx
// app/settings/branding/page.tsx
// Form: brandName, logo upload, primaryColor picker
// Calls PUT /settings/tenant/:id { theme: { ... } }
// Preview shows changes immediately
```

### Admin Tenant Switcher
```tsx
// components/TenantSwitcher.tsx
// Dropdown: list all tenants (HOST only)
// On select: set new tenantId in context/state
// Reload current page data
```

### Cache Isolation
```typescript
// common/services/cache.service.ts
// Update get/set/del to prefix keys with tenant:{tenantId}
```
