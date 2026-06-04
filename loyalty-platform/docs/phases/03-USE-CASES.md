# Phase 3: Use Cases — Full Flow Analysis

## 3.1 Use Case: Member Registration & KYC

### UC-001: Member Self-Registration

| Trường | Giá trị |
|---|---|
| **Mô tả** | Khách hàng tự đăng ký làm hội viên qua Web/Mobile |
| **Actor** | Anonymous (khách hàng mới) |
| **Trigger** | User click "Đăng ký" |
| **Precondition** | Tenant đang active, member chưa tồn tại với email/phone này |

**Main Flow:**
1. User nhập: Họ tên, SĐT, Email, Password
2. Hệ thống kiểm tra email/SĐT chưa được đăng ký
3. Hệ thống gửi OTP xác thực SĐT/email
4. User nhập OTP
5. Hệ thống tạo member (status: ACTIVE hoặc PENDING_KYC tùy config)
6. Hệ thống tạo Point Wallet (balance = 0)
7. Hệ thống gán tier mặc định (Member)
8. Hệ thống phát sinh sự kiện `member.registered`
9. Hệ thống gửi email/SMS chào mừng
10. Hệ thống trả về JWT + member info

**Alternative Flow A1: Đăng ký không cần OTP (admin tạo)**
1. Admin nhập thông tin member trên web
2. Hệ thống kiểm tra email/SĐT chưa tồn tại
3. Admin chọn tier, tags
4. Hệ thống tạo member (status: ACTIVE)
5. Gửi email/SMS thông báo mật khẩu cho member

**Alternative Flow A2: Đăng ký qua referral link**
1. User click referral link (có code trong URL)
2. Form đăng ký tự điền mã giới thiệu
3. Đăng ký thành công → referral được ghi nhận (PENDING)
4. Sau khi referral mua hàng → referral chuyển CONVERTED

**Exception Flow E1: Email/SĐT đã tồn tại**
1. Hệ thống trả lỗi: "Email/Số điện thoại đã được đăng ký"
2. Gợi ý: "Bạn đã có tài khoản? Đăng nhập ngay"

**Exception Flow E2: OTP sai**
1. User nhập sai OTP
2. Hệ thống trả lỗi: "Mã OTP không đúng"
3. Cho phép gửi lại OTP (tối đa 5 lần/giờ)

**Exception Flow E3: Tenant bị suspend**
1. Hệ thống trả lỗi: "Hệ thống tạm ngưng hoạt động"

**Validation Rules:**
- Email: định dạng email hợp lệ, unique trong tenant
- SĐT: 10-11 số, bắt đầu bằng 0, unique trong tenant
- Password: tối thiểu 8 ký tự, có chữ hoa + số + ký tự đặc biệt
- Họ tên: 2-100 ký tự, không chứa ký tự đặc biệt
- OTP: 6 số, hết hạn sau 5 phút

### UC-002: KYC Submission & Review

| Trường | Giá trị |
|---|---|
| **Mô tả** | Member submit giấy tờ định danh để xác thực |
| **Actor** | Member, Admin/Staff |
| **Trigger** | Member vào màn hình KYC |
| **Precondition** | Member status = PENDING_KYC hoặc ACTIVE (chưa KYC) |

**Main Flow:**
1. Member chọn loại giấy tờ: CMND/CCCD/Hộ chiếu
2. Member upload ảnh mặt trước, mặt sau
3. Member upload ảnh chân dung (selfie)
4. Hệ thống validate file (type, size, resolution)
5. Hệ thống lưu file lên MinIO
6. Hệ thống cập nhật member status = PENDING_KYC
7. Hệ thống thông báo cho admin/staff có KYC mới
8. Admin review:
   - Approve: status → ACTIVE, ghi nhận KYC approved
   - Reject: status → ACTIVE (nếu đã active) hoặc giữ nguyên, ghi lý do reject
9. Hệ thống gửi thông báo kết quả cho member

**Alternative Flow A1: Tự động KYC (qua eKYC API)**
1. Tích hợp eKYC third-party (Vietcombank, MISA, ...)
2. Hệ thống tự động verify CMND/CCCD
3. Nếu match → tự động approve

