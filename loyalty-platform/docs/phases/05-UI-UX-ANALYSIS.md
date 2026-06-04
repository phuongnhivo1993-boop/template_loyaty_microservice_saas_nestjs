# Phase 5: UI/UX Analysis

## 5.1 Admin Web (Next.js) — Completeness Analysis

### 5.1.1 List Pages Feature Matrix

| Page | Search | Filter | Sort | Pagination | Export | Refresh | Bulk Action | Create | Loading | Empty | Error |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tenants | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| Users | ✅ | ✅ (role) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| **Members** | ✅ | ✅ (tier, tag) | ❌ | ✅ | ✅ | ❌ | **✅ (3 ops)** | ✅ | ✅ | ✅ | ⚠️ |
| Tiers | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| **Campaigns** | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | **✅ (2 ops)** | ✅ | ✅ | ✅ | ⚠️ |
| **Rewards** | ✅ | ✅ (type) | ❌ | ✅ | ✅ | ❌ | **✅ (2 ops)** | ✅ | ✅ | ✅ | ⚠️ |
| **Vouchers** | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | **✅ (2 ops)** | ✅ | ✅ | ✅ | ⚠️ |
| Promotions | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Referrals | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ⚠️ |
| Badges | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| Missions | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ⚠️ |
| Products | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | **✅ (3 ops)** | ✅ | ✅ | ✅ | ⚠️ |
| Orders | ✅ | ✅ (status) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ⚠️ |
| Notifications | ✅ | ✅ (type) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Audit Log | ✅ | ✅ (entity,action) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ⚠️ |

### 5.1.2 UI/UX Gaps Identified

| Gap | Severity | Mô tả | Fix |
|---|---|---|---|
| **Missing Sort** | **HIGH** | Không list page nào có sort | Thêm clickable column headers |
| **Missing Refresh** | **MEDIUM** | Không có nút refresh trên list pages | Thêm Refresh button |
| **Inconsistent Error Handling** | **HIGH** | Nhiều page dùng `.catch(() => {})` | Chuẩn hóa error toast |
| **No Row Actions (inline)** | **MEDIUM** | Edit/Delete thường ở detail page | Thêm action column |
| **No Bulk on all pages** | **LOW** | Chỉ members/campaigns/rewards/vouchers/products có bulk | Thêm bulk actions cho tất cả |
| **No Statistics Cards** | **LOW** | Chỉ referrals và campaigns có stats cards | Thêm summary cards cho list pages |

### 5.1.3 Detail Pages Feature Matrix

| Page | Overview | Related Data | Activity Log | Timeline | Actions |
|---|---|---|---|---|---|
| Tenant Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| User Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| **Member Detail** | **✅** | **✅ (transactions, referrals, redemptions)** | **✅ (Timeline)** | ✅ | Lock/Unlock, KYC, Points |
| Tier Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Campaign Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Reward Detail | ✅ | ✅ (redemptions, inventory) | ❌ | ❌ | Edit, Delete |
| Voucher Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Promotion Detail | ✅ | ❌ | ❌ | ❌ | Edit |
| Referral Detail | ✅ | ✅ (referrer, referee) | ❌ | ❌ | Convert |
| Badge Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Mission Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Product Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| **Order Detail** | **✅** | **✅ (items)** | **✅ (Status Timeline)** | **✅** | Update Status |
| Notification Detail | ✅ | ❌ | ❌ | ❌ | Edit, Delete |
| Audit Log Detail | ✅ | ❌ | ❌ | ❌ | ❌ |

### 5.1.4 Detail Page Gaps

| Gap | Severity | Mô tả |
|---|---|---|
| **No Related Data on most details** | **HIGH** | Chỉ Member/Order/Reward có related data |
| **No Activity Log on details** | **MEDIUM** | Chỉ Member có activity timeline |
| **No inline Edit** | **MEDIUM** | Hầu hết phải navigate về list để edit |
| **No Delete Confirmation** | **LOW** | Thiếu confirmation dialog nhất quán |

### 5.1.5 Create/Edit Form Analysis

