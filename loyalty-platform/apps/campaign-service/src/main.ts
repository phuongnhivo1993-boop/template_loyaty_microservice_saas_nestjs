import { NestFactory } from '@nestjs/core';
import { CampaignServiceModule } from './campaign-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CampaignServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
