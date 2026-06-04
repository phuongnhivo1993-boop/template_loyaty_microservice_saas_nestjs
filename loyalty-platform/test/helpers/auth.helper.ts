import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function loginAsHost(
  app: INestApplication,
  email: string = 'host@test.com',
  password: string = 'password123',
): Promise<AuthTokens> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/host/login')
    .send({ email, password })
    .expect(200);
  return { accessToken: res.body.accessToken, refreshToken: res.body.refreshToken };
}

export async function loginAsTenantAdmin(
  app: INestApplication,
  email: string = 'admin@tenant-a.com',
  password: string = 'password123',
): Promise<AuthTokens> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/tenant/login')
    .send({ email, password, tenantId: undefined })
    .expect(200);
  return { accessToken: res.body.accessToken, refreshToken: res.body.refreshToken };
}

export async function loginAsMember(
  app: INestApplication,
  email: string = 'member@test.com',
  password: string = 'password123',
): Promise<AuthTokens> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/member/login')
    .send({ email, password })
    .expect(200);
  return { accessToken: res.body.accessToken, refreshToken: res.body.refreshToken };
}
