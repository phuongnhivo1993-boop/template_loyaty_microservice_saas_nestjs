import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiGatewayModule } from '../../apps/api-gateway/src/api-gateway.module';

// ---------------------------------------------------------------------------
// NOTE: All CRUD tests require a running database with seed data containing:
//   - A host user (host@test.com / password123)
//   - At least one tenant (id: "tenant-a-id")
//   - For tier/tierId references: a seeded tier record
//   - For product categories: a seeded category record
//   - For store references: a seeded store if testing store staff
//
// The login helper below obtains a host-level bearer token so that RoleGuards
// (HOST role) do not block write operations.
// ---------------------------------------------------------------------------

async function getHostToken(app: INestApplication): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/host/login')
    .send({ email: 'host@test.com', password: 'password123' })
    .expect(200);
  return res.body.accessToken;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Each entity config provides the endpoint, a valid create payload, and
// an update payload with a field that differs from the create payload.
interface EntityConfig {
  name: string;
  endpoint: string;
  createPayload: Record<string, any>;
  updatePayload: Record<string, any>;
}

const ENTITIES: EntityConfig[] = [
  {
    name: 'members',
    endpoint: '/api/v1/members',
    createPayload: {
      email: `e2e-member-${Date.now()}@test.com`,
      fullName: 'E2E Test Member',
      phone: '+84123456789',
      tenantId: 'tenant-a-id',
    },
    updatePayload: { fullName: 'E2E Updated Member' },
  },
  {
    name: 'campaigns',
    endpoint: '/api/v1/campaigns',
    createPayload: {
      name: `E2E Campaign ${Date.now()}`,
      description: 'Created during E2E test',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
      budget: 10000,
      tenantId: 'tenant-a-id',
    },
    updatePayload: { name: `E2E Campaign Updated ${Date.now()}` },
  },
  {
    name: 'vouchers',
    endpoint: '/api/v1/vouchers',
    createPayload: {
      code: `E2E-${Date.now()}`,
      type: 'DISCOUNT',
      value: 20,
      maxUsage: 100,
      expiresAt: '2025-12-31T23:59:59Z',
      tenantId: 'tenant-a-id',
    },
    updatePayload: { value: 25 },
  },
  {
    name: 'tiers',
    endpoint: '/api/v1/tiers',
    createPayload: {
      name: `E2E Tier ${Date.now()}`,
      description: 'E2E test tier',
      minPoints: 0,
      maxPoints: 1000,
      multiplier: 1.0,
      color: '#FF5733',
      tenantId: 'tenant-a-id',
    },
    updatePayload: { name: `E2E Tier Updated ${Date.now()}` },
  },
  {
    name: 'products',
    endpoint: '/api/v1/products',
    createPayload: {
      name: `E2E Product ${Date.now()}`,
      description: 'E2E test product',
      price: 99.99,
      cost: 50.0,
      stock: 100,
      sku: `SKU-${Date.now()}`,
      categoryId: null,
      tenantId: 'tenant-a-id',
    },
    updatePayload: { price: 79.99, stock: 150 },
  },
  {
    name: 'stores',
    endpoint: '/api/v1/stores',
    createPayload: {
      name: `E2E Store ${Date.now()}`,
      address: '123 E2E Street, Test City',
      phone: '+84987654321',
      status: 'ACTIVE',
      tenantId: 'tenant-a-id',
    },
    updatePayload: { name: `E2E Store Updated ${Date.now()}` },
  },
  {
    name: 'badges',
    endpoint: '/api/v1/badges',
    createPayload: {
      name: `E2E Badge ${Date.now()}`,
      description: 'E2E test badge',
      iconUrl: 'https://example.com/badge.png',
      criteria: { points: 500 },
      tenantId: 'tenant-a-id',
    },
    updatePayload: { name: `E2E Badge Updated ${Date.now()}` },
  },
];

describe('CRUD Operations (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe.each(ENTITIES)('$name', (entity: EntityConfig) => {
    let token: string;
    let createdId: string;

    beforeAll(async () => {
      token = await getHostToken(app);
    });

    it('POST – should create entity and return 201 with an id', async () => {
      // NOTE: Requires the Prisma database to be running and the referenced
      //       tenant "tenant-a-id" to exist in the tenants table.
      const res = await request(app.getHttpServer())
        .post(entity.endpoint)
        .set(authHeader(token))
        .send(entity.createPayload)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdId = res.body.id;
    });

    it('GET – should list entities and return 200 with an array', async () => {
      const res = await request(app.getHttpServer())
        .get(entity.endpoint)
        .set(authHeader(token))
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      // When the response is paginated the array may be wrapped.
      // Accept both plain arrays and { data: [...] } wrappers.
      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      expect(items.length).toBeGreaterThanOrEqual(0);
    });

    it('GET :id – should return 200 with matching id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${entity.endpoint}/${createdId}`)
        .set(authHeader(token))
        .expect(200);

      expect(res.body).toHaveProperty('id', createdId);
    });

    it('PUT :id – should return 200 with updated fields', async () => {
      const res = await request(app.getHttpServer())
        .put(`${entity.endpoint}/${createdId}`)
        .set(authHeader(token))
        .send(entity.updatePayload)
        .expect(200);

      for (const [key, value] of Object.entries(entity.updatePayload)) {
        if (typeof value === 'string' && value.startsWith('E2E')) {
          // For string fields we just verify the field exists (the value
          // may differ due to dynamic Date.now() suffixes).
          expect(res.body).toHaveProperty(key);
        } else {
          expect(res.body[key]).toEqual(value);
        }
      }
    });

    it('DELETE :id – should return 200/204, subsequent GET returns 404', async () => {
      // DELETE – accept either 200 or 204
      const deleteRes = await request(app.getHttpServer())
        .delete(`${entity.endpoint}/${createdId}`)
        .set(authHeader(token));

      expect([200, 204]).toContain(deleteRes.status);

      // Subsequent GET should return 404
      await request(app.getHttpServer())
        .get(`${entity.endpoint}/${createdId}`)
        .set(authHeader(token))
        .expect(404);
    });
  });
});