| Feature | Hiện tại | Khuyến nghị |
|---|---|---|
| Form Validation | ✅ Có (required fields) | Bổ sung real-time validation |
| Error Display | ✅ Toast notifications | Bổ sung inline field errors |
| Draft Save | ❌ | Auto-save form khi nhập |
| Auto Save | ❌ | Chưa có |
| Loading State | ✅ Submit button spinner | OK |
| Success Feedback | ✅ Toast + redirect | OK |
| Confirm Before Leave | ❌ | Cảnh báo khi rời form có dữ liệu chưa save |

---

## 5.2 Mobile App (React Native) — Completeness Analysis

### 5.2.1 Mobile Screen Matrix

| Screen | Loading | Empty | Error | Pull-to-refresh | Offline | Form Validation |
|---|---|---|---|---|---|---|
| Home | ✅ | ⚠️ | ✅ | ✅ | ❌ | N/A |
| Login | ⚠️ | N/A | ✅ (Alert) | ❌ | ❌ | Basic |
| Register | ✅ | N/A | ✅ (Alert) | ❌ | ❌ | Basic |
| Wallet | ✅ | ✅ | ✅ | ✅ | ❌ | N/A |
| Rewards | ✅ | ✅ | ✅ | ✅ | ❌ | Search basic |
| Reward Detail | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| Vouchers | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| Voucher Detail | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| **Orders** | **❌** | **❌** | **❌** | **❌** | **❌** | **❌ File không tồn tại** |
| Points History | ✅ | ✅ | ✅ | ✅ | ❌ | N/A |
| Referrals | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| Badges | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| Missions | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |
| Profile | ⚠️ | N/A | ✅ (Alert) | ❌ | ❌ | Basic |
| Membership Card | ✅ | N/A | ✅ | ❌ | ❌ | N/A |
| Tier Progress | ⚠️ | N/A | ❌ | ❌ | ❌ | N/A |
| KYC Upload | ✅ | ✅ (verified) | ✅ (Alert) | ❌ | ❌ | Required |
| Check-in | ✅ | N/A | ✅ | ✅ | ❌ | N/A |
| Stores | ✅ | ✅ | ✅ | ✅ | ❌ | N/A |
| Feedback | ✅ | ✅ | ✅ | ✅ | ❌ | Star rating |
| QR Scanner | ✅ | N/A | ✅ | ❌ | ❌ | N/A |
| Notifications | ✅ | ✅ | ✅ | ❌ | ❌ | N/A |

### 5.2.2 Mobile UX Gaps

| Gap | Severity | Mô tả |
|---|---|---|
| **OrdersScreen không tồn tại** | **HIGH** | Member không xem được lịch sử đơn hàng |
| **Không có Tab Navigation** | **HIGH** | Chỉ có Stack, user phải back liên tục |
| **Không có Offline Support** | **HIGH** | 0/22 screens hỗ trợ offline |
| **QR Scanner chỉ là placeholder** | **MEDIUM** | Không có camera thật |
| **Không có Push Notification** | **HIGH** | Chưa integrate FCM/APNs |
| **Form Validation yếu** | **MEDIUM** | Chỉ check required, không có format validation |
| **Pull-to-refresh không nhất quán** | **MEDIUM** | Chỉ 8/22 screens có |
| **Không có Debounce Search** | **LOW** | Rewards search không debounce |
| **Navigation type safety** | **LOW** | Dùng `any` cho navigation types |
| **Missing Order/OrderDetail screens** | **HIGH** | Không có trong navigator |

### 5.2.3 Missing Mobile Features

| Tính năng | Status | Priority |
|---|---|---|
| **Push Notification (FCM/APNs)** | ❌ | P1 |
| **Camera (QR scanner thật)** | ❌ (placeholder) | P1 |
| **GPS (Stores near me)** | ❌ | P2 |
| **Biometric (Face ID/Touch ID)** | ❌ | P2 |
| **Deep Link** | ❌ | P2 |
| **Offline Mode** | ❌ (none) | P2 |
| **Tab Navigation** | ❌ (stack only) | P1 |
| **Order History Screen** | ❌ (missing) | P1 |
| **Settings Screen** | ✅ (exists) | OK |
| **Password Screen** | ✅ (exists) | OK |
| **Forgot/Reset Password** | ✅ (routing) | OK |

---

## 5.3 Web vs Mobile Feature Matrix

