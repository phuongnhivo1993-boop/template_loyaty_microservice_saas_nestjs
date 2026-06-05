# Gap Analysis — Loyalty Platform (Real Audit)

> **Audit Date**: 2026-06-05
> **Role**: Product Owner + UX Lead + QA Lead + Solution Architect
> **Methodology**: Full source code review across all 15 apps, 34 DB models, 150+ API endpoints, 60+ admin pages, 32 mobile screens

---

## EXECUTIVE SUMMARY

**State**: The platform is substantially built with real business logic across all layers. This is **NOT** a scaffold — it is a production-grade implementation with 85-90% of promised features delivered. However, there are critical gaps in security, performance, and specific feature areas that must be resolved before Production Ready sign-off.

### Overall Readiness: **78%** (details in §16)

| Layer | Completeness | Status |
|-------|-------------|--------|
| Backend API (API Gateway) | 90% | ✅ Feature-rich with 38 domain modules |
| Backend Microservices | 85% | ✅ Real logic, thin but functional |
| Database Schema (Prisma) | 100% | ✅ 34 models + extras, exceeds spec |
| Auth & Authorization | 90% | ✅ JWT, roles, tenant isolation, guards |
| Admin Web (NextJS) | 85% | ✅ 38 routes, full CRUD UI |
| Member Portal (NextJS) | 80% | ✅ 18 routes, mobile-optimized |
| Mobile App (Expo) | 85% | ✅ 32 screens, Zustand + React Query |
| Infrastructure (Docker) | 95% | ✅ Full stack, K8s + Helm |
| Tests | 25% | ⚠️ Only service tests, no E2E, no UI tests |
| Security Hardening | 40% | ⚠️ .env committed, demo creds, N+1 |

---

## 1. UI (Giao diện)

| Check | Status | Detail |
|-------|--------|--------|
| Giao diện hoàn thiện 100%? | ⚠️ 85% | Admin-web: OK. Member-web: basic CSS, no component system. Mobile: OK with StyleSheet. |
| Màn hình placeholder? | ❌ Không | No placeholders found in any app |
| Màn hình chưa có dữ liệu mẫu? | ❌ Không | Seed data exists (`prisma/seed.ts`, `seed-data.ts`) |
| Layout vỡ trên màn hình nhỏ? | ⚠️ Nhẹ | Admin-web sidebar may overflow on <1024px. Member-web is mobile-first (480px max-width). Mobile: OK. |
| Responsive Desktop/Tablet/Mobile? | ⚠️ Thiếu | Admin-web: desktop-first, tablet chưa tối ưu. Member-web: mobile-first (tốt). Mobile: native OK. |
| Dark mode hoạt động? | ⚠️ Một phần | Admin-web: ✅ (`data-theme` attribute). Member-web: ⚠️ CSS vars có dark mode nhưng chưa toggle hoàn chỉnh. Mobile: ❌ chưa có. |
| Font, spacing, màu sắc đồng nhất? | ⚠️ Trung bình | Admin-web: dùng Tailwind, nhất quán. Member-web: tự viết CSS, thiếu component chuẩn. Mobile: OK. |
| Màn hình giống admin mặc định? | ❌ Không | All pages have custom UI |

---

## 2. UX (Trải nghiệm người dùng)

| Check | Status | Detail |
|-------|--------|--------|
| Người dùng mới hiểu ngay? | ⚠️ Cần cải thiện | Không có tour guide, không có tooltip hướng dẫn |
| Thao tác dư thừa? | ⚠️ Nhẹ | Member-web cần vào dashboard trước khi vào wallet |
| Giảm số click? | ⚠️ Có thể | Thêm quick actions trên dashboard |
| Form quá dài? | ❌ Không | Forms được chia nhỏ theo modal |
| Tooltip/hướng dẫn? | ❌ Không có | Không có tooltip, helper text, hay empty-state guide |
| Loading state? | ✅ Có | `LoadingSkeleton.tsx`, `TableSkeleton`, `DetailSkeleton` |
| Empty state? | ✅ Có | `EmptyState` component trong mobile-app |
| Success state? | ⚠️ Có nhưng thiếu | Toast có success nhưng không có success page |
| Error state? | ✅ Có | `ErrorState` component, global exception filter |
| Confirm trước khi xóa? | ✅ Có | `ConfirmModal.tsx` + `BulkActionsToolbar` |

