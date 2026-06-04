# Phase 2: BA Analysis — Functional & Non-Functional Requirements

## 2.1 Functional Requirements (FR)

### Module A: Auth & Identity (API Gateway)

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-A001 | Host Register | Đăng ký tài khoản Host (Platform Owner) với email, password, company info | P0 | Anonymous |
| FR-A002 | Host Login | Đăng nhập bằng email + password, nhận JWT | P0 | Host |
| FR-A003 | Tenant Admin Register | Đăng ký tenant mới, tự động tạo tenant + admin user | P0 | Anonymous |
| FR-A004 | Tenant Admin Login | Đăng nhập tenant-scoped, JWT có tenantId | P0 | Tenant Admin |
| FR-A005 | Member Register | Đăng ký tài khoản member (customer) | P0 | Anonymous |
| FR-A006 | Member Login | Đăng nhập member (email/phone + password hoặc OTP) | P0 | Member |
| FR-A007 | Token Refresh | Refresh JWT token (refresh token) | P0 | All |
| FR-A008 | Forgot Password | Gửi email/SMS reset password link | P1 | All |
| FR-A009 | Reset Password | Đặt lại password với token | P1 | All |
| FR-A010 | Change Password | Đổi mật khẩu (cần mật khẩu cũ) | P0 | All |
| FR-A011 | Social Login | Đăng nhập Google/Facebook/Zalo (member) | P2 | Member |
| FR-A012 | OTP Login | Đăng nhập bằng OTP gửi SMS (member) | P1 | Member |
| FR-A013 | Logout | Vô hiệu hóa token / clear session | P0 | All |

### Module B: Tenant Management

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-B001 | Create Tenant | Tạo tenant mới (tên, subdomain, logo, contact) | P0 | Host |
| FR-B002 | List Tenants | Danh sách tenants (search, filter, sort, pagination) | P0 | Host |
| FR-B003 | Get Tenant Detail | Thông tin chi tiết tenant | P0 | Host, Admin |
| FR-B004 | Update Tenant | Cập nhật thông tin tenant | P0 | Host, Admin |
| FR-B005 | Delete Tenant | Xóa tenant (soft delete) | P1 | Host |
| FR-B006 | Suspend Tenant | Tạm khóa tenant (không ai login được) | P0 | Host |
| FR-B007 | Tenant Branding | Upload logo, colors, custom domain | P1 | Admin |
| FR-B008 | Tenant Settings | Cấu hình tenant-level (points, tiers, etc.) | P0 | Admin |
| FR-B009 | Tenant Analytics | Thống kê tenant-level (members, points, revenue) | P1 | Host |
| FR-B010 | Tenant Subscription | Quản lý gói subscription của tenant | P1 | Host |
| FR-B011 | Tenant Feature Toggle | Bật/tắt tính năng theo tenant | P1 | Host |

### Module C: User Management (Tenant-level)

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-C001 | Create User | Tạo user (admin/staff) trong tenant | P0 | Admin |
| FR-C002 | List Users | Danh sách users trong tenant (search, filter) | P0 | Admin |
| FR-C003 | Get User Detail | Chi tiết user (vai trò, permissions) | P0 | Admin |
| FR-C004 | Update User | Cập nhật thông tin user | P0 | Admin |
| FR-C005 | Delete User | Xóa user (soft delete) | P1 | Admin |
| FR-C006 | Assign Role | Gán vai trò cho user (Admin, Staff, etc.) | P0 | Admin |
| FR-C007 | User Permissions | Quản lý quyền chi tiết (màn hình, actions) | P1 | Admin |
| FR-C008 | Staff Assignment | Gán staff vào store/chi nhánh | P2 | Admin |
| FR-C009 | User Activity Log | Log tất cả hành động của user | P0 | Auto |

