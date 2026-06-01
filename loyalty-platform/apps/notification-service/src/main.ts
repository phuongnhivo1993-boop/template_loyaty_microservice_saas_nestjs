import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const logger = new Logger('NotificationService');
  const app = await NestFactory.create(NotificationServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

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