---

## 3. CRUD Completeness

| Module | Create | List | Detail | Update | Delete | Restore | Bulk Delete | Duplicate |
|--------|--------|------|--------|--------|--------|---------|-------------|-----------|
| Tenant | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| User | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Member | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Tier | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Campaign | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reward | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Voucher | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Promotion | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Referral | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Badge | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mission | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Notification Template | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ (soft) | ❌ | ✅ | ❌ |
| Product Category | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Order | ✅ | ✅ | ✅ | ✅ (status) | ❌ (cancel) | ❌ | ❌ | ❌ |
| Coupon | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Store | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cashback Config | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gift Card | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Partner Brand | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Earning Rule | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Webhook Endpoint | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

> **Gaps**: No module has **Restore** (soft delete not implemented anywhere except Product). **Duplicate** is missing everywhere. **Bulk Delete** only on Member, Product, Coupon.

---

## 4. Tìm kiếm dữ liệu

| Check | Status | Detail |
|-------|--------|--------|
| Search? | ✅ Có | Hầu hết list endpoints có search query param |
| Filter? | ✅ Có | Filter by status, date range, category, etc. |
| Sort? | ✅ Có | `sortBy` + `sortOrder` query params |
| Pagination? | ✅ Có | `page` + `limit` + `total` + `totalPages` |
| Lưu điều kiện tìm kiếm? | ❌ Không | Search/filter params không được persist khi reload |

---

## 5. Chức năng bị thiếu

| Check | Status | Detail |
|-------|--------|--------|
| Màn hình không truy cập được? | ❌ Không | All routes accessible |
| Nút chưa hoạt động? | ⚠️ Một số | WebSocket admin event log panel UI chưa có |
| Menu chưa hoàn thiện? | ❌ Không | Sidebar đầy đủ |
| API chưa tích hợp? | ❌ Không | All implemented APIs are wired |
| Tính năng mô tả nhưng chưa triển khai? | ⚠️ Có | Xem §Missing Features bên dưới |

### Missing Features (Critical)

| # | Feature | Area | Impact |
|---|---------|------|--------|
| 1 | **Push notifications** (FR-014) | Member Portal / Mobile | Không thông báo real-time cho member |
| 2 | **Keycloak SSO integration** | Auth | Keycloak provisioned but NOT wired in code |
| 3 | **SMTP email delivery** | Infrastructure | Configs missing in .env, email không gửi được |
| 4 | **Coupon stacking** | Coupon Engine | Không dùng nhiều coupon cùng lúc |
| 5 | **Campaign suggestions from RFM** | RFM | Chưa auto-target campaign theo segment |
| 6 | **Order notes/attachments** | Product Order | Thiếu ghi chú đơn hàng |
| 7 | **Product change history** | Product Order | Không audit trail cho sản phẩm |
| 8 | **WebSocket rate limiting** | WebSocket | Không giới hạn message rate |
| 9 | **Per-tenant rate limiting** | Multi-Tenancy | Tenant có thể ảnh hưởng lẫn nhau |
| 10 | **Restore (soft-delete undoing)** | All CRUD | Không có undelete cho bất kỳ module nào |
| 11 | **Duplicate function** | All CRUD | Không có duplicate cho bất kỳ module nào |
| 12 | **Language switch (vi/en)** | Member Portal | Chỉ hỗ trợ tiếng Việt |

---

## 6. Web và Mobile

| Check | Status | Detail |
|-------|--------|--------|
| Mobile đầy đủ như Web? | ⚠️ 75% | Mobile có 32 screens, thiếu so với 38 admin screens |
| Khác biệt có lý do hợp lý? | ✅ Có | Mobile tập trung member-facing features |
| Navigation Mobile dễ dùng? | ✅ Có | Bottom tabs + stack navigation |
| Form Mobile nhập liệu thuận tiện? | ✅ Có | TextInput component, validation |

---

## 7. Dữ liệu (Validation)

| Check | Status | Detail |
|-------|--------|--------|
| Validate toàn bộ field? | ⚠️ 85% | class-validator trên DTOs, nhưng thiếu frontend validation |
| Kiểm tra dữ liệu trùng? | ⚠️ Một phần | Email unique check có, nhưng thiếu slug/code duplicate check |
| Xử lý dữ liệu rỗng? | ✅ Có | Empty state components, null checks |
| Xử lý dữ liệu quá dài? | ⚠️ Thiếu | Không có maxLength validation trên nhiều field |
| Xử lý ký tự đặc biệt? | ⚠️ Thiếu | Không có sanitize, dễ bị XSS nếu render HTML |

