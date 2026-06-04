# Sprint Backlog & Development Tasks

## Sprint 1: Security Hardening (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Add rate limiting to auth endpoints (5 attempts/15min) | Auth | 1 day | Redis |
| Implement account lockout after 5 failed attempts | Auth | 1 day | Prisma |
| Add token blacklist on logout (Redis) | Auth | 1 day | Redis |
| Add PII encryption for phone, email, CMND | Common | 3 days | Encryption lib |
| Add audit logging for all auth events | Auth | 1 day | AuditLog |
| Standardize error handling (global filter) | Common | 2 days | - |
| Add Helmet + CORS hardening | API Gateway | 1 day | - |

## Sprint 2: SaaS Subscription (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Create Subscription model + migration | DB | 1 day | Prisma |
| Implement Subscription CRUD | Tenant | 2 days | Subscription model |
| Add feature limit enforcement (members, campaigns) | All services | 3 days | Subscription |
| Add usage tracking (API calls, members, storage) | Analytics | 2 days | - |
| Add SaaS metrics to Host Dashboard | Admin Web | 3 days | Analytics |
| Create tenant onboarding wizard | Admin Web | 3 days | - |

## Sprint 3: Mobile Enhancement (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Create OrdersScreen (list + detail) | Mobile | 2 days | API |
| Add Tab Navigation (bottom tabs) | Mobile | 2 days | - |
| Add Pull-to-refresh to remaining screens | Mobile | 2 days | - |
| Add proper form validation (email, phone, password) | Mobile | 2 days | - |
| Integrate real QR scanner (expo-camera) | Mobile | 2 days | - |
| Add Web Member: KYC upload screen | Member Web | 1 day | API |
| Add Web Member: Check-in screen | Member Web | 1 day | API |
| Add Forgot Password to Admin Web | Admin Web | 1 day | API |

## Sprint 4: Push Notifications & Offline (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Integrate FCM/APNs for push | Notification | 3 days | Firebase/APNs |
| Add push notification triggers (points, tier, etc.) | Notification | 2 days | FCM |
| Add notification preferences UI | Mobile | 1 day | - |
| Add offline data caching (AsyncStorage) | Mobile | 3 days | - |
| Add offline queue for critical actions | Mobile | 2 days | - |
| Add biometric login (Face ID) | Mobile | 1 day | - |

## Sprint 5: Architecture Migration (4 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Move member logic to membership-service | Membership | 3 days | - |
| Move point logic to loyalty-service | Loyalty | 3 days | - |
| Move campaign logic to campaign-service | Campaign | 2 days | - |
| Move reward logic to reward-service | Reward | 2 days | - |
| Move referral logic to referral-service | Referral | 2 days | - |
| Move voucher logic to voucher-service | Voucher | 2 days | - |
| Move promotion logic to promotion-service | Promotion | 2 days | - |
| Move gamification logic to gamification-service | Gamification | 2 days | - |
| Move notification logic to notification-service | Notification | 2 days | - |
| Implement Kafka event producers | Common | 3 days | Kafka |
| Implement Kafka event consumers | All services | 5 days | Kafka |

## Sprint 6: Customer 360 & Analytics (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Create Customer 360 service | customer360 | 3 days | - |
| Aggregate member data (points, orders, referrals) | customer360 | 2 days | - |
| Add Customer 360 API endpoints | API Gateway | 2 days | - |
| Add Customer 360 UI to Admin Web | Admin Web | 3 days | - |
| Integrate ClickHouse for analytics | Analytics | 3 days | - |

## Sprint 7: QA & Testing (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Write E2E tests for critical flows | All | 5 days | - |
| Write security tests (OWASP) | All | 3 days | - |
| Write performance tests (k6/artillery) | All | 3 days | - |
| Add CI/CD pipeline (GitHub Actions) | DevOps | 2 days | - |
| Add Prometheus custom metrics | All | 2 days | Prometheus |

## Sprint 8: Billing & Polish (2 weeks)

| Task | Module | Estimate | Dependencies |
|---|---|---|---|
| Integrate Stripe/VNPay billing | Billing | 5 days | Subscription |
| Add invoice management | Billing | 2 days | - |
| Add payment webhook handling | Billing | 2 days | - |
| Add sort to all list pages | Admin Web | 3 days | - |
| Add refresh button to all list pages | Admin Web | 2 days | - |

---

## Summary Timeline

```
Sprint 1: Security Hardening          │█████████░░░░░░░░░░░░░░░░░░░░░│ Week 1-2
Sprint 2: SaaS Subscription           │░░░░░░░░░█████████░░░░░░░░░░░░░│ Week 3-4
Sprint 3: Mobile Enhancement          │░░░░░░░░░░░░░░░░░█████████░░░░░│ Week 5-6
Sprint 4: Push & Offline              │░░░░░░░░░░░░░░░░░░░░░░░░░█████│ Week 7-8
Sprint 5: Architecture Migration      │█████████████████████░░░░░░░░░│ Week 9-12
Sprint 6: Customer 360 & Analytics    │░░░░░░░░░░░░░░░░░░░░█████████│ Week 13-14
Sprint 7: QA & Testing                │█████████░░░░░░░░░░░░░░░░░░░░░│ Week 15-16
Sprint 8: Billing & Polish            │░░░░░░░░░█████████░░░░░░░░░░░░░│ Week 17-18
```

**Total: ~18 weeks (4.5 months) để hoàn thiện platform cho production**
