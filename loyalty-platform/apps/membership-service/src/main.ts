import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MembershipServiceModule } from './membership-service.module';

async function bootstrap() {
  const logger = new Logger('MembershipService');
  const app = await NestFactory.create(MembershipServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Membership Service')
    .setDescription('Member registration, tiers, KYC')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.MEMBERSHIP_SERVICE_PORT ?? 3002;
  await app.listen(port);
  logger.log(`Membership Service running on port ${port}`);
}
bootstrap();
