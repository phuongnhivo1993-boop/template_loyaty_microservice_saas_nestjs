import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GamificationServiceModule } from './gamification-service.module';

async function bootstrap() {
  const logger = new Logger('GamificationService');
  const app = await NestFactory.create(GamificationServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Gamification Service')
    .setDescription('Badges, missions, achievements, leaderboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.GAMIFICATION_SERVICE_PORT ?? 3009;
  await app.listen(port);
  logger.log(`Gamification Service running on port ${port}`);
}
bootstrap();
