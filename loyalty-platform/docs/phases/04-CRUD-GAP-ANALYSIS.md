# Phase 4: CRUD Gap Analysis

## 4.1 Current State Summary

### API Gateway: 227/228 endpoints implemented (99.6%)
### Microservices (membership, loyalty, campaign...): 0% business logic (all stubs)

## 4.2 CRUD Completeness Matrix

Legend: ✅ = Implemented | ❌ = Missing | ⚠️ = Partial | N/A = Not applicable

### Module A: Auth
| Operation | Status | Ghi chú |
|---|---|---|
| Register (Host) | ✅ | `POST /auth/host/register` |
| Register (Tenant Admin) | ✅ | `POST /auth/tenant/register` (thực tế qua `/tenants`) |
| Register (Member) | ✅ | `POST /members/register` |
| Login (Host) | ✅ | `POST /auth/host/login` |
| Login (Tenant) | ✅ | `POST /auth/tenant/login` |
| Login (Member) | ✅ | `POST /auth/member/login` |
| Refresh Token | ✅ | `POST /auth/refresh` |
| Forgot Password | ✅ | `POST /auth/forgot-password` |
| Reset Password | ✅ | `POST /auth/reset-password` |
| Change Password | ✅ | `POST /auth/change-password` |
| OTP Login | ❌ **Missing** | Cần implement OTP login cho member |
| Social Login | ❌ **Missing** | Google/Facebook/Zalo login |
| Logout (blacklist token) | ❌ **Missing** | Chưa có cơ chế revoke token |

### Module B: Tenant
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | Search, filter, pagination |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete (soft) | ✅ | |
| Suspend | ✅ | |
| Tenant Branding | ❌ **Missing** | Upload logo, colors |
| Tenant Subscription | ❌ **Missing** | Quản lý gói subscription |
| Tenant Feature Toggle | ❌ **Missing** | Bật/tắt tính năng theo tenant |
| Tenant Domain Config | ❌ **Missing** | Custom domain |

### Module C: User
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | Search, filter, pagination |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete (soft) | ✅ | |
| Assign Role | ❌ **Missing** | Chưa có endpoint riêng |
| Bulk Invite Users | ❌ **Missing** | Gửi email invite hàng loạt |
| User Permissions Matrix | ❌ **Missing** | Granular permissions |
| Staff Assignment | ❌ **Missing** | Gán staff vào store |

### Module D: Member
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | Admin + self-register |
| List | ✅ | Search, filter, paginate, sort |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete (soft) | ✅ | |
| KYC Submit | ✅ | Upload giấy tờ |
| KYC Review | ✅ | Approve/Reject |
| Lock/Unlock | ✅ | |
| Tags Management | ✅ | |
| Activity Timeline | ✅ | |
| Tier Suggestion | ✅ | |
| Manual Points | ✅ | |
| **Bulk Actions** | ⚠️ Partial | Bulk lock/unlock/assign tier? **Missing** |
| **Import** | ✅ | CSV import |
| **Export** | ✅ | CSV export |
| **Merge Members** | ❌ **Missing** | Gộp 2 member trùng |
| **History** | ✅ | Activity timeline |
| **Notification** | ⚠️ Partial | Welcome, không có reminder |

### Module E: Tier
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete | ✅ | |
| Tier Rules | ❌ **Missing** | Không có endpoint riêng |
| Tier Benefits | ❌ **Missing** | Không có endpoint riêng |
| Auto Upgrade | ❌ **Missing** | Chưa có batch job tier.upgrade |
| Auto Downgrade | ❌ **Missing** | Chưa có batch job tier.downgrade |
| Tier Progress View | ✅ | Qua `/me/tier-progress` |
| Tier History | ❌ **Missing** | Lịch sử thay đổi tier |

### Module F: Point
| Operation | Status | Ghi chú |
|---|---|---|
| Wallet (Balance) | ✅ | |
| Earn | ✅ | Auto + manual |
| Burn | ✅ | |
| List Transactions | ✅ | Filter, paginate |
| Adjust (Admin) | ✅ | |
| **Point Expiration** | ❌ **Missing** | Chưa có cron + notification |
| **Point Hold/Release** | ❌ **Missing** | Hold khi order pending |
| **Point Transfer** | ❌ **Missing** | Chuyển điểm giữa members |
| **Multi-currency Points** | ❌ **Missing** | Nhiều loại điểm |
| **Expiry Notification** | ❌ **Missing** | Thông báo sắp hết hạn |
| **Point Analytics** | ⚠️ Partial | Có analytics nhưng chưa đầy đủ |

