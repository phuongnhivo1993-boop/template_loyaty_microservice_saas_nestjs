# WebSocket Real-Time System

## Configuration
- **Library**: socket.io (`@nestjs/platform-socket.io`)
- **Namespace**: `/ws`
- **Port**: 3001 (same as API Gateway)
- **CORS**: All origins, credentials enabled

## Authentication
- Token passed via `auth.token` in handshake or `token` query param
- Server verifies JWT using JwtService
- On success:
  - MEMBER role: joins `member:{memberId}` room
  - ADMIN/STAFF/HOST: joins `admin` + `tenant:{tenantId}` rooms
- On failure: client disconnected with error

## Server -> Client Events

| Event | Payload | Target Room(s) |
|-------|---------|----------------|
| `order.created` | `{ id, orderCode, total, status, memberId, pointsEarned, couponCode, createdAt }` | `admin`, `member:{memberId}` |
| `order.status_changed` | `{ orderId, orderCode, status, previousStatus? }` | `admin`, `member:{memberId}` |
| `points.earned` | `{ memberId, amount, balance, reason }` | `member:{memberId}`, `admin` |
| `coupon.applied` | `{ couponCode, memberId, discount, orderCode }` | `admin` |
| `notification` | `{ title, message, type? }` | `member:{userId}`, `admin` |

## Client -> Server Events
- `ping` → server responds with `pong { time }`

## Integration Points
- **OrderService**: emits `order.created` on order creation, `order.status_changed` on status update
- **Frontend**: `useWebSocket` hook (admin-web) subscribes to all events and shows toast notifications via `RealtimeNotifications` component

## Client Connection (Admin Web)
```typescript
// useWebSocket.ts
const socket = io(`${WS_URL}/ws`, {
  auth: { token: localStorage.getItem('token') },
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
```
