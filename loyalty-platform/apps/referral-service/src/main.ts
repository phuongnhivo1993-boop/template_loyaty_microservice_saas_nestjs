import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ReferralServiceModule } from './referral-service.module';

async function bootstrap() {
  const logger = new Logger('ReferralService');
  const app = await NestFactory.create(ReferralServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Referral Service')
    .setDescription('Referral links, tracking, rewards')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.REFERRAL_SERVICE_PORT ?? 3006;
  await app.listen(port);
  logger.log(`Referral Service running on port ${port}`);
}
bootstrap();