| Feature | Web (Admin) | Web (Member) | Mobile | Ghi chú |
|---|---|---|---|---|
| **Login** | ✅ | ✅ | ✅ | |
| **Register** | N/A | ✅ | ✅ | |
| **Forgot Password** | ❌ | ✅ | ✅ | Admin web thiếu |
| **Dashboard** | ✅ | ✅ | ✅ | |
| **Member List** | ✅ | N/A | N/A | |
| **Member Detail** | ✅ | N/A | N/A | |
| **My Profile** | N/A | ✅ | ✅ | |
| **My Wallet** | N/A | ✅ | ✅ | |
| **My Vouchers** | N/A | ✅ | ✅ | |
| **My Orders** | N/A | ✅ | **❌ (missing)** | |
| **My Referrals** | N/A | ✅ | ✅ | |
| **My Badges** | N/A | ✅ | ✅ | |
| **My Missions** | N/A | ✅ | ✅ | |
| **Reward Catalog** | N/A | ✅ | ✅ | |
| **Redemption** | ✅ (approve) | ✅ | ✅ | |
| **Campaign List** | ✅ | ✅ | ✅ (member-web) | Mobile có Campaign? Không |
| **Check-in** | N/A | ❌ | ✅ | Member web thiếu |
| **KYC Upload** | N/A | ❌ | ✅ | Member web thiếu |
| **QR Scanner** | N/A | N/A | ⚠️ | Placeholder |
| **Notification Center** | N/A | ✅ | ✅ | |
| **Stores** | ✅ | N/A | ✅ | |
| **Feedback** | ✅ | ✅ | ✅ | |
| **Customer 360** | ❌ | N/A | N/A | |
| **Cashback** | ✅ | ✅ | ✅ | |
| **Gift Cards** | ✅ | ❌ | ❌ | |

### 5.3.1 Feature Imbalance cần khắc phục

| Tính năng | Web Admin | Web Member | Mobile | Action |
|---|---|---|---|---|
| Forgot Password | ❌ | ✅ | ✅ | Thêm cho Admin Web |
| Check-in | N/A | ❌ | ✅ | Thêm cho Member Web |
| KYC Upload | N/A | ❌ | ✅ | Thêm cho Member Web |
| Campaign List | ✅ | ✅ | ❌ | Thêm cho Mobile |
| My Orders | N/A | ✅ | ❌ | Thêm cho Mobile |
| Gift Cards (my) | N/A | ❌ | ❌ | Thêm cho cả hai |
| Customer 360 | ❌ | N/A | N/A | Module mới |

---

## 5.4 UX Recommendations (Phase 2 Improvements)

### 5.4.1 Global UX Improvements

1. **Sort cho tất cả List Pages**
   - Column headers clickable → toggles ASC/DESC
   - Visual indicator (▲/▼) trên column đang sort

2. **Refresh Button**
   - Thêm nút reload trên tất cả list pages
   - Auto-refresh indicator khi có WebSocket event

3. **Bulk Actions cho tất cả List Pages**
   - Minimal: Delete, Export
   - Entity-specific: Lock/Unlock members, Activate/Deactivate

4. **Row Action Menus**
   - 3-dot menu trên mỗi row
   - Quick actions: Edit, Delete, View Detail

5. **Filter Enhancement**
   - Date range picker cho tất cả date fields
   - Multi-select filters
   - Saved filters cho power users

6. **Loading & Error State Standardization**
   - Skeleton loading cho tất cả pages
   - Error boundary
   - Retry button trên error state

### 5.4.2 Mobile UX Improvements

1. **Tab Navigation**
   - Bottom tabs: Home, Rewards, Vouchers, Profile, More
   - Quick access to key features

2. **Push Notifications**
   - FCM/APNs integration
   - Local notifications (reminders, expiry)
   - Notification preferences

3. **Camera Integration**
   - Real QR scanner (expo-camera / expo-barcode-scanner)
   - KYC: scan CMND/CCCD tự động

4. **Offline Support**
   - Cache API responses (AsyncStorage)
   - Offline queue for critical actions (check-in)
   - Sync when online

5. **Biometric Authentication**
   - Face ID / Fingerprint để mở app
   - Không cần nhập password thường xuyên
