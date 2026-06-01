import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiGatewayModule } from '../src/api-gateway.module';

/**
 * API Flow Test Script
 *
 * Flow:
 *   1. Host Registration & Login
 *   2. Tenant CRUD (host only)
 *   3. Tenant Admin Login
 *   4. User CRUD (tenant admin only)
 *   5. Service CRUD (Membership, Loyalty, Campaign, Reward, Referral,
 *                    Voucher, Promotion, Gamification, Notification, Analytics)
 *
 * NOTE: All tests are marked with `test.skip` because the backend
 *       has NOT been implemented yet. Remove `.skip` once endpoints exist.
 */

describe('API Flow: Host → Tenant → User → Service CRUD (e2e)', () => {
  let app: INestApplication<App>;
  let hostToken: string;
  let tenantToken: string;
  let createdTenantId: string;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // =========================================================================
  // 1. HOST (SUPER ADMIN) — Register & Login
  // =========================================================================
  describe('1. Host (Super Admin)', () => {
    test.todo('POST /auth/host/register — Create host account');
    test.todo('POST /auth/host/login — Login as host, receive JWT');
    test.todo('GET /auth/host/profile — Get host profile');

    test.skip('POST /auth/host/register — should register a new host', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/host/register')
        .send({
          email: 'host@loyalty-platform.com',
          password: 'StrongP@ss123',
          name: 'Platform Owner',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('host@loyalty-platform.com');
    });

    test.skip('POST /auth/host/login — should return JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/host/login')
        .send({
          email: 'host@loyalty-platform.com',
          password: 'StrongP@ss123',
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      hostToken = res.body.accessToken;
    });
  });

  // =========================================================================
  // 2. TENANT CRUD (Host only)
  // =========================================================================
  describe('2. Tenant CRUD', () => {
    test.todo('POST /tenants — Create a new tenant (host only)');
    test.todo('GET /tenants — List all tenants (host only)');
    test.todo('GET /tenants/:id — Get tenant by ID');
    test.todo('PUT /tenants/:id — Update tenant');
    test.todo('DELETE /tenants/:id — Delete tenant (host only)');

    test.skip('POST /tenants — should create a new tenant', async () => {
      const res = await request(app.getHttpServer())
        .post('/tenants')
        .set('Authorization', `Bearer ${hostToken}`)
        .send({
          name: 'Sunshine Real Estate',
          domain: 'sunshine.loyalty-platform.com',
          email: 'admin@sunshine.vn',
          phone: '0909123456',
          address: '123 Nguyen Hue, Q1, HCMC',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Sunshine Real Estate');
      createdTenantId = res.body.id;
    });

    test.skip('GET /tenants — should list all tenants', async () => {
      const res = await request(app.getHttpServer())
        .get('/tenants')
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test.skip('GET /tenants/:id — should get tenant by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/tenants/${createdTenantId}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdTenantId);
      expect(res.body.name).toBe('Sunshine Real Estate');
    });

    test.skip('PUT /tenants/:id — should update tenant', async () => {
      const res = await request(app.getHttpServer())
        .put(`/tenants/${createdTenantId}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send({ name: 'Sunshine Real Estate Group' })
        .expect(200);

      expect(res.body.name).toBe('Sunshine Real Estate Group');
    });

    test.skip('DELETE /tenants/:id — should delete tenant (soft)', async () => {
      await request(app.getHttpServer())
        .delete(`/tenants/${createdTenantId}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(204);
    });
  });

  // =========================================================================
  // 3. TENANT ADMIN — Login to tenant scope
  // =========================================================================
  describe('3. Tenant Admin Auth', () => {
    test.todo('POST /auth/tenant/login — Login as tenant admin');
    test.todo('POST /auth/tenant/register — Register tenant admin');

    test.skip('POST /auth/tenant/login — should login tenant admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/tenant/login')
        .send({
          email: 'admin@sunshine.vn',
          password: 'TenantP@ss123',
          tenantId: createdTenantId,
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('tenantId');
      tenantToken = res.body.accessToken;
    });
  });

  // =========================================================================
  // 4. USER CRUD (within tenant scope)
  // =========================================================================
  describe('4. User CRUD', () => {
    test.todo('POST /users — Create a user (tenant admin)');
    test.todo('GET /users — List users in tenant');
    test.todo('GET /users/:id — Get user by ID');
    test.todo('PUT /users/:id — Update user');
    test.todo('DELETE /users/:id — Delete user');

    test.skip('POST /users — should create a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          email: 'nguyen.van.a@sunshine.vn',
          fullName: 'Nguyen Van A',
          phone: '0909000111',
          role: 'member',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('nguyen.van.a@sunshine.vn');
      createdUserId = res.body.id;
    });

    test.skip('POST /users — should create a staff user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          email: 'staff@sunshine.vn',
          fullName: 'Tran Thi B',
          phone: '0909000222',
          role: 'staff',
        })
        .expect(201);

      expect(res.body.role).toBe('staff');
    });

    test.skip('GET /users — should list users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test.skip('GET /users/:id — should get user by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdUserId);
    });

    test.skip('PUT /users/:id — should update user', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({ fullName: 'Nguyen Van A (Updated)' })
        .expect(200);

      expect(res.body.fullName).toBe('Nguyen Van A (Updated)');
    });

    test.skip('DELETE /users/:id — should delete user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(204);
    });
  });

  // =========================================================================
  // 5. MEMBERSHIP CRUD
  // =========================================================================
  describe('5. Membership Service', () => {
    test.todo('POST /members — Register a new member');
    test.todo('POST /members/:id/kyc — Submit KYC verification');
    test.todo('GET /members — List members');
    test.todo('GET /members/:id — Get member details');
    test.todo('PUT /members/:id — Update member profile');
    test.todo('PATCH /members/:id/status — Lock/Unlock member');
    test.todo('DELETE /members/:id — Delete member');
    test.todo('GET /members/:id/history — Get transaction history');
    test.todo('POST /tiers — Create a membership tier');
    test.todo('GET /tiers — List tiers');
    test.todo('PUT /tiers/:id — Update tier');
    test.todo('DELETE /tiers/:id — Delete tier');
    test.todo('GET /members/:id/tier — Get member current tier');
    test.todo('GET /tier-rules — List tier upgrade rules');

    test.skip('POST /members — should register a new member', async () => {
      const res = await request(app.getHttpServer())
        .post('/members')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          email: 'member@test.com',
          fullName: 'Le Van C',
          phone: '0909000333',
        })
        .expect(201);
      expect(res.body).toHaveProperty('id');
    });

    test.skip('POST /tiers — should create a tier', async () => {
      const res = await request(app.getHttpServer())
        .post('/tiers')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Gold',
          minPoints: 1000,
          maxPoints: 5000,
          benefits: ['5% discount', 'Priority support'],
        })
        .expect(201);
      expect(res.body.name).toBe('Gold');
    });

    test.skip('GET /members — should list members', async () => {
      const res = await request(app.getHttpServer())
        .get('/members')
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // =========================================================================
  // 6. LOYALTY POINT CRUD
  // =========================================================================
  describe('6. Loyalty Point Service', () => {
    test.todo('GET /point-wallets/:memberId — Get member point wallet');
    test.todo('POST /points/earn — Earn points for a member');
    test.todo('POST /points/burn — Burn/Redeem points');
    test.todo('GET /points/transactions — List point transactions');
    test.todo('GET /points/expirations — List expiring points');
    test.todo('GET /points/balance/:memberId — Get point balance');

    test.skip('POST /points/earn — should earn points', async () => {
      const res = await request(app.getHttpServer())
        .post('/points/earn')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          memberId: createdUserId,
          amount: 500,
          reason: 'Purchase transaction #1234',
        })
        .expect(201);
      expect(res.body.balance).toBeDefined();
    });

    test.skip('GET /points/balance/:memberId — should return balance', async () => {
      const res = await request(app.getHttpServer())
        .get(`/points/balance/${createdUserId}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('available');
      expect(res.body).toHaveProperty('pending');
      expect(res.body).toHaveProperty('expired');
      expect(res.body).toHaveProperty('used');
    });
  });

  // =========================================================================
  // 7. CAMPAIGN CRUD
  // =========================================================================
  describe('7. Campaign Service', () => {
    test.todo('POST /campaigns — Create a campaign');
    test.todo('GET /campaigns — List campaigns');
    test.todo('GET /campaigns/:id — Get campaign details');
    test.todo('PUT /campaigns/:id — Update campaign');
    test.todo('DELETE /campaigns/:id — Delete campaign');
    test.todo('POST /campaigns/:id/rules — Add campaign rule');
    test.todo('GET /campaigns/:id/analytics — Get campaign KPIs');
    test.todo('PATCH /campaigns/:id/status — Activate/Pause/End campaign');

    test.skip('POST /campaigns — should create a campaign', async () => {
      const res = await request(app.getHttpServer())
        .post('/campaigns')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Summer Promotion 2026',
          description: 'Double points for summer',
          startDate: '2026-06-01T00:00:00Z',
          endDate: '2026-08-31T23:59:59Z',
          budget: 10000000,
          targetAudience: 'all',
        })
        .expect(201);
      expect(res.body.name).toBe('Summer Promotion 2026');
    });
  });

  // =========================================================================
  // 8. REWARD CRUD
  // =========================================================================
  describe('8. Reward Service', () => {
    test.todo('POST /rewards — Create a reward item');
    test.todo('GET /rewards — List rewards catalog');
    test.todo('GET /rewards/:id — Get reward details');
    test.todo('PUT /rewards/:id — Update reward');
    test.todo('DELETE /rewards/:id — Delete reward');
    test.todo('GET /rewards/:id/inventory — Get reward inventory');
    test.todo('POST /rewards/:id/redeem — Redeem a reward');
    test.todo('POST /rewards/:id/approve — Approve redemption');
    test.todo('POST /rewards/:id/reject — Reject redemption');
    test.todo('GET /rewards/orders — List reward orders');
    test.todo('PUT /rewards/orders/:id/delivery — Update delivery status');

    test.skip('POST /rewards — should create a reward', async () => {
      const res = await request(app.getHttpServer())
        .post('/rewards')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Voucher 100k',
          type: 'voucher',
          pointsRequired: 1000,
          quantity: 100,
          description: '100k Voucher for partner store',
        })
        .expect(201);
      expect(res.body.name).toBe('Voucher 100k');
    });
  });

  // =========================================================================
  // 9. REFERRAL CRUD
  // =========================================================================
  describe('9. Referral Service', () => {
    test.todo('POST /referral-links — Generate referral link');
    test.todo('GET /referral-links — List referral links');
    test.todo('POST /referrals — Create a referral record');
    test.todo('GET /referrals — List referrals');
    test.todo('GET /referrals/:id — Get referral details');
    test.todo('GET /referrals/stats — Get referral stats');
    test.todo('POST /referral-rewards — Award referral reward');

    test.skip('POST /referral-links — should create a referral link', async () => {
      const res = await request(app.getHttpServer())
        .post('/referral-links')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          memberId: createdUserId,
          campaignId: 'campaign-id-here',
        })
        .expect(201);
      expect(res.body).toHaveProperty('code');
      expect(res.body).toHaveProperty('url');
    });
  });

  // =========================================================================
  // 10. VOUCHER CRUD
  // =========================================================================
  describe('10. Voucher Service', () => {
    test.todo('POST /vouchers — Create a voucher');
    test.todo('GET /vouchers — List vouchers');
    test.todo('GET /vouchers/:id — Get voucher details');
    test.todo('PUT /vouchers/:id — Update voucher');
    test.todo('DELETE /vouchers/:id — Delete voucher');
    test.todo('POST /voucher-series — Create a voucher series');
    test.todo('GET /voucher-series — List voucher series');
    test.todo('POST /vouchers/:id/claim — Claim a voucher');
    test.todo('POST /vouchers/:id/redeem — Redeem a voucher');
    test.todo('POST /vouchers/:id/expire — Expire a voucher');

    test.skip('POST /vouchers — should create a voucher', async () => {
      const res = await request(app.getHttpServer())
        .post('/vouchers')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          code: 'SUMMER2026',
          type: 'discount',
          value: 15,
          valueType: 'percent',
          maxUsage: 1000,
          expiresAt: '2026-12-31T23:59:59Z',
        })
        .expect(201);
      expect(res.body.code).toBe('SUMMER2026');
    });
  });

  // =========================================================================
  // 11. PROMOTION CRUD
  // =========================================================================
  describe('11. Promotion Service', () => {
    test.todo('POST /promotions — Create a promotion rule');
    test.todo('GET /promotions — List promotion rules');
    test.todo('GET /promotions/:id — Get promotion rule');
    test.todo('PUT /promotions/:id — Update promotion rule');
    test.todo('DELETE /promotions/:id — Delete promotion rule');
    test.todo('POST /promotions/:id/conditions — Add condition');
    test.todo('POST /promotions/:id/actions — Add action');
    test.todo('PUT /promotions/:id/priority — Update priority');
    test.todo('POST /promotions/:id/version — Create new version');

    test.skip('POST /promotions — should create a promotion rule', async () => {
      const res = await request(app.getHttpServer())
        .post('/promotions')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Gold Member Bonus',
          description: 'Gold members get 500 extra points on purchase',
          priority: 1,
          conditions: [
            { field: 'tier', operator: 'eq', value: 'Gold' },
            { field: 'purchaseAmount', operator: 'gte', value: 1000000 },
          ],
          actions: [
            { type: 'addPoints', value: 500 },
          ],
        })
        .expect(201);
      expect(res.body.name).toBe('Gold Member Bonus');
    });
  });

  // =========================================================================
  // 12. GAMIFICATION CRUD
  // =========================================================================
  describe('12. Gamification Service', () => {
    test.todo('POST /badges — Create a badge');
    test.todo('GET /badges — List badges');
    test.todo('PUT /badges/:id — Update badge');
    test.todo('DELETE /badges/:id — Delete badge');
    test.todo('POST /missions — Create a mission');
    test.todo('GET /missions — List missions');
    test.todo('PUT /missions/:id — Update mission');
    test.todo('DELETE /missions/:id — Delete mission');
    test.todo('GET /achievements/:memberId — Get member achievements');
    test.todo('POST /achievements — Award achievement to member');

    test.skip('POST /badges — should create a badge', async () => {
      const res = await request(app.getHttpServer())
        .post('/badges')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Top Seller',
          icon: '🏆',
          description: 'Awarded to top selling agents',
          criteria: { salesCount: { gte: 10 } },
        })
        .expect(201);
      expect(res.body.name).toBe('Top Seller');
    });

    test.skip('POST /missions — should create a mission', async () => {
      const res = await request(app.getHttpServer())
        .post('/missions')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Refer 5 customers',
          description: 'Refer 5 new customers this month',
          pointsReward: 2000,
          badgeReward: 'Top Referrer',
          criteria: { referralCount: 5 },
          startDate: '2026-06-01T00:00:00Z',
          endDate: '2026-06-30T23:59:59Z',
        })
        .expect(201);
      expect(res.body.name).toBe('Refer 5 customers');
    });
  });

  // =========================================================================
  // 13. NOTIFICATION CRUD
  // =========================================================================
  describe('13. Notification Service', () => {
    test.todo('POST /notifications/send — Send a notification');
    test.todo('POST /notifications/templates — Create notification template');
    test.todo('GET /notifications/templates — List templates');
    test.todo('PUT /notifications/templates/:id — Update template');
    test.todo('GET /notifications/history — List sent notifications');
    test.todo('POST /notifications/channels — Configure channel');

    test.skip('POST /notifications/send — should send notification', async () => {
      const res = await request(app.getHttpServer())
        .post('/notifications/send')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          to: 'member@test.com',
          channel: 'email',
          templateId: 'welcome-email',
          data: { fullName: 'Le Van C' },
        })
        .expect(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  // =========================================================================
  // 14. ANALYTICS
  // =========================================================================
  describe('14. Analytics Service', () => {
    test.todo('GET /analytics/dashboard — Get dashboard metrics');
    test.todo('GET /analytics/members — Member analytics');
    test.todo('GET /analytics/points — Point analytics');
    test.todo('GET /analytics/campaigns — Campaign analytics');
    test.todo('GET /analytics/referrals — Referral analytics');
    test.todo('GET /analytics/vouchers — Voucher analytics');
    test.todo('GET /analytics/retention — Retention & churn report');
    test.todo('GET /analytics/ltv — Customer LTV report');

    test.skip('GET /analytics/dashboard — should return dashboard', async () => {
      const res = await request(app.getHttpServer())
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${tenantToken}`)
        .query({
          from: '2026-01-01',
          to: '2026-06-01',
        })
        .expect(200);

      expect(res.body).toHaveProperty('mau');
      expect(res.body).toHaveProperty('activeMembers');
      expect(res.body).toHaveProperty('retention');
      expect(res.body).toHaveProperty('churn');
      expect(res.body).toHaveProperty('redeemRate');
      expect(res.body).toHaveProperty('referralRate');
      expect(res.body).toHaveProperty('ltv');
      expect(res.body).toHaveProperty('cac');
    });
  });
});
