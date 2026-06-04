# Phase 1: Product Analysis — Loyalty Platform

## 1.1 Business Context

### Ecosystem
Hệ thống Loyalty Platform được xây dựng trong **hệ sinh thái Bất động sản** (Real Estate). Không chỉ đơn thuần là "tích điểm đổi quà", Loyalty Platform là **nền tảng quản lý và thúc đẩy quan hệ** với tất cả stakeholders trong hệ sinh thái BĐS.

### 1.1.1 Business Goals (BG)

| ID | Business Goal | Mục tiêu đo lường (KPI) |
|---|---|---|
| BG-01 | **Tăng tỷ lệ mua lại (Repeat Purchase Rate)** | Từ 15% lên 40% trong 12 tháng |
| BG-02 | **Tăng tỷ lệ giới thiệu khách hàng (Referral Rate)** | 30% khách hàng mới từ referral |
| BG-03 | **Giữ chân đối tác & môi giới (Partner Retention)** | Giảm churn rate đối tác xuống <10%/năm |
| BG-04 | **Tăng Customer Lifetime Value (LTV)** | Tăng LTV trung bình 2x trong 18 tháng |
| BG-05 | **Tự động hóa Marketing** | 80% campaign được tự động kích hoạt |
| BG-06 | **Data-driven Decision Making** | 100% campaign có analytics dashboard |
| BG-07 | **Multi-Tenant SaaS Revenue** | 50+ tenant trong năm đầu, ARR $500K+ |
| BG-08 | **Giảm chi phí thu hút khách hàng (CAC)** | Giảm CAC 40% qua referral & loyalty |

### 1.1.2 Problem Statement

| Vấn đề | Tác động | Giải pháp Loyalty |
|---|---|---|
| Khách hàng mua BĐS 1 lần rồi biến mất | Mất doanh thu tái mua | Membership + Tier + Points khuyến khích quay lại |
| Môi giới không có động lực giới thiệu | Mất kênh bán hàng hiệu quả | Referral Program + Gamification + Hoa hồng điểm |
| Đối tác phân phối không gắn bó | Mất kênh distribution | Partner Loyalty + Co-branded Campaign |
| Dữ liệu khách hàng phân tán | Không có 360 view | Customer 360 Service |
| Marketing thiếu cá nhân hóa | Campaign ROI thấp | Segmentation (RFM) + Rule Engine |
| Không đo lường được hiệu quả loyalty | Không biết cái gì hiệu quả | Analytics + Dashboard |

## 1.2 User Personas

### Persona 1: Host (Platform Owner)
```
Name:      Nguyễn Văn A
Role:      CEO / Platform Owner
Tech:      Trung bình - Cao
Goal:      Vận hành nền tảng SaaS, onboard nhiều tenant
Pain:      Không có visibility xuyên suốt các tenant
Needs:     Dashboard tổng quan, quản lý tenant, billing, monitoring
Permissions: TOÀN BỘ hệ thống (cross-tenant)
```

### Persona 2: Tenant Admin (Chủ đầu tư)
```
Name:      Trần Thị B
Role:      Giám đốc Vận hành - CĐT Sunshine
Tech:      Trung bình
Goal:      Quản lý loyalty program cho dự án của mình
Pain:      Không biết chương trình nào đang hiệu quả
Needs:     Campaign management, member analytics, reward catalog
Permissions: Tenant-scoped (users, members, campaigns, rewards, vouchers...)
```

### Persona 3: Staff (Nhân viên văn phòng)
```
Name:      Lê Văn C
Role:      Nhân viên CSKH / Sales Support
Tech:      Cao
Goal:      Đăng ký hội viên, xử lý KYC, hỗ trợ đổi thưởng
Pain:      Quy trình thủ công, nhập liệu nhiều
Needs:     Member search, KYC review, redemption approval
Permissions: Member CRUD, KYC review, order processing
```

### Persona 4: Member (Khách hàng cá nhân)
```
Name:      Phạm Thị D
Role:      Khách mua BĐS / Khách hàng tiềm năng
Tech:      Cao (dùng mobile)
Goal:      Tích điểm, đổi quà, theo dõi hạng thành viên
Pain:      Không biết có bao nhiêu điểm, dùng thế nào
Needs:     Mobile app: wallet, vouchers, referral, QR check-in
Permissions: Self-service (profile, points, vouchers, orders, referrals)
```

