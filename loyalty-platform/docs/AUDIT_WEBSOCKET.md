# Audit: WebSocket Real-Time

## Phase 1 - Product Analysis
**Business Goal**: Cập nhật real-time cho admin và member khi có sự kiện (đơn hàng mới, đổi trạng thái, kiếm điểm).
**Users**: Admin (theo dõi real-time), Member (nhận thông báo)
**Benefits**: Trải nghiệm real-time, không cần refresh

## Phase 2 - BA Analysis

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | WebSocket server với JWT auth | ✅ Done |
| FR-002 | Room routing (admin, member, tenant) | ✅ Done |
| FR-003 | Emit order.created event | ✅ Done |
| FR-004 | Emit order.status_changed event | ✅ Done |
| FR-005 | Emit points.earned event | ✅ Done |
| FR-006 | Emit coupon.applied event | ✅ Done |
| FR-007 | Emit notification event | ✅ Done |
| FR-008 | Client reconnect với backoff | ✅ Done |
| FR-009 | Ping/pong keepalive | ✅ Done |
| FR-010 | Admin UI toast notifications | ✅ Done |
| FR-011 | Connection status indicator | ✅ Done (UI indicator + reconnection state) |
| FR-012 | Event history/replay cho client offline | ✅ Done (replay endpoint + event log) |
| FR-013 | Rate limiting cho WebSocket messages | ❌ Missing |
| FR-014 | Typed event payloads (TypeScript) | ❌ Missing (any) |

## Phase 3 - Use Cases
**Main Flow**: Client connect → JWT auth → join room → receive events → show toast
**Exception Flow**: Token hết hạn → disconnect → reconnect với token mới ✅
**Exception Flow**: Mất mạng → reconnect queue ✅ (có reconnect + connection indicator)

## Phase 4 - Implementation Review
| Component | Status | Notes |
|-----------|--------|-------|
| Connection management | ✅ | JWT auth, room routing |
| Event types | ✅ | order.created, status_changed, points.earned, coupon.applied, notification |
| Error handling | ✅ | Reconnect with backoff, connection indicator |
| Event history | ✅ | WebSocketEventLog model, replay endpoint |
| Scalability | ✅ | Redis adapter (socket.io redis-adapter + ioredis) |
| Connection status UI | ✅ | Disconnected/reconnecting indicator in admin-web |

## Phase 5 - UI/UX (Admin Web)
| Feature | Status |
|---------|--------|
| Toast notifications | ✅ |
| Connection status | ✅ (bottom-right indicator) |
| Event log panel | ❌ |

## Completeness Scores
| Category | Score | Reason |
|----------|-------|--------|
| Product | 90% | Thiếu rate limiting, typed payloads |
| BA | 88% | Thiếu FR-013, FR-014 |
| UX | 85% | Connection indicator added, thiếu event log panel |
| Web | 88% | |
| Mobile | 55% | Chưa có WS trên mobile |
| Security | 88% | JWT auth, room isolation |
| Architecture | 88% | Redis adapter cho multi-instance |

*Last updated: 2026-06-04 — Sprint 1: Added Redis adapter for scalability, connection status indicator*
