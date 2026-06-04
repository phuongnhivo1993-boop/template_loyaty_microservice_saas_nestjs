# Audit: Product & Order System

## Phase 1 - Product Analysis

### Business Goal
Cho phép tenant quản lý danh mục sản phẩm và xử lý đơn hàng, tự động tính điểm loyalty khi mua hàng.

### Users
- **Admin**: Quản lý sản phẩm, danh mục, theo dõi đơn hàng
- **Staff**: Tạo đơn hàng cho member tại quầy
- **Member**: Xem lịch sử đơn hàng (qua member portal)

### Benefits
- Tự động hóa kiếm điểm loyalty
- Quản lý tồn kho tập trung
- Theo dõi đơn hàng real-time

## Phase 2 - BA Analysis

### Functional Requirements
| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | CRUD Product Category | ✅ Done |
| FR-002 | CRUD Product | ✅ Done |
| FR-003 | Product search/filter/sort/pagination | ✅ Done |
| FR-004 | Order CRUD with status workflow | ✅ Done |
| FR-005 | Auto point earning on order creation | ✅ Done |
| FR-006 | Coupon integration in order | ✅ Done |
| FR-007 | Points redemption in order | ✅ Done |
| FR-008 | WebSocket events on order changes | ✅ Done |
| FR-009 | Import products from CSV/Excel | ✅ Done |
| FR-010 | Export products/orders to CSV | ✅ Done (generic export) |
| FR-011 | Bulk product operations (status, delete) | ❌ Missing |
| FR-012 | Order status change history/timeline | ✅ Done (statusHistory JSON + API) |
| FR-013 | Order cancellation with point reversal | ✅ Done |
| FR-014 | Product stock alerts | ❌ Missing |
| FR-015 | Order notes/attachments | ❌ Missing |

### Non-Functional Requirements
| ID | Requirement | Status |
|----|-------------|--------|
| NFR-001 | Multi-tenant data isolation (tenantId) | ✅ Done |
| NFR-002 | Role-based access (HOST/ADMIN/STAFF/MEMBER) | ✅ Done |
| NFR-003 | Pagination for all list endpoints | ✅ Done |
| NFR-004 | Audit logging for mutations | ✅ Partial (global interceptor) |
| NFR-005 | Real-time notifications via WebSocket | ✅ Done |
| NFR-006 | Product slug/sku unique per tenant | ✅ Done |

## Phase 3 - Use Cases

### UC-001: Tạo đơn hàng
**Main Flow**:
1. Staff chọn member
2. Thêm sản phẩm vào đơn
3. Nhập số lượng
4. Áp dụng coupon (optional)
5. Nhập điểm sử dụng (optional)
6. Xác nhận → Order created
7. Points tự động earned
8. Coupon usage recorded
9. WebSocket event emitted

**Alternative Flow**: Member tự tạo đơn qua portal (chưa implement)
**Exception Flow**: Hết hàng → báo lỗi. Coupon hết hạn → báo lỗi.

### UC-002: Cập nhật trạng thái đơn hàng
**Main Flow**: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
**Alternative**: CANCELLED (từ bất kỳ trạng thái nào)
**Exception**: REFUNDED (chỉ từ DELIVERED)
**Point Reversal**: Khi cancel → points earned tự động bị trừ ✅

## Phase 4 - CRUD Gap Analysis

### Product
| Operation | Status | Gaps |
|-----------|--------|------|
| Create | ✅ | Thiếu bulk create |
| Read | ✅ | Có search/filter/sort/pagination |
| Update | ✅ | Thiếu bulk update status |
| Delete | ✅ Hard delete | Cần soft delete? |
| Import | ✅ | CSV + Excel |
| Export | ✅ | Generic export |
| Bulk | ❌ | Bulk status, bulk delete |
| Audit | ✅ | Global interceptor |
| History | ❌ | Không có product change history |

### Order
| Operation | Status | Gaps |
|-----------|--------|------|
| Create | ✅ | |
| Read | ✅ | Thiếu filter theo date range, store |
| Update status | ✅ | |
| Cancel | ✅ | Point reversal on cancel |
| Delete | ❌ | Không cho phép xóa đơn |
| Export | ✅ | |
| History | ✅ | Status change timeline (statusHistory JSON + API) |
| Notes | ❌ | Thiếu order notes field |
| Refund | ✅ | REFUNDED status exists |

## Phase 5 - UI/UX Analysis

### Product List (Admin Web)
| Feature | Status |
|---------|--------|
| Search | ✅ |
| Filter (category, status) | ✅ |
| Sort | ✅ |
| Pagination | ✅ |
| Export | ✅ |
| Refresh | ❌ |
| Bulk action | ❌ |

### Order List (Admin Web)
| Feature | Status |
|---------|--------|
| Search | ✅ |
| Filter (status, date) | ❌ Date range |
| Sort | ✅ |
| Pagination | ✅ |
| Export | ✅ |
| Refresh | ❌ |
| Bulk action | ❌ |

### Order Detail
| Feature | Status |
|---------|--------|
| Overview | ✅ |
| Related Data | ❌ Member info, store info |
| Activity Log | ✅ Status change timeline |
| Timeline | ✅ |

## Completeness Scores
| Category | Score | Reason |
|----------|-------|--------|
| Product Completeness | 88% | Thiếu bulk operations, stock alerts |
| BA Completeness | 85% | Thiếu FR-011, FR-014, FR-015 |
| UX Completeness | 80% | Thiếu refresh, bulk action UI |
| Web Completeness | 82% | Thiếu nhiều UI features |
| Mobile Completeness | 35% | Chỉ có order list trong member portal |
| Security Completeness | 88% | Có tenant isolation, RBAC |
| Architecture Completeness | 88% | Status timeline, point reversal good |

*Last updated: 2026-06-04 — Sprint 1: Added point reversal, status timeline, import*
