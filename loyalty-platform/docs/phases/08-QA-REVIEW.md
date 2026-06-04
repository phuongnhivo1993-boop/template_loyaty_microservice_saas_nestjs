# Phase 8: QA Review — Test Cases & Feature Completeness

## 8.1 Test Case Strategy

### Test Categories

| Category | Mô tả | Coverage Target |
|---|---|---|
| **Unit Tests** | Service logic, DTO validation, utility functions | 90%+ |
| **Integration Tests** | Controller + Service + Prisma (real DB) | 80%+ |
| **E2E Tests** | Full API flow (auth → member → points → redeem) | Key flows |
| **UI Tests** | Component rendering, user interactions | Critical paths |
| **Security Tests** | Auth bypass, SQL injection, XSS, rate limiting | OWASP Top 10 |
| **Performance Tests** | Load test, stress test, endurance | SLA targets |

## 8.2 Test Cases by Module

### Module A: Auth

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-A001 | Register host với email/password hợp lệ | Integration | 201, tạo host, trả về JWT |
| TC-A002 | Register host với email đã tồn tại | Integration | 409 CONFLICT |
| TC-A003 | Register host với password yếu | Unit | 422 VALIDATION_ERROR |
| TC-A004 | Login với đúng credentials | Integration | 200, trả về access + refresh token |
| TC-A005 | Login với sai password | Integration | 401, đếm failed attempt |
| TC-A006 | Login 5 lần sai → account locked | Integration | 423 LOCKED |
| TC-A007 | Refresh token hợp lệ | Integration | 200, new access token |
| TC-A008 | Refresh token hết hạn | Integration | 401 TOKEN_EXPIRED |
| TC-A009 | Gọi API không có token | Security | 401 UNAUTHORIZED |
| TC-A010 | Gọi API với token hết hạn | Security | 401 TOKEN_EXPIRED |
| TC-A011 | Gọi API với token revoked | Security | 401 TOKEN_REVOKED |
| TC-A012 | Brute force protection (100 requests/min) | Security | 429 RATE_LIMIT |
| TC-A013 | SQL injection trong email field | Security | 422, không crash |

### Module B: Multi-Tenant

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-B001 | Admin tenant A không thể access data tenant B | Security | 403 FORBIDDEN |
| TC-B002 | Host có thể access tất cả tenants | Security | 200 OK |
| TC-B003 | Tạo tenant với subdomain trùng | Integration | 409 CONFLICT |
| TC-B004 | Suspend tenant → tất cả user bị chặn | Integration | 403 TENANT_SUSPENDED |
| TC-B005 | Member register qua subdomain → đúng tenant | Integration | tenantId = tenant của subdomain |

### Module C: Member

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-C001 | Self-register member hợp lệ | E2E | 201, tạo member + wallet + tier |
| TC-C002 | Register với email đã tồn tại trong tenant | Integration | 409 CONFLICT |
| TC-C003 | Register với SĐT đã tồn tại trong tenant | Integration | 409 CONFLICT |
| TC-C004 | Register qua referral link → ghi nhận referral | Integration | Referral PENDING |
| TC-C005 | KYC upload CMND hợp lệ | Integration | 200, status = PENDING_KYC |
| TC-C006 | KYC upload file sai định dạng | Integration | 422, file type not allowed |
| TC-C007 | KYC upload file > 10MB | Integration | 422, file too large |
| TC-C008 | Admin approve KYC | Integration | 200, status = ACTIVE, notification sent |
| TC-C009 | Admin reject KYC (có lý do) | Integration | 200, status giữ nguyên, notification sent |
| TC-C010 | Lock member đang active | Integration | 200, member không thể login |
| TC-C011 | Unlock member đang locked | Integration | 200, member login lại được |
| TC-C012 | Search member by phone | Integration | 200, đúng member |
| TC-C013 | Bulk lock 10 members | Integration | 200, cả 10 bị lock |
| TC-C014 | Import 1000 members từ CSV | Integration | 200, 1000 members created |
| TC-C015 | Export members ra CSV | Integration | 200, file CSV với header đúng |