---

## 8. Phân quyền

| Check | Status | Detail |
|-------|--------|--------|
| Mỗi role chỉ thấy chức năng được phép? | ✅ Có | RolesGuard + @Roles() decorator |
| Chặn API trái quyền? | ✅ Có | Global JWT guard + RolesGuard |
| Chặn truy cập URL trực tiếp? | ⚠️ Thiếu | Frontend chỉ check localStorage token, không verify role ở mỗi page |
| Kiểm tra tenant isolation? | ✅ Có | TenantGuard global + tenantId filter trên mọi query |

---

## 9. Workflow

| Check | Status | Detail |
|-------|--------|--------|
| Luồng nghiệp vụ hoàn chỉnh? | ✅ Có | Order status workflow, point earn/burn, coupon apply |
| Trạng thái thiếu? | ⚠️ Nhẹ | Member workflow: ACTIVE/LOCKED, Order: PENDING→CONFIRMED→PROCESSING→SHIPPED→DELIVERED |
| Chuyển trạng thái sai? | ✅ Không | Status transitions validated |
| Rollback workflow? | ⚠️ Một phần | Order cancel có point reversal, coupon không refund |

---

## 10. Thông báo

| Check | Status | Detail |
|-------|--------|--------|
| Email hoạt động? | ❌ Chưa | SMTP config không có trong .env |
| Push notification? | ❌ Chưa | Chưa implement |
| In-app notification? | ⚠️ Một phần | WebSocket real-time notification có, nhưng admin UI event log panel chưa có |
| Nội dung thông báo rõ ràng? | ✅ Có | Notification templates có variable replacement |

---

## 11. Dashboard và Báo cáo

| Check | Status | Detail |
|-------|--------|--------|
| Dashboard đủ KPI? | ⚠️ 70% | Admin dashboard có stats cơ bản, thiếu charts nâng cao |
| Dashboard hữu ích? | ✅ Có | Member count, points, campaigns, vouchers stats |
| Báo cáo còn thiếu? | ⚠️ Có | Retention cohort, LTV prediction, churn analysis |
| Export Excel/PDF? | ⚠️ Một phần | CSV export có, Excel export API implemented, PDF chưa có |

---

## 12. Hiệu năng

| Check | Status | Detail |
|-------|--------|--------|
| 10.000 bản ghi ổn định? | ⚠️ Chưa test | RFM segmentation có N+1 query, sẽ crash với >1000 members |
| N+1 query? | 🔴 Có (Critical) | `member-segmentation.service.ts` N+1 trên mỗi member |
| Cache cần thiết? | ⚠️ Thiếu | Chỉ dashboard có cache, list endpoints không cache |
| API phản hồi chậm? | ⚠️ Có nguy cơ | Dashboard làm ~18 queries đồng thời, RFM không phân trang ở DB layer |

---

## 13. Bảo mật

| Check | Status | Detail |
|-------|--------|--------|
| Lộ dữ liệu nhạy cảm? | 🔴 Có (Critical) | **`.env` committed với secrets thật**: DB passwords, JWT secret, MinIO keys, Keycloak secret |
| Kiểm tra XSS? | ⚠️ Thiếu | Không có CSP mạnh, không sanitize output |
| Kiểm tra SQL Injection? | ✅ An toàn | Tất cả queries qua Prisma (parameterized) |
| Kiểm tra CSRF? | ❌ Chưa | Không có CSRF token |
| Log audit? | ✅ Có | AuditLogInterceptor + AuditLogService |

### Security Findings (Critical)

| # | Issue | Severity |
|---|-------|----------|
| 1 | **`.env` file committed with real secrets** (DB passwords, JWT secret, MinIO, Keycloak) | 🔴 CRITICAL |
| 2 | **Hardcoded demo credentials** in admin-web login page (`host@loyalty.vn` / `Host@123456`) | 🔴 CRITICAL |
| 3 | **JWT secret is weak**: `loyalty_jwt_secret_key_change_in_production` | 🔴 CRITICAL |
| 4 | **No CSRF protection** | 🟠 HIGH |
| 5 | **Forgot password leaks reset token** in dev mode UI | 🟠 HIGH |
| 6 | **WebSocket CORS allows all origins** | 🟡 MEDIUM |
| 7 | **No input sanitization** on rich text fields | 🟡 MEDIUM |
| 8 | **Race condition** in coupon apply flow (OrderService.create) | 🟠 HIGH |

