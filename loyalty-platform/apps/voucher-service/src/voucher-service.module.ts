import { Module } from '@nestjs/common';
import { VoucherServiceController } from './voucher-service.controller';
import { VoucherServiceService } from './voucher-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoucherServiceController],
  providers: [VoucherServiceService],
})
export class VoucherServiceModule {}