**Exception Flow E1: File upload sai định dạng**
- Chỉ chấp nhận: jpg, png, pdf
- Dung lượng tối đa: 10MB/file

**Exception Flow E2: Ảnh không rõ**
- Hệ thống nhưng admin reject vì ảnh mờ
- Member upload lại

**Business Rules:**
- Member chỉ cần KYC 1 lần (trừ khi giấy tờ hết hạn)
- KYC phải được review trong vòng 24h (SLA)
- Lịch sử KYC được lưu đầy đủ

---

## 3.2 Use Case: Point Earning & Burning

### UC-003: Auto Earn Points from Order

| Trường | Giá trị |
|---|---|
| **Mô tả** | Member nhận điểm tự động khi mua hàng |
| **Actor** | System (automatic) |
| **Trigger** | Order chuyển sang DELIVERED |
| **Precondition** | Member active, order hợp lệ |

**Main Flow:**
1. System nhận event `order.delivered`
2. Tính điểm dựa trên: order.total × earning_rule.rate
3. Kiểm tra campaign đang active → áp dụng multiplier
4. Kiểm tra tier benefits → áp dụng tier multiplier
5. Kiểm tra promotion rules → áp dụng nếu match
6. Ghi PointTransaction (type: EARN, status: COMPLETED)
7. Cập nhật PointWallet balance
8. Kiểm tra tier upgrade condition
9. Phát sinh event `points.earned`
10. Gửi notification: "Bạn vừa nhận X điểm từ đơn hàng #ABC"

**Alternative Flow A1: Manual Earn (Admin)**
1. Admin chọn member, nhập số điểm, lý do
2. Hệ thống ghi PointTransaction (type: EARN, source: MANUAL)
3. Cập nhật balance

**Alternative Flow A2: Earn from Referral**
1. Referral CONVERTED → referral purchase completed
2. Tính reward points theo config
3. Ghi điểm cho người giới thiệu
4. Notification cho người giới thiệu

**Exception Flow E1: Tính điểm lỗi**
- Log error, retry 3 lần
- Nếu vẫn lỗi → push vào DLQ (Dead Letter Queue)
- Admin được thông báo

**Validation Rules:**
- Số điểm earn > 0
- Không earn quá max points per transaction
- Member không bị locked/suspended

### UC-004: Burn Points (Redeem)

| Trường | Giá trị |
|---|---|
| **Mô tả** | Member tiêu điểm để đổi reward |
| **Actor** | Member |
| **Trigger** | Member chọn reward và click "Đổi ngay" |

**Main Flow:**
1. Member chọn reward từ catalog
2. Hệ thống kiểm tra: available points ≥ reward.cost
3. Hệ thống kiểm tra reward inventory (còn hàng)
4. Hệ thống kiểm tra redemption limit (theo tier, member)
5. Hệ thống hold điểm (trừ available, tăng pending)
6. Tạo RewardOrder (status: PENDING_APPROVAL)
7. Nếu reward là digital → auto approve
8. Nếu reward là physical → chờ admin approve
9. Gửi notification xác nhận

**Alternative Flow A1: Redeem with insufficient points**
1. Hệ thống thông báo: "Bạn còn X điểm, cần Y điểm"
2. Gợi ý: "Còn thiếu Z điểm. Xem cách tích điểm thêm"

**Alternative Flow A2: Admin redeem cho member (tại quầy)**
1. Staff chọn member (search phone/email)
2. Staff chọn reward
3. Staff xác nhận
4. Giống main flow

**Exception Flow E1: Hết hàng khi đổi**
- Kiểm tra inventory sau khi click đổi
- Nếu hết → rollback điểm hold, thông báo "Đã hết hàng"

**Business Rules:**
- Min points per redemption: configurable
- Max redemptions per day: configurable theo tier
- Physical rewards require admin approval
- Digital rewards auto-approved

---

## 3.3 Use Case: Referral Program

### UC-005: Member Creates Referral & Friend Registers