---

## 14. Chất lượng mã nguồn

| Check | Status | Detail |
|-------|--------|--------|
| Code trùng lặp? | ⚠️ Trung bình | Auth validation logic lặp lại, account lockout tự viết thay vì dùng thư viện |
| Component tái sử dụng? | ✅ Có (admin-web) | 14 components reusable. Member-web: ❌ 0 components. |
| Hardcode? | ⚠️ Một số | Demo credentials, JWT secret, CORS origin |
| Cấu hình qua environment? | ✅ Có | Hầu hết config qua .env |
| Logging đầy đủ? | ✅ Có | LoggingInterceptor, audit logs |
| Typo directory? | 🟡 `libs/databse/` | Thư mục `libs/databse/` là typo của `libs/database/` — dead code |

---

## 15. Production Readiness

| Check | Status | Detail |
|-------|--------|--------|
| Deploy production ngay? | ❌ Chưa | Security issues (.env committed, demo creds, weak JWT) + performance (N+1) + email chưa hoạt động |
| Tài liệu API? | ✅ Có | Swagger tại `/api/docs`, docs/ directory có 30+ files |
| Tài liệu cài đặt? | ✅ Có | README.md, docker-compose.yml |
| Migration database? | ✅ Có | Prisma migrations đã tạo |
| Backup strategy? | ❌ Chưa có | Không có script backup tự động (có `scripts/backup.sh` nhưng chưa verify) |
| Monitoring? | ✅ Có | Prometheus + Grafana provisioned |

---

## 16. Gap Analysis (Bắt buộc - AI tự trả lời)

### 1. Tôi phát hiện những chức năng còn thiếu nào?

| # | Chức năng thiếu | Lý do cần có |
|---|----------------|--------------|
| 1 | **Push notification (mobile + web)** | Member không được thông báo khi có điểm, voucher, hay order mới |
| 2 | **Keycloak SSO tích hợp** | Keycloak đã được provisioned trong docker-compose nhưng chưa tích hợp vào code — auth hoàn toàn dựa vào JWT tự quản lý |
| 3 | **Coupon stacking** | Không thể áp dụng nhiều coupon cho một đơn hàng |
| 4 | **Campaign suggestion từ RFM** | RFM segmentation có nhưng không auto-suggest campaign cho từng segment |
| 5 | **Restore (soft-delete)** | Không có undelete cho bất kỳ module nào (Product có soft-delete nhưng không restore) |
| 6 | **Duplicate function** | Admin không thể duplicate một campaign/reward/voucher để tạo nhanh |
| 7 | **Order notes & attachments** | Không ghi chú được trên đơn hàng |
| 8 | **Language switch (vi/en)** | Chỉ hỗ trợ tiếng Việt |
| 9 | **CSRF protection** | Thiếu bảo vệ CSRF trên API |
| 10 | **SMTP email delivery** | Không gửi được email (quên mật khẩu, thông báo) vì thiếu SMTP config |

### 2. Tôi phát hiện những màn hình còn thiếu nào?

| # | Màn hình thiếu | App |
|---|---------------|-----|
| 1 | **Admin WebSocket event log panel** | admin-web |
| 2 | **Member push notification preferences** | member-web + mobile |
| 3 | **Mobile: Campaign list/detail** | mobile-app |
| 4 | **Mobile: Event list/detail** | mobile-app |
| 5 | **Member-web: Point earning rules display** | member-web |
| 6 | **Monthly check-in calendar view** | member-web |
| 7 | **Mobile: Re-order from history** | mobile-app |
| 8 | **Mobile: Product barcode scanner** | mobile-app |

### 3. Tôi phát hiện những API còn thiếu nào?

| # | API thiếu | Ghi chú |
|---|-----------|---------|
| 1 | `POST/PUT /settings/notifications` | Push notification preferences |
| 2 | `POST /coupons/stack` | Coupon stacking endpoint |
| 3 | `GET /campaigns/suggestions/{segmentId}` | RFM-based campaign suggestions |
| 4 | `POST /{entity}/:id/restore` | Soft-delete restore cho tất cả entities |
| 5 | `POST /{entity}/:id/duplicate` | Duplicate cho tất cả entities |
| 6 | `GET/POST /audit-logs/{entityType}/{entityId}` | Audit log chi tiết theo entity |