### Module G: Campaign
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | Search, filter, paginate |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete | ✅ | Soft delete |
| Campaign Performance | ✅ | |
| **Campaign Rules** | ❌ **Missing** | Target audience, conditions |
| **Campaign Budget** | ❌ **Missing** | Budget tracking và cảnh báo |
| **Campaign Schedule** | ❌ **Missing** | Recurring campaigns |
| **Campaign Approval** | ❌ **Missing** | Workflow duyệt campaign |
| **Campaign Notification** | ❌ **Missing** | Gửi thông báo đến target |
| **Campaign Duplicate** | ❌ **Missing** | Clone campaign |
| **Campaign A/B Test** | ❌ **Missing** | A/B testing |

### Module H: Reward
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | Search, filter |
| Get by ID | ✅ | |
| Update | ✅ | |
| Delete | ✅ | Soft delete |
| Redeem | ✅ | |
| Redemption History | ✅ | |
| **Inventory Management** | ⚠️ Partial | Chỉ có stock check, chưa có low stock alert |
| **Reward Categories** | ❌ **Missing** | Phân loại reward |
| **Reward Images** | ❌ **Missing** | Upload nhiều ảnh |
| **Reward Sorting** | ❌ **Missing** | Sắp xếp thứ tự |
| **Featured Rewards** | ❌ **Missing** | Đánh dấu nổi bật |
| **Reward Bulk Import** | ❌ **Missing** | Import từ Excel |

### Module I: Redemption
| Operation | Status | Ghi chú |
|---|---|---|
| Redeem | ✅ | |
| Orders List | ✅ | Filter, paginate |
| Order Detail | ✅ | |
| Approve | ✅ | |
| Reject | ✅ | |
| Cancel | ❌ **Missing** | Hủy đơn (admin/member) |
| Update Delivery | ❌ **Missing** | Tracking delivery |
| Auto Approve | ❌ **Missing** | Tự động duyệt digital reward |
| Redemption Limit | ❌ **Missing** | Giới hạn theo tier |
| Redemption Notification | ❌ **Missing** | Thông báo trạng thái |

### Module J: Referral
| Operation | Status | Ghi chú |
|---|---|---|
| Create Link | ✅ | |
| List Referrals | ✅ | |
| Stats | ✅ | |
| Convert | ✅ | |
| **Referral Code** | ✅ | Tự động sinh |
| **QR Referral** | ❌ **Missing** | QR code generation |
| **Referral Leaderboard** | ❌ **Missing** | BXH giới thiệu |
| **Referral Rules Config** | ❌ **Missing** | Cấu hình luật thưởng |
| **Multi-level Referral** | ❌ **Missing** | F1, F2 |
| **Referral Fraud Detection** | ❌ **Missing** | Phát hiện gian lận |
| **Referral Reward History** | ❌ **Missing** | Lịch sử thưởng |
| **Referral Expiry** | ❌ **Missing** | Hết hạn mã |

### Module K: Voucher
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | |
| Get | ✅ | |
| Update | ✅ | |
| Delete | ✅ | |
| Validate | ✅ | |
| Redeem | ✅ | |
| Batch Generate | ✅ | |
| Expire (Cron) | ✅ | |
| Expired Stats | ✅ | |
| **Voucher Series** | ❌ **Missing** | Group voucher management |
| **Claim Voucher** | ❌ **Missing** | Member claim từ pool |
| **Voucher Pool** | ❌ **Missing** | Pool management |
| **Voucher Restrictions** | ❌ **Missing** | Min order, category |
| **Voucher Analytics** | ❌ **Missing** | Usage analytics |
| **Bulk Voucher Action** | ❌ **Missing** | Bulk extend/expire |

### Module L: Promotion
| Operation | Status | Ghi chú |
|---|---|---|
| Create | ✅ | |
| List | ✅ | |
| Get | ✅ | |
| Update | ✅ | |
| Delete | ✅ | |
| **Add Condition** | ❌ **Missing** | Embedded trong JSON, chưa có API riêng |
| **Add Action** | ❌ **Missing** | Embedded trong JSON, chưa có API riêng |
| **Reorder Priority** | ❌ **Missing** | Drag-drop reorder |
| **Version History** | ❌ **Missing** | Rollback |
| **Test Rule** | ❌ **Missing** | Simulate |
| **Rule Schedule** | ❌ **Missing** | Date range |
| **Rule Analytics** | ❌ **Missing** | Usage stats |

