import { NestFactory } from '@nestjs/core';
import { RewardServiceModule } from './reward-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RewardServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
