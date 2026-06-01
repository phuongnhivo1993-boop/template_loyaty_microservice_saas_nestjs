import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PromotionServiceModule } from './promotion-service.module';

async function bootstrap() {
  const logger = new Logger('PromotionService');
  const app = await NestFactory.create(PromotionServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Promotion Service')
    .setDescription('Promotion rule engine, conditions, actions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PROMOTION_SERVICE_PORT ?? 3008;
  await app.listen(port);
  logger.log(`Promotion Service running on port ${port}`);
}
bootstrap();
