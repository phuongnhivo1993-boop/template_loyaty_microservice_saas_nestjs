import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RewardServiceModule } from './reward-service.module';

async function bootstrap() {
  const logger = new Logger('RewardService');
  const app = await NestFactory.create(RewardServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Reward Service')
    .setDescription('Reward catalog, inventory, redemption')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.REWARD_SERVICE_PORT ?? 3005;
  await app.listen(port);
  logger.log(`Reward Service running on port ${port}`);
}
bootstrap();
