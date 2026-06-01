import { NestFactory } from '@nestjs/core';
import { Customer360ServiceModule } from './customer360-service.module';

async function bootstrap() {
  const app = await NestFactory.create(Customer360ServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
