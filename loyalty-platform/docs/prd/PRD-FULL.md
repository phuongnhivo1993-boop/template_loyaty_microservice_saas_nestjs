# Product Requirements Document (PRD) — Loyalty Platform

## 1. Product Overview

| Field | Value |
|---|---|
| **Product Name** | Loyalty Platform |
| **Type** | SaaS Multi-Tenant Loyalty Microservices |
| **Domain** | Real Estate Ecosystem (Bất động sản) |
| **Target Users** | Host, Tenant Admin, Staff, Member, Broker, Partner |
| **Tech Stack** | NestJS + Next.js + React Native + Prisma + PostgreSQL + Kafka + Redis |

## 2. Product Vision

Xây dựng nền tảng loyalty SaaS số 1 cho thị trường Bất động sản Việt Nam, giúp các chủ đầu tư (CĐT) tăng tỷ lệ mua lại, giới thiệu khách hàng và giữ chân đối tác thông qua hệ thống điểm thưởng, hội viên, và gamification.

## 3. Target Market

- **Primary**: Các chủ đầu tư bất động sản (CĐT)
- **Secondary**: Sàn giao dịch, môi giới, đại lý phân phối
- **Tertiary**: Retail, E-commerce, Dịch vụ (future expansion)

## 4. Key Metrics (OKRs)

| Objective | Key Result |
|---|---|
| Platform Adoption | 50+ tenants in Year 1 |
| Member Engagement | 40% MAU rate |
| Referral Growth | 30% new members from referral |
| Revenue | ARR $500K+ by end of Year 1 |
| Retention | Member 6-month retention > 65% |

## 5. Feature Roadmap

### Phase 1: Core (Month 1-2) ✅ ĐÃ CÓ
- Auth (Host, Tenant, Member)
- Member CRUD + KYC
- Tier Management
- Point Wallet (Earn/Burn)
- Campaign Management
- Reward Catalog + Redemption

### Phase 2: Growth (Month 2-3) ✅ ĐÃ CÓ
- Referral Program
- Voucher Management
- Promotion Engine
- Gamification (Badges, Missions)
- Product & Order System
- Coupon Engine

### Phase 3: Engagement (Month 3-4) ✅ ĐÃ CÓ
- Notification Service
- Daily Check-in
- Store Management
- Point Analytics Dashboard
- Member Segmentation (RFM)

### Phase 4: SaaS & Scale (Month 4-6) ⚠️ CẦN LÀM
- Multi-Tenant Subscription
- Billing Integration
- Feature Limits
- Customer 360 Service
- Event Bus (Kafka)

### Phase 5: Enterprise (Month 6-8) 🔮 KẾ HOẠCH
- Advanced Analytics (ClickHouse)
- Keycloak SSO
- White Label
- Custom Domain
- API Marketplace

## 6. Competitive Differentiation

| Factor | Our Platform | Competitors |
|---|---|---|
| **Real Estate Focus** | Deep domain (broker, CĐT, partner) | General purpose |
| **Multi-Tenant SaaS** | Native SaaS architecture | Mostly single-tenant |
| **Mobile First** | Full Expo mobile app | Web-only or limited mobile |
| **Rule Engine** | Advanced IF-THEN promotion builder | Basic fixed rules |
| **Gamification** | Badges + Missions + Leaderboard | Limited or none |
| **Customer 360** | Unified profile across all touchpoints | Siloed data |
| **Open Ecosystem** | Webhook + API keys | Closed platforms |