### Module D: Membership Service

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-D001 | Create Member | Đăng ký hội viên mới (admin tạo hoặc member tự ĐK) | P0 | Admin, Staff, Anonymous |
| FR-D002 | List Members | Danh sách members (search, filter, sort, export) | P0 | Admin, Staff |
| FR-D003 | Get Member Detail | Chi tiết hội viên (profile, points, tier, history) | P0 | Admin, Staff |
| FR-D004 | Update Member Profile | Cập nhật thông tin cá nhân | P0 | Admin, Member |
| FR-D005 | Delete Member | Xóa member (soft delete) | P1 | Admin |
| FR-D006 | Lock/Unlock Member | Khóa/Mở khóa member (lý do, thời gian) | P0 | Admin |
| FR-D007 | KYC Submit | Member upload giấy tờ (CMND/CCCD) | P0 | Member |
| FR-D008 | KYC Review | Admin xét duyệt KYC (approve/reject + lý do) | P0 | Admin, Staff |
| FR-D009 | Member Search | Tìm kiếm member (name, phone, email, ID, referral) | P0 | Admin, Staff |
| FR-D010 | Member Import | Import members từ CSV/Excel | P1 | Admin |
| FR-D011 | Member Export | Export danh sách members ra CSV/Excel | P1 | Admin |
| FR-D012 | Bulk Member Action | Bulk: lock, unlock, assign tier, send notification | P1 | Admin |
| FR-D013 | Member Activity Timeline | Xem timeline hoạt động của member | P1 | Admin, Member |
| FR-D014 | Member Merge | Gộp 2 member trùng nhau | P2 | Admin |
| FR-D015 | Member Tags | Gán tags cho member (phân loại) | P2 | Admin |

### Module E: Tier Management

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-E001 | Create Tier | Tạo hạng thành viên (tên, icon, benefits) | P0 | Admin |
| FR-E002 | List Tiers | Danh sách tiers | P0 | All |
| FR-E003 | Update Tier | Cập nhật thông tin tier | P0 | Admin |
| FR-E004 | Delete Tier | Xóa tier (nếu không có member nào đang ở hạng đó) | P1 | Admin |
| FR-E005 | Tier Rules | Định nghĩa luật lên hạng (doanh số, giao dịch, điểm, năm) | P0 | Admin |
| FR-E006 | Tier Benefits | Cấu hình quyền lợi từng hạng (multiplier, discounts) | P0 | Admin |
| FR-E007 | Auto Upgrade | Tự động nâng hạng khi member đủ điều kiện (batch job) | P0 | Auto |
| FR-E008 | Auto Downgrade | Tự động xuống hạng nếu không duy trì (batch job) | P1 | Auto |
| FR-E009 | Tier Progress | Member xem tiến độ lên hạng (current vs next) | P0 | Member |
| FR-E010 | Tier Notification | Gửi notification khi member lên/xuống hạng | P1 | Auto |
| FR-E011 | Tier History | Lịch sử thay đổi hạng của member | P1 | Admin, Member |

### Module F: Loyalty Point Service

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-F001 | Get Point Wallet | Xem ví điểm (balance, available, pending, expired) | P0 | Admin, Member |
| FR-F002 | Earn Points | Tích điểm (auto từ order, manual từ admin) | P0 | Auto, Admin |
| FR-F003 | Burn Points | Tiêu điểm (redeem reward, discount) | P0 | Auto, Member |
| FR-F004 | List Transactions | Lịch sử giao dịch điểm (filter: earn/burn, date range) | P0 | Admin, Member |
| FR-F005 | Point Expiration | Điểm hết hạn (configurable expiry policy) | P0 | Auto |
| FR-F006 | Point Expiry Notification | Thông báo sắp hết hạn | P1 | Auto |
| FR-F007 | Manual Adjustment | Admin cộng/trừ điểm thủ công (có lý do) | P0 | Admin |
| FR-F008 | Point Hold | Tạm giữ điểm (khi order pending) | P1 | Auto |
| FR-F009 | Point Release | Giải phóng điểm (khi order cancelled) | P1 | Auto |
| FR-F010 | Point Transfer | Chuyển điểm giữa các members | P2 | Member |
| FR-F011 | Point Reverse | Hoàn điểm (khi refund/return) | P1 | Auto |
| FR-F012 | Multi-currency Points | Hỗ trợ nhiều loại điểm (loyalty, cashback, promo) | P2 | Admin |
| FR-F013 | Point Analytics | Thống kê điểm (earn/burn rate, avg balance) | P1 | Admin |

