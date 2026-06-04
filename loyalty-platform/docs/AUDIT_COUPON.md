# Audit: Coupon Engine

## Phase 1 - Product Analysis
**Business Goal**: Hỗ trợ marketing với mã giảm giá linh hoạt (% hoặc tiền mặt), tự động tính discount khi tạo đơn hàng.
**Users**: Admin, Staff, Member
**Benefits**: Tăng conversion, khuyến khích mua hàng

## Phase 2 - BA Analysis

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | CRUD Coupon với type PERCENTAGE/FIXED | ✅ Done |
| FR-002 | Validate coupon (hạn dùng, minAmount, maxUsage) | ✅ Done |
| FR-003 | Apply coupon (tính discount, không ghi nhận) | ✅ Done |
| FR-004 | Tự động áp dụng + ghi nhận usage khi tạo order | ✅ Done |
| FR-005 | Coupon usage tracking (member + order) | ✅ Done |
| FR-006 | Filter coupons by status, type | ✅ Done |
| FR-007 | Export coupon usage report | ✅ Done (per-coupon usage report + performance stats) |
| FR-008 | Bulk coupon creation | ❌ Missing |
| FR-009 | Coupon auto-expire notification | ❌ Missing |
| FR-010 | Coupon performance stats (usage rate, revenue) | ✅ Done (GET stats/performance) |

## Phase 3 - Use Cases
**Main Flow**: Admin tạo coupon → Member nhập code → Coupon validated → Discount applied → Order created → Usage recorded
**Exception Flow**: Coupon hết hạn / hết lượt / không đủ minAmount → báo lỗi cụ thể
**Missing**: Coupon stacking (nhiều coupon trên 1 đơn) ❌

## Phase 4 - CRUD Gap Analysis
| Operation | Status | Gaps |
|-----------|--------|------|
| Create | ✅ | Thiếu bulk create |
| Read | ✅ | Search, filter, sort |
| Update | ✅ | |
| Delete | ✅ | |
| Validate | ✅ | |
| Apply (preview) | ✅ | |
| Usage report | ✅ | Per-coupon usage detail |
| Performance stats | ✅ | Top coupons, total usage, discount |
| Bulk generate | ❌ | |

## Phase 5 - UI/UX (Admin Web)
| Feature | Status |
|---------|--------|
| List with filter | ✅ |
| Create/Edit modal | ✅ |
| Usage stats per coupon | ✅ |
| Performance overview | ✅ |
| Export | ❌ (API exists, UI missing) |

## Completeness Scores
| Category | Score | Reason |
|----------|-------|--------|
| Product | 85% | Thiếu coupon stacking, bulk creation |
| BA | 82% | Thiếu FR-008, FR-009 |
| UX | 82% | Thiếu export button UI |
| Web | 82% | |
| Mobile | 35% | Chỉ có voucher list |
| Security | 92% | RBAC, tenant isolation tốt |
| Architecture | 88% | CouponUsage atomic với Order |

*Last updated: 2026-06-04 — Sprint 1: Added performance stats, usage report per coupon*
