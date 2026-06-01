import { NestFactory } from '@nestjs/core';
import { VoucherServiceModule } from './voucher-service.module';

async function bootstrap() {
  const app = await NestFactory.create(VoucherServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
