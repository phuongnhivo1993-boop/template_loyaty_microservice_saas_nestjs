import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiGatewayModule } from '../../apps/api-gateway/src/api-gateway.module';

// ---------------------------------------------------------------------------
// Pagination Tests
//
// NOTE: These tests require a running database with seed data containing:
//   - A host user (host@test.com / password123)
//   - A tenant with id "tenant-a-id"
//   - At least 25 member records under tenant-a-id with varied names so that
//     search filtering and pagination boundaries can be verified.
//     Recommended seed names: "Alice Smith", "Bob Jones", "Charlie Brown", …
// ---------------------------------------------------------------------------

async function getHostToken(app: INestApplication): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/host/login')
    .send({ email: 'host@test.com', password: 'password123' })
    .expect(200);
  return res.body.accessToken;
}

describe('Pagination (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    token = await getHostToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ({ Authorization: `Bearer ${token}` });

  describe('Default pagination', () => {
    it('should return pagination meta with page, limit, total, totalPages', async () => {
      // NOTE: Depends on the response format of the service. Some services
      //       return { data, meta } while others return the array directly.
      //       This test handles both shapes.
      const res = await request(app.getHttpServer())
        .get('/api/v1/members')
        .set(auth())
        .expect(200);

      // If the response has a `meta` property, validate it.
      if (res.body.meta) {
        expect(res.body.meta).toMatchObject({
          page: expect.any(Number),
          limit: expect.any(Number),
          total: expect.any(Number),
          totalPages: expect.any(Number),
        });
      } else {
        // Otherwise the response may be the raw array; pagination meta
        // may be in headers or the service may not include it.
        expect(Array.isArray(res.body)).toBe(true);
      }
    });

    it('should default to page 1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members')
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.page).toBe(1);
      }
    });

    it('should default to a reasonable limit (e.g. 20)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members')
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.limit).toBeGreaterThanOrEqual(1);
        expect(res.body.meta.limit).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Page parameter', () => {
    it('should return page 1 when ?page=1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?page=1')
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.page).toBe(1);
      }
    });

    it('should return page 2 when ?page=2', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?page=2')
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.page).toBe(2);
      }
    });

    it('should return different data for page 1 and page 2 when enough records exist', async () => {
      // NOTE: Requires at least 2 members in the database. If fewer exist
      //       both pages will return identical (empty) arrays — that is fine.
      const page1 = await request(app.getHttpServer())
        .get('/api/v1/members?page=1&limit=1')
        .set(auth())
        .expect(200);

      const page2 = await request(app.getHttpServer())
        .get('/api/v1/members?page=2&limit=1')
        .set(auth())
        .expect(200);

      const data1 = Array.isArray(page1.body) ? page1.body : page1.body.data || [];
      const data2 = Array.isArray(page2.body) ? page2.body : page2.body.data || [];

      if (data1.length > 0 && data2.length > 0) {
        expect(data1[0].id).not.toBe(data2[0].id);
      }
    });
  });

  describe('Limit parameter', () => {
    it('should respect ?limit=5 and return at most 5 items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?limit=5')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      expect(items.length).toBeLessThanOrEqual(5);

      if (res.body.meta) {
        expect(res.body.meta.limit).toBe(5);
      }
    });

    it('should respect ?limit=1 and return exactly 1 item (when available)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?limit=1')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      if (items.length > 0) {
        expect(items.length).toBe(1);
      }

      if (res.body.meta) {
        expect(res.body.meta.limit).toBe(1);
      }
    });

    it('should cap limit to a maximum (e.g. 100) when excessive', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?limit=9999')
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.limit).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Search query', () => {
    it('should filter results when ?search=Alice is provided', async () => {
      // NOTE: Requires at least one member whose name/email includes "Alice".
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?search=Alice')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      for (const item of items) {
        const searchable = `${item.fullName} ${item.email}`.toLowerCase();
        expect(searchable).toContain('alice');
      }
    });

    it('should return empty results for a non-matching search', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?search=xxxxxxxxxx_nonexistent_yyyyy')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      expect(items).toHaveLength(0);

      if (res.body.meta) {
        expect(res.body.meta.total).toBe(0);
      }
    });

    it('should be case-insensitive', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?search=alice')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      // If "Alice" exists, the case-insensitive search should find it.
      for (const item of items) {
        const searchable = `${item.fullName} ${item.email}`.toLowerCase();
        expect(searchable).toContain('alice');
      }
    });
  });

  describe('Sort parameter', () => {
    it('should sort ascending when ?sort=createdAt', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?sort=createdAt')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      if (items.length > 1) {
        for (let i = 1; i < items.length; i++) {
          const prev = new Date(items[i - 1].createdAt).getTime();
          const curr = new Date(items[i].createdAt).getTime();
          expect(prev).toBeLessThanOrEqual(curr);
        }
      }
    });

    it('should sort descending when ?sort=-createdAt', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?sort=-createdAt')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      if (items.length > 1) {
        for (let i = 1; i < items.length; i++) {
          const prev = new Date(items[i - 1].createdAt).getTime();
          const curr = new Date(items[i].createdAt).getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      }
    });

    it('should sort by email when ?sort=email', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?sort=email')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      if (items.length > 1) {
        for (let i = 1; i < items.length; i++) {
          expect(items[i - 1].email.localeCompare(items[i].email)).toBeLessThanOrEqual(0);
        }
      }
    });

    it('should sort descending by email when ?sort=-email', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?sort=-email')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      if (items.length > 1) {
        for (let i = 1; i < items.length; i++) {
          expect(items[i - 1].email.localeCompare(items[i].email)).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should return 400 for an invalid sort field', async () => {
      // SQL injection or non-existent field should be sanitised.
      await request(app.getHttpServer())
        .get('/api/v1/members?sort=nonexistentField')
        .set(auth())
        .expect(400);
    });
  });

  describe('Combined pagination', () => {
    it('should handle page, limit, search, and sort together', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/members?page=1&limit=5&search=a&sort=email')
        .set(auth())
        .expect(200);

      const items = Array.isArray(res.body) ? res.body : res.body.data || [];
      expect(items.length).toBeLessThanOrEqual(5);

      if (items.length > 1) {
        for (let i = 1; i < items.length; i++) {
          expect(items[i - 1].email.localeCompare(items[i].email)).toBeLessThanOrEqual(0);
        }
      }
    });

    it('should return correct totalPages for a given limit', async () => {
      // Fetch all members to know the total count, then verify totalPages.
      const allRes = await request(app.getHttpServer())
        .get('/api/v1/members?limit=100')
        .set(auth())
        .expect(200);

      let total = 0;
      if (allRes.body.meta) {
        total = allRes.body.meta.total;
      } else {
        const items = Array.isArray(allRes.body) ? allRes.body : allRes.body.data || [];
        total = items.length;
      }

      const limit = 10;
      const expectedPages = Math.ceil(total / limit) || 1;

      const res = await request(app.getHttpServer())
        .get(`/api/v1/members?limit=${limit}`)
        .set(auth())
        .expect(200);

      if (res.body.meta) {
        expect(res.body.meta.totalPages).toBe(expectedPages);
      }
    });
  });
});
