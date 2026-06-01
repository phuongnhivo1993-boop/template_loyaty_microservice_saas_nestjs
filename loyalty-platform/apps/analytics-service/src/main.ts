import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AnalyticsServiceModule } from './analytics-service.module';

async function bootstrap() {
  const logger = new Logger('AnalyticsService');
  const app = await NestFactory.create(AnalyticsServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Analytics Service')
    .setDescription('Dashboard metrics, reports, ClickHouse queries')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.ANALYTICS_SERVICE_PORT ?? 3011;
  await app.listen(port);
  logger.log(`Analytics Service running on port ${port}`);
}
bootstrap();
