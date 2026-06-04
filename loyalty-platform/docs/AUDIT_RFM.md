# Audit: Member Segmentation (RFM)

## Phase 1 - Product Analysis
**Business Goal**: Phân loại member dựa trên hành vi mua hàng (RFM) để nhóm marketing có thể targeting chính xác.
**Users**: Marketing team, Admin
**Benefits**: Segment-based campaigns, giữ chân member risk, reward member tốt

## Phase 2 - BA Analysis

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | Tính RFM score cho từng member | ✅ Done |
| FR-002 | Phân loại member vào 6 segments | ✅ Done |
| FR-003 | List members kèm RFM score | ✅ Done |
| FR-004 | Segment summary (count, total spend, points) | ✅ Done |
| FR-005 | Xem RFM chi tiết của 1 member | ✅ Done |
| FR-006 | Filter member list theo segment | ✅ Done |
| FR-007 | Export segment data | ✅ Done (CSV export endpoint) |
| FR-008 | RFM score period comparison | ❌ Missing |
| FR-009 | Threshold configuration UI | ❌ Missing (hardcoded) |
| FR-010 | Campaign suggestion based on segment | ❌ Missing |

## Phase 3 - Use Cases
**Main Flow**: Admin mở trang RFM → xem segment summary → click segment → xem danh sách member trong segment ✅

## Phase 4 - CRUD Gap Analysis
- RFM scores are computed (read-only), not CRUD
- Filter by segment ✅
- Export CSV ✅
- Configurable thresholds ❌

## Phase 5 - UI/UX (Admin Web)
| Feature | Status |
|---------|--------|
| Segment cards with colors | ✅ |
| Paginated member RFM table | ✅ |
| Filter by segment | ✅ |
| Export | ✅ (CSV download) |
| Detail page per member | ✅ |

## Completeness Scores
| Category | Score | Reason |
|----------|-------|--------|
| Product | 85% | Thiếu period comparison, configurable thresholds |
| BA | 82% | Thiếu FR-008 đến FR-010 |
| UX | 80% | Thiếu campaign suggestions |
| Web | 82% | |
| Mobile | 0% | Chưa có trên mobile |
| Security | 92% | Chỉ HOST/ADMIN access |
| Architecture | 82% | Thresholds hardcoded, nên configurable |

*Last updated: 2026-06-04 — Sprint 1: Added segment filter, CSV export*
