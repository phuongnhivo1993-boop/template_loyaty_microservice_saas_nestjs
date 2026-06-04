import { Module } from '@nestjs/common';
import { VoucherServiceController } from './voucher-service.controller';
import { VoucherServiceService } from './voucher-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoucherServiceController, HealthController],
  providers: [VoucherServiceService],
})
export class VoucherServiceModule {}