### Module G: Campaign Management

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-G001 | Create Campaign | Tạo campaign (name, type, date range, budget) | P0 | Admin |
| FR-G002 | List Campaigns | Danh sách campaigns (search, filter: status, date, type) | P0 | Admin |
| FR-G003 | Get Campaign Detail | Chi tiết campaign (rules, budget, KPIs, performance) | P0 | Admin |
| FR-G004 | Update Campaign | Cập nhật campaign | P0 | Admin |
| FR-G005 | Delete Campaign | Xóa campaign (soft delete) | P1 | Admin |
| FR-G006 | Campaign Rules | Định nghĩa rules (target audience, earn multiplier) | P0 | Admin |
| FR-G007 | Campaign Target | Chọn đối tượng (tiers, segments, specific members) | P0 | Admin |
| FR-G008 | Campaign Budget | Cấu hình ngân sách (max points, max members) | P0 | Admin |
| FR-G009 | Campaign Status | Kích hoạt/tạm dừng/kết thúc campaign | P0 | Admin |
| FR-G010 | Campaign Analytics | KPIs: members joined, points earned, redemption | P0 | Admin |
| FR-G011 | Campaign Schedule | Lên lịch campaign (start/end, recurring) | P1 | Admin |
| FR-G012 | Campaign Approval | Admin duyệt campaign trước khi kích hoạt | P2 | Admin |
| FR-G013 | Campaign Notification | Gửi thông báo campaign đến target audience | P1 | Auto |
| FR-G014 | Campaign Duplicate | Nhân bản campaign (tiết kiệm thời gian) | P1 | Admin |
| FR-G015 | Campaign A/B Test | Chạy A/B test campaign | P2 | Admin |

### Module H: Reward Catalog

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-H001 | Create Reward | Tạo reward (name, description, points cost, image, quantity) | P0 | Admin |
| FR-H002 | List Rewards | Danh sách rewards (search, filter: type, stock) | P0 | Admin, Member |
| FR-H003 | Get Reward Detail | Chi tiết reward | P0 | All |
| FR-H004 | Update Reward | Cập nhật reward | P0 | Admin |
| FR-H005 | Delete Reward | Xóa reward (soft delete, check inventory) | P1 | Admin |
| FR-H006 | Inventory Management | Quản lý tồn kho (quantity, low stock alert) | P0 | Admin |
| FR-H007 | Reward Categories | Phân loại reward (voucher, gift, cashback, service) | P1 | Admin |
| FR-H008 | Reward Images | Upload nhiều ảnh cho reward | P1 | Admin |
| FR-H009 | Reward Sorting | Sắp xếp thứ tự hiển thị | P1 | Admin |
| FR-H010 | Featured Rewards | Đánh dấu reward nổi bật | P1 | Admin |
| FR-H011 | Reward Bulk Import | Import rewards từ Excel | P2 | Admin |

### Module I: Redemption Workflow

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-I001 | Redeem Reward | Member đổi reward (tiêu điểm) | P0 | Member |
| FR-I002 | List Redemption Orders | Danh sách orders (filter: status, date, member) | P0 | Admin, Member |
| FR-I003 | Get Order Detail | Chi tiết order (items, status, delivery) | P0 | Admin, Member |
| FR-I004 | Approve Redemption | Duyệt đơn đổi thưởng | P0 | Admin, Staff |
| FR-I005 | Reject Redemption | Từ chối đơn + lý do (hoàn điểm) | P0 | Admin, Staff |
| FR-I006 | Cancel Order | Hủy đơn (hoàn điểm) | P1 | Admin, Member |
| FR-I007 | Update Delivery Status | Cập nhật trạng thái giao hàng | P0 | Admin, Staff |
| FR-I008 | Auto Approve | Tự động duyệt (nếu reward là digital) | P1 | Auto |
| FR-I009 | Redemption Limit | Giới hạn số lần đổi/ngày/tháng theo tier | P1 | Admin |
| FR-I010 | Redemption Notification | Gửi thông báo khi đơn được duyệt/giao | P1 | Auto |
| FR-I011 | Partial Redemption | Đổi một phần reward (nếu có variants) | P2 | Member |