| Trường | Giá trị |
|---|---|
| **Mô tả** | Member tạo mã giới thiệu, chia sẻ, bạn bè đăng ký |
| **Actor** | Member (referrer), Anonymous (referee) |
| **Trigger** | Member vào màn hình Referral |

**Main Flow:**
1. Hệ thống tự động tạo referral code cho member (nếu chưa có)
2. Member xem referral code, link, QR code
3. Member copy link / chia sẻ qua social
4. Friend click link → vào landing page (có tracking params)
5. Friend đăng ký thành công
6. Hệ thống tạo Referral (refereeId, referrerId, status: PENDING)
7. Hệ thống gửi notification: "Bạn có một người giới thiệu mới!"
8. Friend mua hàng (order DELIVERED)
9. Hệ thống cập nhật Referral status → CONVERTED
10. Hệ thống tính reward → tạo ReferralReward
11. Hệ thống gửi notification: "Bạn nhận X điểm từ giới thiệu!"

**Alternative Flow A1: Share QR offline**
1. Member show QR code tại showroom
2. Staff scan QR → điền thông tin
3. Đăng ký offline → referral ghi nhận

**Alternative Flow A2: Multi-level referral**
1. A giới thiệu B, B giới thiệu C
2. A nhận thưởng từ B (F1), A nhận thưởng thấp hơn từ C (F2)

**Exception Flow E1: Fraud detection**
1. Cùng IP, cùng device, cùng SĐT
2. Hệ thống đánh dấu suspicious
3. Admin review → reject nếu fraud

**Business Rules:**
- Referral reward chỉ được tính khi referee có order DELIVERED
- Referral code unique trong tenant
- Thời gian hiệu lực: 90 days (configurable)
- Tối đa reward per referrer per month: configurable

---

## 3.4 Use Case: Campaign Management

### UC-006: Create & Launch Campaign

| Trường | Giá trị |
|---|---|
| **Mô tả** | Admin tạo campaign loyalty mới |
| **Actor** | Tenant Admin |
| **Trigger** | Admin vào Campaign → Create |

**Main Flow:**
1. Admin nhập: tên, mô tả, loại campaign
2. Admin chọn date range (start_date, end_date)
3. Admin cấu hình budget (max points, max members)
4. Admin chọn target audience (tiers, segments)
5. Admin định nghĩa rules (earn multiplier, bonus)
6. Admin xem preview budget estimation
7. Admin save campaign (status: DRAFT)
8. Admin kích hoạt campaign → status: ACTIVE
9. Hệ thống gửi notification cho target audience
10. Campaign bắt đầu tracking

**Alternative Flow A1: Scheduled launch**
1. Admin set scheduled_date trong tương lai
2. Hệ thống tự động kích hoạt vào scheduled_date

**Alternative Flow A2: Campaign approval workflow**
1. Admin tạo campaign (status: PENDING_APPROVAL)
2. Super Admin / Manager review & approve
3. Campaign chuyển ACTIVE

**Exception Flow E1: Budget exceeded**
1. Campaign đạt max budget
2. Hệ thống tự động dừng campaign
3. Gửi notification cho admin

**Business Rules:**
- Campaign không thể edit khi đang ACTIVE (chỉ pause/stop)
- Mỗi tenant có thể chạy tối đa 5 campaign đồng thời (configurable)
- Campaign có thể overlap (member nhận multiple benefits)

---

## 3.5 Use Case: Promotion Engine

### UC-007: Rule Builder - Create Promotion Rule

| Trường | Giá trị |
|---|---|
| **Mô tả** | Admin tạo promotion rule với IF-THEN logic |
| **Actor** | Tenant Admin |
| **Trigger** | Admin vào Promotion → New Rule |

**Main Flow:**
1. Admin nhập: tên rule, mô tả, priority (số thứ tự)
2. Admin chọn điều kiện (IF):
   - Customer: tier = Gold, total_spent > 1B
   - Product: category = "Căn hộ", price > 5B
   - Points: current_balance > 10,000
   - Date: trong tháng sinh nhật
3. Admin chọn hành động (THEN):
   - Earn: +500 points
   - Multiply: x2 points
   - Discount: 5% off
   - Voucher: tặng voucher X