### Module D: Points

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-D001 | Earn points from order (DELIVERED) | E2E | Points added, transaction recorded |
| TC-D002 | Earn points with tier multiplier (Gold = 1.5x) | Integration | points = base × 1.5 |
| TC-D003 | Earn points with campaign multiplier | Integration | points = base × campaign_multiplier |
| TC-D004 | Earn points > max per transaction | Integration | Giới hạn ở max |
| TC-D005 | Burn points để redeem reward | E2E | Points deducted, order created |
| TC-D006 | Burn points khi balance không đủ | Integration | 400 INSUFFICIENT_POINTS |
| TC-D007 | Admin manual adjust points (có lý do) | Integration | 200, balance updated, audit log |
| TC-D008 | Points expire correctly | Integration | Expired points = 0 available |
| TC-D009 | Point hold khi order pending | Integration | Available giảm, pending tăng |
| TC-D010 | Point release khi order cancelled | Integration | Available hoàn lại |
| TC-D011 | Point reversal khi refund | Integration | Points + notification |
| TC-D012 | Concurrent earn/burn không race condition | Performance | 100 concurrent requests, balance đúng |

### Module E: Campaign

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-E001 | Create campaign with valid data | Integration | 201, campaign created |
| TC-E002 | Create campaign với end_date < start_date | Unit | 422 VALIDATION_ERROR |
| TC-E003 | Campaign auto-start khi đến scheduled date | Integration | Cron kích hoạt campaign |
| TC-E004 | Campaign auto-end khi hết budget | Integration | Status = ENDED, notification sent |
| TC-E005 | Campaign performance analytics đúng | Integration | Members, points, redemptions khớp |

### Module F: Reward & Redemption

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-F001 | Redeem reward với đủ điểm + còn hàng | E2E | 200, points deducted, order PENDING |
| TC-F002 | Redeem reward khi hết hàng | Integration | 400 OUT_OF_STOCK |
| TC-F003 | Redeem reward khi không đủ điểm | Integration | 400 INSUFFICIENT_POINTS |
| TC-F004 | Admin approve physical reward order | Integration | 200, notification sent |
| TC-F005 | Admin reject physical reward order | Integration | 200, points refunded |
| TC-F006 | Digital reward auto-approve | Integration | 200, status = APPROVED |
| TC-F007 | Redeem vượt quá limit per day | Integration | 403 LIMIT_EXCEEDED |

### Module G: Referral

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-G001 | Member tạo referral link | Integration | 200, unique code generated |
| TC-G002 | Friend đăng ký qua referral link | E2E | Referral PENDING |
| TC-G003 | Friend mua hàng → referral CONVERTED | E2E | Referrer nhận points |
| TC-G004 | Self-referral (dùng code của chính mình) | Security | 400 SELF_REFERRAL |
| TC-G005 | Fraud: cùng IP đăng ký nhiều lần | Security | Flagged, admin review |

### Module H: Voucher

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-H001 | Batch generate 1000 vouchers | Integration | 200, 1000 codes unique |
| TC-H002 | Claim voucher từ pool | Integration | 200, voucher assigned to member |
| TC-H003 | Claim voucher khi pool hết | Integration | 400 POOL_EXHAUSTED |
| TC-H004 | Redeem voucher tại POS | Integration | 200, voucher USED |
| TC-H005 | Validate voucher hết hạn | Integration | 400 EXPIRED |
| TC-H006 | Redeem voucher đã dùng | Integration | 400 ALREADY_USED |
| TC-H007 | Apply voucher không đủ điều kiện (min order) | Integration | 400 CONDITIONS_NOT_MET |

### Module I: Promotion Engine

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-I001 | Create promotion rule with conditions + actions | Integration | 201 |
| TC-I002 | Evaluate rule đúng priority order | Integration | Rule cao nhất match được áp dụng |
| TC-I003 | Test rule với member ảo | Integration | Hiển thị kết quả simulate |
| TC-I004 | Rollback rule version | Integration | Restore previous version |

### Module J: Gamification

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-J001 | Auto-award badge khi member đạt criteria | Integration | Achievement created, notification |
| TC-J002 | Member claim mission reward | Integration | Points/badge awarded |
| TC-J003 | Member claim mission chưa hoàn thành | Integration | 400 NOT_COMPLETED |
| TC-J004 | Leaderboard hiển thị đúng top members | Integration | Sorted by points desc |