### 4. Tôi phát hiện những vấn đề UX nào?

| # | Vấn đề UX | Severity |
|---|-----------|----------|
| 1 | **Không có tour guide cho người dùng mới** | Medium |
| 2 | **Không có tooltip/helper text** trên form phức tạp | Medium |
| 3 | **Member-web không có reusable component system** (0 components) | High |
| 4 | **Admin-web sidebar không responsive** trên màn hình nhỏ | Medium |
| 5 | **Search/filter không được persist** khi refresh trang | Low |
| 6 | **Forgot password leak reset token** trong UI development | High |
| 7 | **Dashboard thiếu charts trực quan** (chỉ có số liệu text) | Medium |

### 5. Tôi phát hiện những vấn đề UI nào?

| # | Vấn đề UI | Severity |
|---|-----------|----------|
| 1 | **Member-web không có component library**, CSS viết inline trong page | High |
| 2 | **Mobile-app thiếu dark mode** | Medium |
| 3 | **Admin-web mobile (<1024px) sidebar bị tràn** | Low |
| 4 | **Không có loading skeleton cho mọi page** (chỉ có DataTable) | Low |
| 5 | **Font/spacing không đồng nhất giữa admin-web và member-web** | Low |

### 6. Tôi phát hiện những rủi ro bảo mật nào?

| # | Rủi ro | Severity | Hành động |
|---|--------|----------|-----------|
| 1 | **`.env` committed với credentials thật** | 🔴 CRITICAL | Add `.env` to `.gitignore`, rotate all secrets ngay lập tức |
| 2 | **Hardcoded demo credentials trong admin-web** | 🔴 CRITICAL | Remove default useState values, dùng env variable |
| 3 | **JWT secret quá yếu** | 🔴 CRITICAL | Generate strong secret (64+ chars), add to CI/CD pipeline |
| 4 | **Không có CSRF protection** | 🟠 HIGH | Add csurf/CORS double-submit pattern |
| 5 | **WebSocket CORS allow all origins** | 🟠 HIGH | Restrict to known origins |
| 6 | **No rate limiting per tenant** | 🟠 HIGH | Add per-tenant rate limit middleware |
| 7 | **Race condition coupon apply** | 🟠 HIGH | Use distributed lock (Redis) |
| 8 | **No input sanitization** | 🟡 MEDIUM | Use sanitize-html cho rich text |

### 7. Tôi phát hiện những vấn đề hiệu năng nào?

| # | Vấn đề | Severity | Detail |
|---|--------|----------|--------|
| 1 | **N+1 query trong RFM segmentation** | 🔴 CRITICAL | `findAll()` và `getSegmentSummary()` làm 1 query per member — sẽ crash với >1000 members |
| 2 | **In-memory pagination thay vì DB pagination** | 🟠 HIGH | `member-segmentation.service.ts` load ALL members rồi slice |
| 3 | **Dashboard làm 18+ queries đồng thời** | 🟡 MEDIUM | OK với cache 120s, nhưng vẫn nặng |
| 4 | **Cache chỉ dùng cho dashboard, không cho list endpoints** | 🟡 MEDIUM | Products, Members, Orders, Vouchers không được cache |
| 5 | **Coupon performance stats không pagination** | 🟢 LOW | Sẽ chậm với nhiều coupons |

### 8. Tôi đề xuất những cải tiến nào?