### Module M: Gamification
| Operation | Status | Ghi chú |
|---|---|---|
| Badge CRUD | ✅ | |
| Mission CRUD | ✅ | |
| **Achievement Tracking** | ❌ **Missing** | Auto award khi đủ điều kiện |
| **Leaderboard** | ❌ **Missing** | Bảng xếp hạng |
| **Mission Progress** | ❌ **Missing** | Theo dõi tiến độ |
| **Claim Mission Reward** | ❌ **Missing** | Nhận thưởng |
| **Badge Display** | ❌ **Missing** | Hiển thị trên profile |

### Module N: Notification
| Operation | Status | Ghi chú |
|---|---|---|
| Template CRUD | ✅ | |
| Send | ✅ | |
| Broadcast | ✅ | |
| Logs | ✅ | |
| **SMS** | ❌ **Missing** | SMS sending implementation |
| **Push Notification** | ❌ **Missing** | Web push, mobile push |
| **Zalo OA** | ❌ **Missing** | Zalo integration |
| **Scheduled Notification** | ❌ **Missing** | Schedule gửi |
| **Batch Notification** | ❌ **Missing** | Gửi theo segment |
| **Notification Preferences** | ❌ **Missing** | Member chọn kênh |
| **Webhook Notification** | ❌ **Missing** | Gửi qua webhook |

### Module O: Analytics
| Operation | Status | Ghi chú |
|---|---|---|
| Points Trend | ✅ | |
| Member Growth | ✅ | |
| Campaign Performance | ✅ | |
| Top Members | ✅ | |
| Voucher Stats | ✅ | |
| Expiring Points | ✅ | |
| Leaderboard | ✅ | |
| Voucher Analytics | ✅ | |
| **Retention Report** | ❌ **Missing** | Retention/churn |
| **LTV Report** | ❌ **Missing** | Lifetime value |
| **Cohort Analysis** | ❌ **Missing** | Cohort tracking |
| **Scheduled Reports** | ❌ **Missing** | Email định kỳ |
| **Export Report** | ❌ **Missing** | PDF export |

### Module P: Customer 360
| Operation | Status | Ghi chú |
|---|---|---|
| **Unified Profile** | ❌ **Missing** | **Module completely missing** |
| **Activity Timeline** | ❌ **Missing** | |
| **Customer Summary** | ❌ **Missing** | |
| **RFM Analysis** | ✅ | Có trong member-segmentation |

### Module Q: Product & Order
| Operation | Status | Ghi chú |
|---|---|---|
| Product CRUD | ✅ | |
| Category CRUD | ✅ | |
| Order CRUD | ✅ | |
| Order Status Flow | ✅ | |
| Cancel Order | ✅ | |
| Timeline | ✅ | |
| Bulk Product Ops | ✅ | |
| **Product Reviews** | ❌ **Missing** | Đánh giá sản phẩm |
| **Order Refund** | ❌ **Missing** | Hoàn tiền |
| **Auto Earn Points** | ✅ | |
| **Bulk Order Update** | ❌ **Missing** | Bulk update status |

### Module R: Coupon
| Operation | Status | Ghi chú |
|---|---|---|
| CRUD | ✅ | |
| Bulk Generate | ✅ | |
| Validate | ✅ | |
| Apply | ✅ | |
| Performance Stats | ✅ | |
| Usage Report | ✅ | |

### Modules S-V: Cashback, Check-in, Store, Settings, etc.
| Operation | Status |
|---|---|
| Cashback Config | ✅ |
| Cashback Earn/Redeem | ✅ |
| Check-in | ✅ |
| Store CRUD | ✅ |
| Store Staff | ✅ |
| Settings | ✅ |
| Feedback | ✅ |
| Webhook | ✅ |
| Earning Rules | ✅ |
| Audit Log | ✅ |
| Upload | ✅ |
| Bulk Actions | ✅ |
| Import/Export | ✅ |
| **Member Voucher CRUD** | ✅ |
| **Member Voucher QR** | ✅ |
| **RFM Segmentation** | ✅ |

---

## 4.3 Critical Gaps (CRUD không đủ)