### Module J: Referral Program

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-J001 | Generate Referral Code | Tạo mã giới thiệu cho member | P0 | Member |
| FR-J002 | Generate Referral Link | Tạo link giới thiệu (có tracking params) | P0 | Member |
| FR-J003 | Generate QR Referral | Tạo QR code giới thiệu | P1 | Member |
| FR-J004 | Register Referral | Ghi nhận referral khi người mới đăng ký | P0 | Auto |
| FR-J005 | Track Conversion | Theo dõi chuyển đổi (registered → purchased) | P0 | Auto |
| FR-J006 | Award Referral Reward | Tự động thưởng khi đủ điều kiện | P0 | Auto |
| FR-J007 | Referral Dashboard | Thống kê: clicks, conversions, rewards earned | P0 | Member |
| FR-J008 | Referral Leaderboard | Bảng xếp hạng giới thiệu | P1 | Member |
| FR-J009 | Referral Rules | Cấu hình luật thưởng (fixed points, % of purchase) | P0 | Admin |
| FR-J010 | Multi-level Referral | Giới thiệu đa cấp (F1, F2) | P2 | Admin |
| FR-J011 | Referral Expiry | Mã giới thiệu hết hạn (nếu config) | P1 | Auto |
| FR-J012 | Referral Fraud Detection | Phát hiện gian lận giới thiệu | P1 | Auto |

### Module K: Voucher Management

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-K001 | Create Voucher Series | Tạo series voucher (type, value, quantity, expiry) | P0 | Admin |
| FR-K002 | List Voucher Series | Danh sách voucher series | P0 | Admin |
| FR-K003 | Update Voucher Series | Cập nhật series | P0 | Admin |
| FR-K004 | Delete Voucher Series | Xóa series (kiểm tra đã phát hành chưa) | P1 | Admin |
| FR-K005 | Generate Vouchers | Sinh mã voucher hàng loạt | P0 | Admin |
| FR-K006 | Claim Voucher | Member nhận voucher | P0 | Member |
| FR-K007 | Redeem Voucher | Member sử dụng voucher | P0 | Member |
| FR-K008 | Validate Voucher | Kiểm tra voucher hợp lệ (code, expiry, usage) | P0 | Staff, Auto |
| FR-K009 | Expire Vouchers | Tự động hết hạn voucher | P0 | Auto |
| FR-K010 | Voucher Pool | Pool voucher cho campaign (claim đến khi hết) | P1 | Admin |
| FR-K011 | Voucher Restrictions | Giới hạn: min order, category, product, user tier | P1 | Admin |
| FR-K012 | Voucher Analytics | Thống kê sử dụng voucher | P1 | Admin |
| FR-K013 | Bulk Voucher Action | Bulk: extend expiry, cancel, resend | P2 | Admin |

### Module L: Promotion Engine (Rule Builder)

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-L001 | Create Promotion Rule | Tạo rule (name, description, priority) | P0 | Admin |
| FR-L002 | List Promotion Rules | Danh sách rules, sắp xếp theo priority | P0 | Admin |
| FR-L003 | Update Promotion Rule | Cập nhật rule | P0 | Admin |
| FR-L004 | Delete Promotion Rule | Xóa rule | P1 | Admin |
| FR-L005 | Add Condition | Thêm condition (IF: customer, product, points, etc.) | P0 | Admin |
| FR-L006 | Add Action | Thêm action (THEN: earn X points, discount Y%, etc.) | P0 | Admin |
| FR-L007 | Reorder Priority | Kéo/thả sắp xếp thứ tự ưu tiên rules | P0 | Admin |
| FR-L008 | Version History | Lưu lịch sử thay đổi rules | P1 | Admin |
| FR-L009 | Rollback Rule | Khôi phục version cũ | P2 | Admin |
| FR-L010 | Test Rule | Test rule với member ảo | P1 | Admin |
| FR-L011 | Rule Schedule | Lên lịch kích hoạt rule (date range, recurring) | P1 | Admin |
| FR-L012 | Rule Analytics | Thống kê số lần rule được kích hoạt | P1 | Admin |
| FR-L013 | Rule Template | Lưu rule làm template dùng lại | P2 | Admin |

