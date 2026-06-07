import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { PrismaService } from './prisma/prisma.service';
import { TenantSubdomainMiddleware } from './common/middleware/tenant-subdomain.middleware';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { WinstonLoggerService } from './common/logger/winston-logger.service';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new WinstonLoggerService();
  const app = await NestFactory.create<NestExpressApplication>(ApiGatewayModule, {
    rawBody: true,
    bufferLogs: true,
  });

  app.useLogger(logger);

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

  // Middleware
  app.use(new CorrelationIdMiddleware().use);
  app.use(new TenantSubdomainMiddleware().use);

  // Redis adapter for WebSocket multi-instance
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  logger.log('WebSocket Redis adapter initialized', 'Bootstrap');

  // Swagger
  const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Loyalty Platform API')
      .setDescription('Multi-tenant loyalty platform API with microservices architecture')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } as const,
        'JWT-auth',
      )
      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'ApiKey-auth',
      )
      .addApiKey(
        { type: 'apiKey', name: 'tenant-id', in: 'header' },
        'TenantId-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log('Swagger docs available at /api/docs', 'Bootstrap');
  }

  const port = process.env.API_GATEWAY_PORT ?? 3001;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`, 'Bootstrap');
}
bootstrap();