### Gap 1: Bulk Operations
| Thiếu | Mô tả | Priority |
|---|---|---|
| Bulk Member Actions | Lock/unlock, assign tier, send notification | P1 |
| Bulk Voucher Actions | Extend expiry, cancel, resend | P2 |
| Bulk Order Update | Update status hàng loạt | P2 |

### Gap 2: Workflow & Approval
| Thiếu | Mô tả | Priority |
|---|---|---|
| Campaign Approval | Super admin duyệt campaign trước khi chạy | P2 |
| Tier Upgrade/Downgrade Approval | Admin duyệt trước khi change | P2 |
| Referral Reward Approval | Duyệt thưởng referral | P2 |

### Gap 3: Notification & Automation
| Thiếu | Mô tả | Priority |
|---|---|---|
| Point Expiry Reminder | Cron job + notification | P1 |
| Inactive Member Reminder | Re-engagement campaign | P2 |
| Birthday Campaign | Tự động chúc mừng + thưởng | P1 |
| Anniversary Campaign | Kỷ niệm ngày tham gia | P2 |

### Gap 4: Missing Sub-Modules
| Thiếu | Mô tả | Priority |
|---|---|---|
| **Customer 360 Service** | Module hoàn toàn không tồn tại | P1 |
| **Voucher Series Management** | Group vouchers | P1 |
| **Referral Rule Config** | Cấu hình luật thưởng | P1 |
| **Achievement Engine** | Auto award badges/missions | P1 |
| **Event Management** | Sự kiện, workshop, seminar | P2 |
| **Gift Card Module** | Missing (đã có trong code nhưng... check) | ✅ Actually exists |

### Gap 5: Security Gaps
| Thiếu | Mô tả | Priority |
|---|---|---|
| Token Blacklist | Logout không revoke token | P1 |
| Rate Limiting per Endpoint | Auth endpoints cần rate limit riêng | P1 |
| PII Encryption | Mã hóa phone, email, CMND | P2 |
| API Key Auth | Cho third-party systems | P2 |

### Gap 6: Integration Gaps (Microservices)
| Service | Status | Cần implement |
|---|---|---|
| membership-service | **STUB** | Real logic (hiện có trong API Gateway) |
| loyalty-service | **STUB** | Real logic (hiện có trong API Gateway) |
| campaign-service | **STUB** | Real logic (hiện có trong API Gateway) |
| reward-service | **STUB** | Real logic (hiện có trong API Gateway) |
| referral-service | **STUB** | Real logic (hiện có trong API Gateway) |
| voucher-service | **STUB** | Real logic (hiện có trong API Gateway) |
| promotion-service | **STUB** | Real logic (hiện có trong API Gateway) |
| gamification-service | **STUB** | Real logic (hiện có trong API Gateway) |
| notification-service | **STUB** | Real logic (hiện có trong API Gateway) |
| analytics-service | **STUB** | Real logic (hiện có trong API Gateway) |
| customer360-service | **STUB** | Module mới cần build |
| **Kafka Event Bus** | ❌ **Not integrated** | Các service chưa giao tiếp qua Kafka |

---

## 4.4 Phân tích Soft Delete vs Hard Delete

| Entity | Hiện tại | Khuyến nghị |
|---|---|---|
| Tenant | ✅ Soft delete (deletedAt) | Giữ nguyên |
| User | ✅ Soft delete | Giữ nguyên |
| Member | ✅ Soft delete | Giữ nguyên |
| Product | ✅ Soft delete | Giữ nguyên |
| Campaign | ✅ Soft delete | Giữ nguyên |
| Reward | ✅ Soft delete | Giữ nguyên |
| Voucher | ✅ Soft delete | Giữ nguyên |
| Promotion | ✅ Soft delete | Giữ nguyên |
| Referral | ✅ Soft delete | Giữ nguyên |
| PointTransaction | ❌ Hard delete | Giữ hard (audit trail) |
| Order | ❌ Hard delete (có cancel) | Giữ hard (chỉ cancel) |
| Coupon | ❌ Hard delete | Chuyển thành soft delete |

## 4.5 Missing Entity Relations (Prisma Schema)

| Quan hệ còn thiếu | Mô tả |
|---|---|
| Campaign ↔ TargetAudience | Campaign cần quản lý đối tượng mục tiêu |
| Voucher ↔ VoucherSeries | Chưa có VoucherSeries model |
| Referral ↔ ReferralRule | Chưa có ReferralRule model |
| Badge/Mission → Achievement | Chưa có Achievement auto award |
| Event → Member | Event registration tracking |