4. Admin set date range cho rule
5. Admin save & kích hoạt

**Alternative Flow A1: Complex conditions**
1. AND/OR/NOT logic
2. Nested conditions
3. Group conditions

**Alternative Flow A2: Test rule**
1. Admin chọn "Test Rule"
2. Chọn member ảo / member thật
3. Hệ thống simulate và hiển thị kết quả

**Business Rules:**
- Rules được evaluate theo priority (thứ tự)
- Rule đầu tiên match → được áp dụng
- Version history được lưu để rollback

---

## 3.6 Use Case: Voucher Lifecycle

### UC-008: Create Voucher Series & Member Claims

| Trường | Giá trị |
|---|---|
| **Mô tả** | Admin tạo voucher series, member claim và sử dụng |
| **Actor** | Admin, Member |
| **Trigger** | Admin tạo series, member claim |

**Main Flow (Admin - Create):**
1. Admin tạo voucher series (name, type: PERCENT/FIXED)
2. Admin set value (10% off / 500K off)
3. Admin set quantity (1000 vouchers)
4. Admin set restrictions (min order, category, tier)
5. Admin set expiry date
6. Hệ thống sinh voucher codes hàng loạt
7. Series sẵn sàng để claim

**Main Flow (Member - Claim):**
1. Member thấy voucher trong campaign hoặc reward catalog
2. Member click "Nhận voucher"
3. Hệ thống kiểm tra: member còn lượt claim?
4. Hệ thống kiểm tra: voucher còn trong pool?
5. Hệ thống gán voucher cho member (MemberVoucher)
6. Hệ thống gửi notification + code cho member
7. Member thấy voucher trong "Voucher của tôi"

**Main Flow (Member - Redeem):**
1. Member có order, chọn "Áp voucher"
2. Member nhập voucher code hoặc chọn từ danh sách
3. Hệ thống validate: còn hạn, đúng điều kiện
4. Hệ thống áp giảm giá vào order
5. Cập nhật voucher status: USED

**Exception Flow E1: Hết voucher pool**
- Thông báo "Voucher đã hết, quay lại sau"

**Exception Flow E2: Voucher hết hạn**
- Ẩn khỏi danh sách khả dụng, hiển thị trong "Đã hết hạn"

**Business Rules:**
- Mỗi member chỉ claim tối đa 1 voucher/series
- Voucher PERCENT có max discount cap
- Voucher không thể hoàn tiền sau khi đã dùng

---

## 3.7 Use Case: Tier Upgrade/Downgrade

### UC-009: Auto Tier Upgrade

| Trường | Giá trị |
|---|---|
| **Mô tả** | Tự động nâng hạng member khi đủ điều kiện |
| **Actor** | System (batch job) |
| **Trigger** | Batch job chạy hàng ngày / realtime sau transaction |

**Main Flow:**
1. Batch job query tất cả members
2. Với mỗi member, tính: total_spent, total_transactions, total_points, membership_years
3. So sánh với tier rules → xác định tier phù hợp
4. Nếu member đủ điều kiện lên tier cao hơn:
   - Update member_tier
   - Ghi tier_history
   - Gửi notification: "Chúc mừng! Bạn đã lên hạng [Tier]"
   - Phát sinh event `tier.upgraded`

**Alternative Flow A1: Realtime upgrade**
1. Sau khi order delivered / points earned
2. Kiểm tra tier condition ngay lập tức
3. Nếu đủ → upgrade realtime

**Alternative Flow A2: Manual upgrade (Admin)**
1. Admin chọn member, chọn tier mới, nhập lý do
2. Hệ thống ghi nhận manual change
3. Gửi notification cho member

**Business Rules:**
- Upgrade: member chỉ lên, không xuống
- Downgrade: chạy batch job hàng tháng
- Grace period: 30 ngày trước khi downgrade
- Tier benefits áp dụng ngay sau upgrade

---

## 3.8 Use Case: Gamification - Badges & Missions

### UC-010: Member Earns Badge / Completes Mission

| Trường | Giá trị |
|---|---|
| **Mô tả** | Member nhận badge khi đạt điều kiện / hoàn thành mission |
| **Actor** | System, Member |
| **Trigger** | Event `order.delivered`, `referral.converted`, etc. |