### Module K: Notification

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-K001 | Send transactional email | Integration | Email queued, log created |
| TC-K002 | Send SMS OTP | Integration | SMS sent trong 30s |
| TC-K003 | Send notification với template variables | Integration | Variables replaced correctly |
| TC-K004 | Broadcast to 1000 members | Performance | Tất cả đều nhận |
| TC-K005 | Retry when email delivery fails | Integration | Retry 3 times, max |

### Module L: Security

| ID | Test Case | Type | Expected Result |
|---|---|---|---|
| TC-L001 | JWT token không thể giả mạo | Security | Invalid signature → 401 |
| TC-L002 | Tenant A user access Tenant B data via IDOR | Security | 403 FORBIDDEN |
| TC-L003 | MEMBER role access admin endpoint | Security | 403 FORBIDDEN |
| TC-L004 | Rate limit exceeded → block | Security | 429 RATE_LIMIT_EXCEEDED |
| TC-L005 | XSS injection trong input fields | Security | Sanitized, không execute |
| TC-L006 | NoSQL injection trong queries | Security | Prisma bảo vệ |
| TC-L007 | Mass assignment protection | Security | Only whitelisted fields updated |

### Module M: Performance

| ID | Test Case | Type | Target |
|---|---|---|---|
| TC-M001 | List members page (1000 records) | Performance | < 500ms |
| TC-M002 | Point earn concurrent (100 users) | Performance | All succeed, no race condition |
| TC-M003 | Batch generate 10K vouchers | Performance | < 30s |
| TC-M004 | Import 10K members từ CSV | Performance | < 60s |
| TC-M005 | Dashboard load với 100K members | Performance | < 2s |
| TC-M006 | Search members (fuzzy) | Performance | < 1s |

---

## 8.3 Edge Cases & Negative Cases

| Edge Case | Module | Expected Behavior |
|---|---|---|
| Member đăng ký với email có dấu (unicode) | Member | Normalize email |
| Member đăng ký với SĐT nước ngoài | Member | Chấp nhận +84, +1, etc. |
| Redeem reward lúc 00:00:01 (cùng lúc 2 user) | Reward | Transaction isolation, 1 success 1 fail |
| Campaign budget = 0 | Campaign | Không thể kích hoạt |
| Voucher số lượng = 0 nhưng series active | Voucher | Hiển thị "Out of stock" |
| Member ở tier Diamond không có tier cao hơn | Tier | "Highest tier" message |
| Xóa tier đang có member | Tier | Blocked (có member dependency) |
| Bulk delete 0 records | Member | 200 OK, "0 records affected" |
| Upload file trùng tên | Upload | Rename with timestamp |
| Import CSV với header sai | Import | 422, "Invalid column: X" |
| Import CSV với dòng trống | Import | Skip empty rows |
| Webhook URL không reachable (3 retry fail) | Webhook | Mark as FAILED, alert admin |
| Refund order đã refund | Order | 400 ALREADY_REFUNDED |
| Cancel order đã deliver | Order | 400 CANNOT_CANCEL_DELIVERED |

---

## 8.4 Feature Completeness Check

### Completeness Scores

| Dimension | Score | Ghi chú |
|---|---|---|
| **Product Completeness** | **92%** | Thiếu Customer 360, Subscription, Billing |
| **BA Completeness** | **95%** | FRs đầy đủ, NFRs thiếu compliance & monitoring |
| **UX Completeness** | **88%** | Web OK, Mobile thiếu orders screen, tab nav, offline |
| **Web Completeness** | **90%** | Admin Web 40/57 pages; Member Web 17 pages |
| **Mobile Completeness** | **85%** | 22 screens, thiếu orders, push, camera |
| **Security Completeness** | **75%** | Thiếu PII encryption, OTP, token blacklist, Keycloak |
| **Architecture Completeness** | **70%** | Monolith disguised, chưa event-driven, chưa phân tách services |
| **QA Completeness** | **60%** | 182 unit tests, thiếu E2E, performance, security tests |
| **Infrastructure Completeness** | **65%** | Docker có đủ, nhưng code chưa integrate hạ tầng |
| **SaaS Readiness** | **35%** | Thiếu subscription, billing, feature limits |

### Items requiring improvement (score < 95%)

#### 1. Security (75% → target 95%)

