import { NestFactory } from '@nestjs/core';
import { GamificationServiceModule } from './gamification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GamificationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