| # | Cải tiến | Priority | Effort |
|---|----------|----------|--------|
| 1 | **Fix .env committed & rotate secrets** | 🔴 P0 | 1 giờ |
| 2 | **Fix N+1 queries trong RFM service** (dùng aggregate query thay vì loop) | 🔴 P0 | 4 giờ |
| 3 | **Add CSRF protection** | 🟠 P1 | 2 giờ |
| 4 | **Add Redis cache cho list endpoints** (products, members, orders) | 🟠 P1 | 8 giờ |
| 5 | **Xây dựng component library cho member-web** (hiện tại 0 components) | 🟠 P1 | 16 giờ |
| 6 | **Add per-tenant rate limiting** | 🟠 P1 | 4 giờ |
| 7 | **Add Restore endpoint cho soft-delete entities** | 🟡 P2 | 8 giờ |
| 8 | **Add Duplicate endpoint cho entities chính** (campaign, reward, voucher, coupon) | 🟡 P2 | 8 giờ |
| 9 | **Add push notification via Firebase/OneSignal** | 🟡 P2 | 24 giờ |
| 10 | **Add Keycloak SSO integration** (OpenID Connect) | 🟡 P2 | 40 giờ |
| 11 | **Add campaign suggestions từ RFM segments** | 🟢 P3 | 16 giờ |
| 12 | **Add coupon stacking** (atomic multi-coupon apply) | 🟢 P3 | 8 giờ |
| 13 | **Add language switch (i18n) cho member-web** | 🟢 P3 | 24 giờ |
| 14 | **Add dark mode cho mobile-app** | 🟢 P3 | 8 giờ |
| 15 | **Remove libs/databse typo directory** | 🟢 P3 | 0.5 giờ |

### 9. Nếu là tôi làm Product Owner, tôi sẽ bổ sung tính năng gì?

Ngoài các tính năng đã có, tôi sẽ bổ sung các tính năng **tạo khác biệt cạnh tranh** cho một Loyalty Platform trong hệ sinh thái Bất động sản:

| # | Tính năng | Lý do |
|---|-----------|-------|
| 1 | **Partner Loyalty Module** — Quản lý loyalty cho agent, môi giới, đại lý phân phối riêng (khác với member thông thường) | 70-80% doanh đến từ kênh đối tác |
| 2 | **Multi-level referral (MLM)** — Thưởng giới thiệu đa cấp (A giới thiệu B, B giới thiệu C → A vẫn được thưởng) | Tăng viral growth trong BĐS |
| 3 | **Coalition Loyalty** — Nhiều brand/partner cùng tham gia hệ thống điểm chung | Tăng giá trị điểm, giảm churn |
| 4 | **AI-powered next-best-action** — Gợi ý hành động tiếp theo cho member dựa trên hành vi | Tăng engagement 15-30% |
| 5 | **Dynamic pricing với loyalty points** — Thanh toán hỗn hợp tiền + điểm cho bất kỳ sản phẩm nào | Tăng utility của điểm |
| 6 | **Scheduled loyalty campaign** — Auto campaign theo ngày sinh nhật, kỷ niệm, theo mùa | Personalized marketing |
| 7 | **Member churn prediction** — ML model dự đoán member sắp rời bỏ và trigger campaign giữ chân | Giảm churn rate |
| 8 | **Wallet-sharing / Family Pool** — Gộp điểm giữa các thành viên trong gia đình | Tăng stickiness |
| 9 | **Gamified onboarding** — Quest cho member mới hoàn thành hồ sơ, KYC, check-in đầu tiên | Tăng activation rate |
| 10 | **White-label mobile app** — Cho phép tenant tự customize app với brand riêng | Tăng giá trị SaaS |

### 10. Sản phẩm hiện tại đã đạt mức Production Ready (%) là bao nhiêu?

| Tiêu chí | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Backend API functionality | 20% | 90% | 18.0% |
| Database & Data Model | 10% | 100% | 10.0% |
| Frontend Web (admin + member) | 15% | 82% | 12.3% |
| Mobile App | 10% | 85% | 8.5% |
| Auth & Authorization | 10% | 88% | 8.8% |
| Testing Coverage | 5% | 25% | 1.3% |
| Security Hardening | 10% | 40% | 4.0% |
| Performance Optimization | 5% | 50% | 2.5% |
| Infrastructure & DevOps | 10% | 90% | 9.0% |
| Documentation | 5% | 85% | 4.3% |
| **TOTAL** | **100%** | | **78.7%** |

### **Kết luận: Sản phẩm đạt ~78% Production Ready.**

**Chưa thể Go-Live** vì 3 blockers:
1. 🔴 `.env` committed với secrets — phải xử lý ngay
2. 🔴 N+1 queries trong RFM — crash với dữ liệu lớn
3. 🔴 Không gửi được email (thiếu SMTP) — forgot password & notification không hoạt động

**Sau khi fix 3 blockers + security hardening**: ~90%
**Sau khi thêm push notification + tests**: ~95%
**Sau khi thêm tất cả minor gaps**: ~98%+