### Module M: Gamification

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-M001 | Create Badge | Tạo badge (name, icon, criteria, tier) | P0 | Admin |
| FR-M002 | List Badges | Danh sách badges | P0 | All |
| FR-M003 | Update Badge | Cập nhật badge | P0 | Admin |
| FR-M004 | Delete Badge | Xóa badge | P1 | Admin |
| FR-M005 | Award Badge | Tự động trao badge khi đủ điều kiện | P0 | Auto |
| FR-M006 | Create Mission | Tạo mission (mô tả, điều kiện, rewards) | P0 | Admin |
| FR-M007 | List Missions | Danh sách missions (active, completed) | P0 | All |
| FR-M008 | Update Mission | Cập nhật mission | P0 | Admin |
| FR-M009 | Delete Mission | Xóa mission | P1 | Admin |
| FR-M010 | Mission Progress | Theo dõi tiến độ mission | P0 | Member |
| FR-M011 | Claim Mission Reward | Nhận thưởng sau khi hoàn thành mission | P0 | Member |
| FR-M012 | Leaderboard | Bảng xếp hạng (points, referrals, purchases) | P1 | Member |
| FR-M013 | Achievement Unlock Notification | Thông báo khi đạt achievement mới | P1 | Auto |
| FR-M014 | Badge Display | Hiển thị badge trên profile member | P1 | Member |
| FR-M015 | Mission Time Limit | Mission có thời hạn | P1 | Admin |

### Module N: Notification Service

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-N001 | Send Email | Gửi email (transactional, marketing) | P0 | Auto, Admin |
| FR-N002 | Send SMS | Gửi SMS OTP, thông báo | P0 | Auto |
| FR-N003 | Push Notification | Gửi push notification (Web, Mobile) | P1 | Auto |
| FR-N004 | Zalo OA | Gửi Zalo Official Account message | P2 | Auto |
| FR-N005 | Create Template | Tạo template (email/SMS) với variables | P0 | Admin |
| FR-N006 | List Templates | Danh sách templates | P0 | Admin |
| FR-N007 | Update Template | Cập nhật template | P0 | Admin |
| FR-N008 | Delete Template | Xóa template | P1 | Admin |
| FR-N009 | Test Template | Gửi test template đến email admin | P1 | Admin |
| FR-N010 | Notification History | Lịch sử gửi (status, error) | P0 | Admin |
| FR-N011 | Channel Config | Cấu hình SMTP, SMS gateway, Zalo credentials | P0 | Admin |
| FR-N012 | Notification Preferences | Member chọn loại notification muốn nhận | P1 | Member |
| FR-N013 | Scheduled Notification | Gửi notification theo lịch | P1 | Admin |
| FR-N014 | Batch Notification | Gửi notification hàng loạt cho segment | P1 | Admin |
| FR-N015 | Webhook Notification | Gửi notification qua webhook | P2 | Admin |

### Module O: Analytics & Dashboard

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-O001 | Host Dashboard | Tổng quan: total tenants, total members, platform revenue | P0 | Host |
| FR-O002 | Tenant Dashboard | KPIs: active members, points earned/burned, campaigns running | P0 | Admin |
| FR-O003 | Member Analytics | Demographics, growth trend, cohort analysis | P1 | Admin |
| FR-O004 | Point Analytics | Earn/burn rate, avg balance, expiry forecast | P1 | Admin |
| FR-O005 | Campaign Analytics | ROI, members joined, conversion rate | P1 | Admin |
| FR-O006 | Referral Analytics | Conversion rate, top referrers, channel performance | P1 | Admin |
| FR-O007 | Voucher Analytics | Usage rate, redemption rate, popular vouchers | P1 | Admin |
| FR-O008 | Retention Report | Retention rate, churn rate, re-engagement opportunities | P1 | Admin |
| FR-O009 | LTV Report | Customer lifetime value by tier, cohort, segment | P1 | Admin |
| FR-O010 | Export Reports | Export tất cả reports ra CSV/PDF | P1 | Admin |
| FR-O011 | Scheduled Reports | Gửi report định kỳ qua email | P2 | Admin |
| FR-O012 | Custom Dashboard | Kéo/thả tạo dashboard tùy chỉnh | P2 | Admin |

