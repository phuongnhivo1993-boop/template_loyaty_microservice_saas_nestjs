import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NotificationServiceModule } from './notification-service.module';

const ALLOWED_API_KEYS = new Set([
  process.env.INTERNAL_API_KEY || 'loyalty-internal-key-dev',
]);

async function bootstrap() {
  const logger = new Logger('NotificationService');
  const app = await NestFactory.create(NotificationServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use((req: any, res: any, next: any) => {
    const publicPaths = ['/api/v1/health'];
    if (publicPaths.includes(req.path)) return next();
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !ALLOWED_API_KEYS.has(apiKey)) {
      return res.status(401).json({ statusCode: 401, message: 'Invalid or missing API key' });
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Notification Service')
    .setDescription('Email, SMS, Push, Zalo notifications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.NOTIFICATION_SERVICE_PORT ?? 3010;
  await app.listen(port);
  logger.log(`Notification Service running on port ${port}`);
}
bootstrap();
