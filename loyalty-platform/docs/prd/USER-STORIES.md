# User Stories

## Epic 1: Authentication & Onboarding

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| US-001 | As a **Host**, I want to **register an account** so that I can **manage the platform** | P0 | Email + password, JWT returned |
| US-002 | As a **Tenant Admin**, I want to **register my company** so that I can **start using loyalty features** | P0 | Subdomain + admin created |
| US-003 | As a **Member**, I want to **register with email/phone** so that I can **join the loyalty program** | P0 | OTP verification, wallet created |
| US-004 | As a **Member**, I want to **login with biometric** so that I can **access app quickly** | P2 | Face ID / Fingerprint |
| US-005 | As a **Member**, I want to **login with OTP** so that I can **login without password** | P1 | SMS OTP, 5-minute expiry |

## Epic 2: Membership

| ID | User Story | Priority |
|---|---|---|
| US-101 | As a **Staff**, I want to **create a member profile** so that I can **register customers at the counter** | P0 |
| US-102 | As a **Member**, I want to **upload my ID documents** so that I can **verify my identity** | P0 |
| US-103 | As a **Staff**, I want to **review KYC documents** so that I can **approve or reject members** | P0 |
| US-104 | As an **Admin**, I want to **lock a member** so that they **cannot use points until resolved** | P0 |
| US-105 | As an **Admin**, I want to **view member activity timeline** so that I can **understand their journey** | P1 |
| US-106 | As an **Admin**, I want to **bulk import members from CSV** so that I can **onboard existing customers** | P1 |
| US-107 | As an **Admin**, I want to **export members to CSV** so that I can **analyze in Excel** | P1 |
| US-108 | As an **Admin**, I want to **merge duplicate members** so that I can **clean up data** | P2 |

## Epic 3: Points & Tiers

| ID | User Story | Priority |
|---|---|---|
| US-201 | As a **Member**, I want to **see my point balance** so that I know **how many points I have** | P0 |
| US-202 | As a **Member**, I want to **earn points when I purchase** so that I **feel rewarded** | P0 |
| US-203 | As a **Member**, I want to **see my tier progress** so that I know **what benefits I'll get next** | P0 |
| US-204 | As an **Admin**, I want to **configure tier rules** so that **members are automatically upgraded** | P0 |
| US-205 | As an **Admin**, I want to **manually adjust member points** so that I can **handle exceptions** | P0 |
| US-206 | As a **Member**, I want to **receive notification when points will expire** so that I **don't lose them** | P1 |

## Epic 4: Rewards & Redemption

| ID | User Story | Priority |
|---|---|---|
| US-301 | As a **Member**, I want to **browse the reward catalog** so that I can **choose what to redeem** | P0 |
| US-302 | As a **Member**, I want to **redeem points for a reward** so that I **enjoy the benefits** | P0 |
| US-303 | As an **Admin**, I want to **approve physical reward orders** so that I can **control inventory** | P0 |
| US-304 | As an **Admin**, I want to **track reward inventory** so that I **know when to restock** | P1 |
| US-305 | As a **Member**, I want to **receive digital rewards instantly** so that I **don't have to wait** | P1 |
| US-306 | As a **Member**, I want to **track my order status** so that I **know when my reward arrives** | P1 |

## Epic 5: Referral Program

| ID | User Story | Priority |
|---|---|---|
| US-401 | As a **Member**, I want to **share my referral link** so that **friends can join and I earn points** | P0 |
| US-402 | As a **Member**, I want to **see my referral stats** so that I know **how many friends joined** | P0 |
| US-403 | As a **Referrer**, I want to **receive rewards when my referral purchases** so that **I'm incentivized** | P0 |
| US-404 | As a **Broker**, I want to **see my referral leaderboard** so that I can **compete with others** | P1 |
| US-405 | As an **Admin**, I want to **configure referral rewards** so that I can **control program costs** | P1 |

## Epic 6: Campaigns & Promotions

| ID | User Story | Priority |
|---|---|---|
| US-501 | As an **Admin**, I want to **create time-limited campaigns** so that I can **boost engagement during events** | P0 |
| US-502 | As an **Admin**, I want to **set campaign budgets** so that I **don't overspend on rewards** | P1 |
| US-503 | As an **Admin**, I want to **build IF-THEN promotion rules** so that **complex conditions are supported** | P0 |
| US-504 | As an **Admin**, I want to **reorder rule priority** so that **the most important rule applies first** | P1 |
| US-505 | As an **Admin**, I want to **view campaign performance** so that I can **measure ROI** | P1 |

## Epic 7: Gamification

| ID | User Story | Priority |
|---|---|---|
| US-601 | As a **Member**, I want to **earn badges** so that I can **show off my achievements** | P1 |
| US-602 | As a **Member**, I want to **complete missions** so that I can **earn bonus rewards** | P1 |
| US-603 | As a **Member**, I want to **see the leaderboard** so that I can **compete with top members** | P1 |
| US-604 | As an **Admin**, I want to **create missions with time limits** so that I can **drive specific behaviors** | P1 |

## Epic 8: Voucher Management

| ID | User Story | Priority |
|---|---|---|
| US-701 | As an **Admin**, I want to **create voucher series** so that I can **run promotions** | P0 |
| US-702 | As an **Admin**, I want to **batch generate vouchers** so that I can **issue codes at scale** | P0 |
| US-703 | As a **Member**, I want to **claim a voucher** so that I can **use it later** | P0 |
| US-704 | As a **Staff**, I want to **validate voucher QR codes** so that I can **accept them at POS** | P1 |

## Epic 9: Analytics & Reports

| ID | User Story | Priority |
|---|---|---|
| US-801 | As an **Admin**, I want to **see dashboard KPIs** so that I can **monitor program health** | P0 |
| US-802 | As an **Admin**, I want to **view point analytics** so that I can **understand earn/burn patterns** | P1 |
| US-803 | As an **Admin**, I want to **segment members by RFM** so that I can **target campaigns** | P1 |
| US-804 | As an **Admin**, I want to **export reports to CSV** so that I can **share with stakeholders** | P1 |

## Epic 10: SaaS & Subscription

| ID | User Story | Priority |
|---|---|---|
| US-901 | As a **Host**, I want to **create subscription plans** so that I can **monetize the platform** | P1 |
| US-902 | As a **Tenant Admin**, I want to **upgrade my plan** so that I can **access more features** | P1 |
| US-903 | As a **Tenant Admin**, I want to **see usage stats** so that I **know if I need to upgrade** | P1 |
| US-904 | As a **Host**, I want to **enforce feature limits** so that **tenants use appropriate plan** | P1 |