### Module P: Customer 360 Service

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-P001 | Unified Profile | Hợp nhất: membership, points, vouchers, orders, referrals | P0 | Admin, Staff |
| FR-P002 | Activity Timeline | Timeline: tất cả activities của member | P0 | Admin, Staff |
| FR-P003 | Customer Summary | Tóm tắt: total spent, total points, tier, LTV | P0 | Admin, Staff |
| FR-P004 | Customer Segmentation | Phân khúc member dựa trên behaviors (RFM) | P1 | Admin |
| FR-P005 | RFM Analysis | Recency, Frequency, Monetary scoring | P1 | Admin |

### Module Q: Product & Order System

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-Q001 | Create Product | Tạo sản phẩm/dịch vụ | P0 | Admin |
| FR-Q002 | List Products | Danh sách sản phẩm | P0 | All |
| FR-Q003 | Update Product | Cập nhật sản phẩm | P0 | Admin |
| FR-Q004 | Delete Product | Xóa sản phẩm (soft delete) | P1 | Admin |
| FR-Q005 | Product Categories | Quản lý danh mục sản phẩm | P0 | Admin |
| FR-Q006 | Create Order | Tạo đơn hàng (từ POS, web, mobile) | P0 | Staff, Member |
| FR-Q007 | List Orders | Danh sách đơn hàng | P0 | Admin, Member |
| FR-Q008 | Order Status Flow | Cập nhật trạng thái đơn (PENDING→CONFIRMED→PROCESSING→SHIPPED→DELIVERED) | P0 | Staff, Auto |
| FR-Q009 | Cancel Order | Hủy đơn (hoàn điểm/coupon) | P1 | Staff, Member |
| FR-Q010 | Auto Earn Points | Tự động tích điểm khi đơn DELIVERED | P0 | Auto |
| FR-Q011 | Apply Coupon | Áp mã giảm giá cho đơn hàng | P0 | Member |
| FR-Q012 | Order Timeline | Lịch sử thay đổi trạng thái đơn | P1 | All |

### Module R: Coupon Engine

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-R001 | Create Coupon | Tạo coupon (code, type, value, conditions) | P0 | Admin |
| FR-R002 | List Coupons | Danh sách coupons | P0 | Admin |
| FR-R003 | Update Coupon | Cập nhật coupon | P0 | Admin |
| FR-R004 | Delete Coupon | Xóa coupon | P1 | Admin |
| FR-R005 | Validate Coupon | Kiểm tra coupon hợp lệ | P0 | System |
| FR-R006 | Apply Coupon | Áp coupon vào order (giảm giá) | P0 | System |
| FR-R007 | Coupon Usage Tracking | Theo dõi số lần sử dụng | P0 | Auto |

### Module S: Cashback

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-S001 | Cashback Config | Cấu hình tỷ lệ cashback | P2 | Admin |
| FR-S002 | Cashback Wallet | Ví cashback riêng cho member | P2 | Member |
| FR-S003 | Earn Cashback | Tích cashback từ giao dịch | P2 | Auto |
| FR-S004 | Withdraw Cashback | Rút tiền cashback (về tài khoản ngân hàng) | P2 | Member |
| FR-S005 | Cashback History | Lịch sử cashback | P2 | Member |

### Module T: Partner & Webhook

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-T001 | Partner Brand Mgmt | Quản lý thương hiệu đối tác | P2 | Admin |
| FR-T002 | Partner Reward | Tạo reward từ đối tác | P2 | Admin |
| FR-T003 | Webhook Endpoint | Đăng ký webhook để nhận event | P2 | Admin |
| FR-T004 | Webhook Event Log | Log tất cả webhook events | P2 | Admin |
| FR-T005 | Webhook Retry | Tự động retry khi webhook fail | P2 | Auto |

### Module U: Check-in & Event

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-U001 | Daily Check-in | Check-in hàng ngày, nhận điểm | P1 | Member |
| FR-U002 | Streak Tracking | Theo dõi chuỗi ngày check-in liên tiếp | P1 | Auto |
| FR-U003 | QR Check-in | Check-in bằng QR code tại sự kiện/showroom | P1 | Member |
| FR-U004 | Event Management | Quản lý sự kiện (workshop, seminar) | P2 | Admin |
| FR-U005 | Event Registration | Đăng ký tham gia sự kiện | P2 | Member |
| FR-U006 | Attendance Tracking | Điểm danh tham dự | P2 | Auto |

