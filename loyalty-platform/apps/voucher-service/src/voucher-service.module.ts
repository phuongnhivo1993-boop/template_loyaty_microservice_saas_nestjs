import { Module } from '@nestjs/common';
import { VoucherServiceController } from './voucher-service.controller';
import { VoucherServiceService } from './voucher-service.service';

@Module({
  imports: [],
  controllers: [VoucherServiceController],
  providers: [VoucherServiceService],
})
export class VoucherServiceModule {}
