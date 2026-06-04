import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiGatewayModule } from '../../apps/api-gateway/src/api-gateway.module';

describe('Authentication (e2e)', () => {
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

  describe('POST /api/v1/auth/member/login', () => {
    it('should return 200 with tokens for valid credentials', async () => {
      // NOTE: Requires a member with email "member@test.com" and password "password123"
      //       seeded in the database. The password must be bcrypt-hashed with 12 rounds.
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'member@test.com', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'nonexistent@test.com', password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should return 422 when email is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ password: 'password123' })
        .expect(422);
    });

    it('should return 422 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'member@test.com', password: '12' })
        .expect(422);
    });
  });

  describe('Token format validation', () => {
    it('should return a JWT token in valid three-part format', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'member@test.com', password: 'password123' })
        .expect(200);

      const token: string = res.body.accessToken;
      expect(token.split('.')).toHaveLength(3);
    });

    it('should return a refresh token in valid JWT format', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'member@test.com', password: 'password123' })
        .expect(200);

      const token: string = res.body.refreshToken;
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('Protected endpoints', () => {
    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/members')
        .expect(401);
    });

    it('should return 401 when an invalid token is provided', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/members')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });

    it('should return 200 with valid token', async () => {
      // NOTE: Requires a seeded member that can log in and that the members table
      //       contains at least one record scoped to the member's tenant.
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/member/login')
        .send({ email: 'member@test.com', password: 'password123' })
        .expect(200);

      const token = loginRes.body.accessToken;

      await request(app.getHttpServer())
        .get('/api/v1/members')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Host login', () => {
    it('should return tokens for valid host credentials', async () => {
      // NOTE: Requires a host with email "host@test.com" seeded in the database.
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/host/login')
        .send({ email: 'host@test.com', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid host credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/host/login')
        .send({ email: 'host@test.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Tenant login', () => {
    it('should return tokens for valid tenant admin credentials', async () => {
      // NOTE: Requires a tenant admin user with email "admin@tenant-a.com"
      //       and a valid tenant "tenant-a-id" seeded in the database.
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/tenant/login')
        .send({ email: 'admin@tenant-a.com', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });
  });
});