### Module V: Settings & System

| ID | Tên | Mô tả | Priority | Actor |
|---|---|---|---|---|
| FR-V001 | Tenant Settings | Cấu hình tenant (branding, domain, locale) | P0 | Admin |
| FR-V002 | API Key Management | Quản lý API keys cho tích hợp bên thứ 3 | P1 | Admin |
| FR-V003 | Audit Log | Xem lịch sử hành động của admin/staff | P0 | Admin |
| FR-V004 | Upload Management | Upload/delete files (images, documents) | P0 | All |
| FR-V005 | Import | Import dữ liệu từ file (members, products, rewards) | P1 | Admin |
| FR-V006 | Export | Export dữ liệu ra file (report, members, transactions) | P1 | Admin |

---

## 2.2 Non-Functional Requirements (NFR)

### Security (NFR-SEC)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-SEC-01 | JWT Authentication | Tất cả API (trừ public) phải xác thực JWT | P0 |
| NFR-SEC-02 | Password Hashing | bcrypt 12 rounds cho tất cả passwords | P0 |
| NFR-SEC-03 | RBAC | Role-based access control (Host, Admin, Staff, Member) | P0 |
| NFR-SEC-04 | Data Isolation | Tenant không thể truy cập dữ liệu tenant khác | P0 |
| NFR-SEC-05 | Rate Limiting | 60 requests/minute/user; 10 requests/minute cho auth endpoints | P0 |
| NFR-SEC-06 | CORS | Whitelist origins cho mỗi tenant | P0 |
| NFR-SEC-07 | Helmet | HTTP headers security (XSS, clickjacking, etc.) | P0 |
| NFR-SEC-08 | Input Validation | class-validator cho tất cả DTOs | P0 |
| NFR-SEC-09 | SQL Injection | Prisma ORM (parameterized queries) | P0 |
| NFR-SEC-10 | XSS Protection | Sanitize HTML input | P1 |
| NFR-SEC-11 | CSRF Protection | Double-submit cookie pattern | P1 |
| NFR-SEC-12 | Audit Trail | Log tất cả hành động CRUD quan trọng | P0 |
| NFR-SEC-13 | PII Encryption | Mã hóa PII fields (phone, email, CMND) ở DB level | P1 |
| NFR-SEC-14 | API Key Auth | Cho phép third-party systems dùng API key | P1 |
| NFR-SEC-15 | Session Management | Refresh token rotation, secure cookie | P1 |
| NFR-SEC-16 | File Upload Validation | Validate file type, size (max 10MB), scan virus | P1 |
| NFR-SEC-17 | Keycloak Integration | SSO với Keycloak cho admin users | P2 |

### Performance (NFR-PERF)

| ID | Yêu cầu | Target | Priority |
|---|---|---|---|
| NFR-PERF-01 | API Response Time (p95) | < 500ms | P0 |
| NFR-PERF-02 | API Response Time (p99) | < 2s | P0 |
| NFR-PERF-03 | Concurrent Users | 1,000 concurrent / tenant | P1 |
| NFR-PERF-04 | Page Load Time (Web) | < 2s (FCP), < 3s (LCP) | P0 |
| NFR-PERF-05 | Mobile App Startup | < 3s | P0 |
| NFR-PERF-06 | Database Query Time (p95) | < 100ms | P0 |
| NFR-PERF-07 | Cache Hit Ratio | > 80% | P1 |
| NFR-PERF-08 | Batch Job Duration | < 30 phút cho 100K members | P1 |

### Scalability (NFR-SCAL)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-SCAL-01 | Horizontal Scaling | Microservices có thể scale độc lập | P0 |
| NFR-SCAL-02 | Database Per Service | Mỗi service có database riêng (SaaS isolation) | P0 |
| NFR-SCAL-03 | Stateless API | Không lưu state trên server (scale out) | P0 |
| NFR-SCAL-04 | Async Processing | Job queue (Bull/Redis) cho tasks nặng | P1 |
| NFR-SCAL-05 | Event-driven | Kafka event bus cho inter-service communication | P1 |

### Availability (NFR-AVAIL)

