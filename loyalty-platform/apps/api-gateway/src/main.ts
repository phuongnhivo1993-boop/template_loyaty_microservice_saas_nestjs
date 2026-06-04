import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { PrismaService } from './prisma/prisma.service';
import { TenantSubdomainMiddleware } from './common/middleware/tenant-subdomain.middleware';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create<NestExpressApplication>(ApiGatewayModule);

  app.setGlobalPrefix('api/v1');

  // Security middleware
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(helmet.default({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction ? undefined : false,
  }));
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || (isProduction ? [] : '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global pipes, filters, interceptors
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new AuditLogInterceptor(app.get(PrismaService)));

  // Tenant subdomain middleware
  app.use(new TenantSubdomainMiddleware().use);

  // Redis adapter for WebSocket multi-instance
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  logger.log('WebSocket Redis adapter initialized');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Loyalty Platform - API Gateway')
    .setDescription('API Gateway for Loyalty Platform Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_GATEWAY_PORT ?? 3001;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}
bootstrap();
