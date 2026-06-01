import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoyaltyServiceModule } from './loyalty-service.module';

async function bootstrap() {
  const logger = new Logger('LoyaltyService');
  const app = await NestFactory.create(LoyaltyServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Loyalty Point Service')
    .setDescription('Point wallets, earn, burn, transactions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.LOYALTY_SERVICE_PORT ?? 3003;
  await app.listen(port);
  logger.log(`Loyalty Service running on port ${port}`);
}
bootstrap();