| Action | Priority |
|---|---|
| PII Encryption (AES-256-GCM) | P1 |
| OTP Login for members | P1 |
| Token Blacklist via Redis | P1 |
| Rate Limiting per auth endpoint | P0 |
| Account Lockout after 5 failures | P0 |
| Keycloak SSO integration | P2 |
| API Key Management | P2 |

#### 2. Architecture (70% → target 95%)

| Action | Priority |
|---|---|
| Move logic from API Gateway to dedicated microservices | P1 |
| Implement Kafka event bus | P1 |
| Add API versioning (`/api/v1/`) | P2 |
| Implement CacheService (Redis) | P1 |
| Add circuit breaker patterns | P2 |

#### 3. QA (60% → target 95%)

| Action | Priority |
|---|---|
| Add E2E test for critical flows (register → earn → redeem) | P1 |
| Add security test suite | P1 |
| Add performance/load tests | P1 |
| Add integration tests for all services | P1 |

#### 4. SaaS Readiness (35% → target 95%)

| Action | Priority |
|---|---|
| Implement Subscription model | P1 |
| Feature limit enforcement | P1 |
| Usage tracking | P1 |
| Host dashboard (SaaS metrics) | P1 |
| Billing integration (Stripe) | P2 |
| Tenant onboarding wizard | P2 |

#### 5. Mobile Completeness (85% → target 95%)

| Action | Priority |
|---|---|
| Add OrdersScreen (list + detail) | P1 |
| Add Tab Navigation | P1 |
| Integrate Push Notifications (FCM) | P1 |
| Real QR Scanner | P1 |
| Offline support (cache) | P2 |

#### 6. Web Completeness (90% → target 95%)

| Action | Priority |
|---|---|
| Add Sort cho tất cả list pages | P1 |
| Add Refresh button | P2 |
| Add Forgot Password cho Admin Web | P1 |
| Add KYC Upload cho Member Web | P1 |
| Add Check-in cho Member Web | P2 |

---

## 8.5 Current Test Coverage vs Target

| Service | Current Tests | Target | Action |
|---|---|---|---|
| API Gateway | 182 tests | 500+ | Thêm E2E + integration |
| Admin Web | 0 | 100+ | Component tests |
| Member Web | 0 | 50+ | Component tests |
| Mobile App | 0 | 100+ | Screen tests |
| Microservices | 0 (stubs) | 200+ | After migration |
| **Total** | **182** | **950+** | |

---

## 8.6 Final Verdict

```
┌─────────────────────────────────────────────────────────────┐
│                FEATURE COMPLETENESS MATRIX                    │
├─────────────────────────────────────────────────────────────┤
│  Product Completeness      ████████████████████░░   92%     │
│  BA Completeness           ████████████████████░░   95%     │
│  UX Completeness           ██████████████████░░░░   88%     │
│  Web Completeness          ██████████████████░░░░   90%     │
│  Mobile Completeness       ██████████████████░░░░   85%     │
│  Security Completeness     █████████████████░░░░░   75%     │
│  Architecture Completeness ██████████████░░░░░░░░   70%     │
│  QA Completeness           ████████████░░░░░░░░░░   60%     │
│  Infrastructure Completeness█████████████░░░░░░░░░   65%     │
│  SaaS Readiness            ███████░░░░░░░░░░░░░░░   35%     │
├─────────────────────────────────────────────────────────────┤
│  OVERALL                   ████████████████░░░░░░   78%     │
└─────────────────────────────────────────────────────────────┘

RECOMMENDATION:
- SECURITY: 75% < 95% → CẦN CẢI THIỆN (PII encryption, OTP, rate limit)
- ARCHITECTURE: 70% < 95% → CẦN CẢI THIỆN (microservice migration, event bus)
- QA: 60% < 95% → CẦN CẢI THIỆN (thêm test suites)
- SAAS: 35% < 95% → CẦN CẢI THIỆN NGAY (subscription, billing, limits)
- MOBILE: 85% < 95% → CẦN CẢI THIỆN (orders, tab nav, push)
```

> **Kết luận**: Dự án có Product & BA completeness cao (92-95%), nhưng còn thiếu về Security (75%), Architecture (70%), QA (60%), và đặc biệt là SaaS Readiness (35%). Cần ưu tiên cải thiện SaaS subscription, security hardening, và test coverage trước khi production.
