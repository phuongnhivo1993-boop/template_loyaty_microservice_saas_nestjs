import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CampaignServiceModule } from './campaign-service.module';

async function bootstrap() {
  const logger = new Logger('CampaignService');
  const app = await NestFactory.create(CampaignServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Campaign Service')
    .setDescription('Campaign management, rules, KPIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.CAMPAIGN_SERVICE_PORT ?? 3004;
  await app.listen(port);
  logger.log(`Campaign Service running on port ${port}`);
}
bootstrap();
