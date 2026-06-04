import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiGatewayModule } from '../../apps/api-gateway/src/api-gateway.module';

describe('Health Check (e2e)', () => {
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

  describe('GET /api/v1/health', () => {
    it('should return 200 with status ok and database healthy', async () => {
      // NOTE: This test requires a running PostgreSQL instance with a valid DATABASE_URL.
      //       PrismaService.$queryRaw will fail if the database is not reachable.
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('memory');
    });

    it('should return valid JSON structure', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect('Content-Type', /json/);

      expect(res.body).toMatchObject({
        status: expect.any(String),
        database: expect.any(String),
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });

    it('should include memory usage metrics', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(res.body.memory).toMatchObject({
        rss: expect.any(Number),
        heapTotal: expect.any(Number),
        heapUsed: expect.any(Number),
      });
    });
  });
});