| ID | Yêu cầu | Target | Priority |
|---|---|---|---|
| NFR-AVAIL-01 | Uptime SLA | 99.9% (8.76h downtime/năm) | P0 |
| NFR-AVAIL-02 | Maintenance Window | Tối đa 4h/tháng, thông báo 48h trước | P1 |
| NFR-AVAIL-03 | Disaster Recovery | RTO < 4h, RPO < 1h | P1 |
| NFR-AVAIL-04 | Graceful Degradation | Tính năng không critical vẫn hoạt động khi service khác down | P1 |

### Data & Consistency (NFR-DATA)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-DATA-01 | Audit Log | Lưu tất cả thay đổi dữ liệu quan trọng | P0 |
| NFR-DATA-02 | Soft Delete | Không xóa cứng dữ liệu (deletedAt flag) | P0 |
| NFR-DATA-03 | Data Backup | Backup tự động mỗi 6h | P1 |
| NFR-DATA-04 | Data Retention | Giữ dữ liệu 7 năm (theo luật) | P1 |
| NFR-DATA-05 | GDPR Compliance | Member có quyền yêu cầu xóa dữ liệu | P2 |

### Monitoring & Observability (NFR-MON)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-MON-01 | Health Check | Tất cả services có endpoint /health | P0 |
| NFR-MON-02 | Metrics | Prometheus metrics (request count, latency, errors) | P1 |
| NFR-MON-03 | Logging | Centralized logging (Elasticsearch) | P1 |
| NFR-MON-04 | Tracing | Distributed tracing (Jaeger) cho inter-service calls | P2 |
| NFR-MON-05 | Alerting | Grafana alerts (error rate >1%, latency >2s) | P1 |
| NFR-MON-06 | Dashboard | Grafana dashboard cho DevOps | P1 |

### Notification (NFR-NOTIF)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-NOTIF-01 | Email Delivery | Transactional email trong < 5 phút | P0 |
| NFR-NOTIF-02 | SMS Delivery | SMS OTP trong < 30 giây | P0 |
| NFR-NOTIF-03 | Push Notification | Push delivery trong < 1 phút | P1 |
| NFR-NOTIF-04 | Notification Retry | Retry 3 lần khi gửi thất bại | P1 |
| NFR-NOTIF-05 | Notification Queue | Queue-based sending (không block API) | P1 |

### Compliance (NFR-COMP)

| ID | Yêu cầu | Mô tả | Priority |
|---|---|---|---|
| NFR-COMP-01 | Data Privacy | Tuân thủ Luật An toàn thông tin & Bảo vệ dữ liệu cá nhân (Việt Nam) | P0 |
| NFR-COMP-02 | Financial Audit | Lưu log giao dịch điểm đủ để kiểm toán tài chính | P0 |
| NFR-COMP-03 | KYC Compliance | Lưu giấy tờ KYC theo quy định pháp luật | P1 |
| NFR-COMP-04 | Tax Reporting | Hỗ trợ xuất báo cáo thuế (nếu có giao dịch cashback) | P2 |

---

## 2.3 Requirements Traceability Matrix (RTM)

| Business Goal | FRs liên quan | NFRs liên quan |
|---|---|---|
| BG-01: Repeat Purchase | FR-D001-D015, FR-E001-E011, FR-F001-F013, FR-G001-G015 | NFR-PERF-01, NFR-SEC-12 |
| BG-02: Referral Rate | FR-J001-J012, FR-M001-M015 | NFR-PERF-01, NFR-DATA-01 |
| BG-03: Partner Retention | FR-B001-B011, FR-T001-T005 | NFR-AVAIL-01, NFR-SCAL-01 |
| BG-04: LTV | FR-O001-O012, FR-P001-P005 | NFR-DATA-04, NFR-COMP-01 |
| BG-05: Auto Marketing | FR-G006, FR-G013, FR-L001-L013 | NFR-PERF-08, NFR-MON-01 |
| BG-06: Data-driven | FR-O001-O012, FR-P004-P005 | NFR-MON-02, NFR-MON-06 |
| BG-07: SaaS Revenue | FR-B001-B011, FR-V001-V006 | NFR-SCAL-02, NFR-SEC-04 |
| BG-08: Reduce CAC | FR-J001-J012, FR-G001-G015, FR-M001-M015 | NFR-PERF-03, NFR-AVAIL-01 |