**Main Flow (Badge):**
1. Hệ thống nhận event (order, referral, check-in, etc.)
2. Hệ thống kiểm tra tất cả badge criteria
3. Nếu member đủ điều kiện → award badge
4. Lưu Achievement
5. Gửi notification: "Bạn vừa nhận huy hiệu [Badge Name]!"
6. Badge hiển thị trên profile member

**Main Flow (Mission):**
1. Member xem danh sách missions
2. Member thấy progress (vd: "Đã giới thiệu 3/5 bạn bè")
3. Khi hoàn thành → click "Nhận thưởng"
4. Hệ thống kiểm tra điều kiện
5. Trao thưởng (points, badge, voucher)
6. Mission đánh dấu COMPLETED

**Business Rules:**
- Badge unique per member (không award trùng)
- Mission có thể có time limit
- Member không thể claim reward nếu chưa hoàn thành

---

## 3.9 Use Case: Multi-Tenant Operations

### UC-011: Host Creates New Tenant

| Trường | Giá trị |
|---|---|
| **Mô tả** | Host (Platform Owner) tạo tenant mới |
| **Actor** | Host |
| **Trigger** | Host vào Tenant Management → Create |

**Main Flow:**
1. Host nhập: tên công ty, subdomain, email admin, SĐT
2. Host chọn subscription package
3. Hệ thống kiểm tra subdomain unique
4. Hệ thống tạo Tenant (status: ACTIVE)
5. Hệ thống tạo User admin (gửi email set password)
6. Hệ thống tạo default data: tiers, settings
7. Hệ thống phát sinh event `tenant.created`
8. Gửi email welcome cho tenant admin

**Alternative Flow A1: Self-registration (tenant tự đăng ký)**
1. User vào landing page → "Tạo tài khoản"
2. Nhập thông tin, chọn gói, thanh toán
3. Tự động tạo tenant after payment

**Business Rules:**
- Subdomain unique, chỉ chứa chữ thường + số + hyphen
- Mỗi tenant có database riêng (nếu premium)
- Tenant không thể tự xóa (phải liên hệ Host)

---

## 3.10 Use Case: Cross-cutting Concerns

### UC-012: Admin Views Audit Log

| Trường | Giá trị |
|---|---|
| **Mô tả** | Admin xem lịch sử thay đổi trong tenant |
| **Actor** | Tenant Admin |
| **Trigger** | Admin vào Settings → Audit Log |

**Main Flow:**
1. Admin mở trang Audit Log
2. Hệ thống hiển thị danh sách (paginated)
3. Admin filter: action type, user, date range, entity type
4. Admin click một log entry
5. Hệ thống hiển thị chi tiết: old value → new value
6. Admin có thể export log ra CSV

**Audit Log Categories:**
- MEMBER_CREATED, MEMBER_UPDATED, MEMBER_LOCKED
- POINT_ADJUSTED, POINT_EARNED, POINT_BURNED
- CAMPAIGN_CREATED, CAMPAIGN_ACTIVATED, CAMPAIGN_PAUSED
- TIER_CREATED, TIER_UPDATED, TIER_DELETED
- REWARD_CREATED, REWARD_REDEEMED, REWARD_APPROVED
- USER_CREATED, USER_LOGIN, USER_FAILED_LOGIN
- SETTINGS_UPDATED, API_KEY_CREATED

### UC-013: Export Data

| Trường | Giá trị |
|---|---|
| **Mô tả** | User export dữ liệu ra file |
| **Actor** | Admin |
| **Trigger** | User click "Export" trên list page |

**Main Flow:**
1. User chọn loại dữ liệu (members, transactions, rewards...)
2. User chọn filter (date range, status...)
3. User chọn format (CSV, Excel)
4. Hệ thống tạo job export (async)
5. User nhận notification khi file sẵn sàng
6. User download file
7. File tự động xóa sau 24h

**Business Rules:**
- Export giới hạn 100K records/lần
- Export files auto-delete sau 24h
- Export chứa PII phải được audit log