### Persona 5: Broker (Môi giới)
```
Name:      Hoàng Văn E
Role:      Môi giới bất động sản tự do
Tech:      Cao
Goal:      Giới thiệu khách, nhận thưởng, leo rank
Pain:      Không track được hoa hồng giới thiệu
Needs:     Referral link, referral dashboard, withdrawal
Permissions: Referral management, leaderboard
```

### Persona 6: Partner (Đối tác / Đơn vị phân phối)
```
Name:      Công ty F
Role:      Đại lý phân phối / Sàn giao dịch
Tech:      Trung bình
Goal:      Hợp tác campaign, co-branded rewards
Pain:      Không tích hợp được với hệ thống của họ
Needs:     Webhook, API key, partner portal, co-branded vouchers
Permissions: Partner-branded rewards, webhook management
```

## 1.3 Stakeholder Map

```
                    ┌─────────────┐
                    │    HOST     │ (Platform Owner)
                    │  (SaaS Ops) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐  ┌──┴───┐  ┌────┴────┐
        │  Tenant   │  │Tenant│  │ Tenant  │ ...
        │  Admin 1  │  │Admin2│  │ Admin 3 │
        └─────┬─────┘  └──┬───┘  └────┬────┘
              │            │           │
        ┌─────┴─────┐     ...        ...
        │  Staff    │
        │ (CSKH)    │
        └─────┬─────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───┴───┐ ┌──┴───┐ ┌───┴───┐
│Member │ │Broker│ │Partner│
│(User) │ │(MG)  │ │(Dist) │
└───────┘ └──────┘ └───────┘
```

## 1.4 User Journey Map

### Member Journey
```
Khám phá → Đăng ký → KYC → Mua BĐS → Tích điểm → Lên hạng → Đổi thưởng → Giới thiệu → Tái mua
   |         |        |      |         |          |         |           |            |
   Web      App     Upload  POS/     Auto      Auto     Catalog    Referral    Campaign
   Landing          CMND    API     Earn     Upgrade       |        Link        |
                                         → Wallet     Redemption         → Reward
```

### Tenant Admin Journey
```
Đăng ký → Config → Tạo Tier → Tạo Campaign → Tạo Reward → Mời Member → Theo dõi → Export
Tenant    Branding  Rules     Rules &         Catalog     Import       Analytics  Report
                    Budget                                          Dashboard
```

## 1.5 Competitive Landscape

| Đối thủ | Điểm mạnh | Điểm yếu | Cạnh tranh của chúng ta |
|---|---|---|---|
| **LoyaltyLion** | E-commerce focus, mạnh analytics | Không hỗ trợ BĐS | Real-estate domain expertise |
| **Antavo** | Multi-tier, gamification tốt | Giá cao, không SaaS thuần | SaaS pricing, flexible |
| **TREVO** | BĐS focus, Việt Nam | UI cũ, ít tính năng | Modern UX, mobile-first |
| **Ví VNPAY** | Hệ sinh thái lớn | Không loyalty chuyên sâu | Deep loyalty engine |
| **Braze** | Customer engagement | Quá đắt, phức tạp | All-in-one loyalty |

## 1.6 Success Metrics

| KPI | Hiện tại | Mục tiêu (12 tháng) |
|---|---|---|
| Active Members / Tenant | 500 | 5,000 |
| Monthly Active Users (MAU) | N/A | 40% of total members |
| Member Retention Rate (6mo) | N/A | 65% |
| Referral Conversion Rate | N/A | 15% |
| Points Redemption Rate | N/A | 60% |
| Campaign ROI | N/A | 5x |
| NPS Score | N/A | 45+ |
| Tenant Onboarding Time | N/A | < 7 days |
| System Uptime (SLA) | N/A | 99.9% |
| API Response Time (p95) | N/A | < 500ms |

## 1.7 Module Prioritization (Value vs Effort)

```
Cao ▲
    │ ● Membership    ● Loyalty Point
    │ ● Referral      ● Campaign
    │
Value │ ● Reward        ● Voucher
    │ ● Promotion     ● Notification
    │
    │ ● Gamification  ● Customer 360
Thấp │ ● Analytics     ● Partner Loyalty
    └───────────────────────────►
       Thấp                Cao
               Effort
```

### Priority Matrix

| Priority | Module | Lý do |
|---|---|---|
| **P0 (Must Have)** | Membership, Loyalty Point, Campaign, Reward | Core loyalty loop |
| **P1 (Should Have)** | Referral, Voucher, Promotion, Notification | Engagement & growth |
| **P2 (Nice to Have)** | Gamification, Customer 360, Analytics | Differentiation & insight |
| **P3 (Future)** | Partner Loyalty, Cashback, Gift Card | Ecosystem expansion |
