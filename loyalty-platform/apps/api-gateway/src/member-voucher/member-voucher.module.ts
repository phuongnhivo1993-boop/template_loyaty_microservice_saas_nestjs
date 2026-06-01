import { Module } from '@nestjs/common';
import { MemberVoucherController } from './member-voucher.controller';
import { MemberVoucherService } from './member-voucher.service';

@Module({
  controllers: [MemberVoucherController],
  providers: [MemberVoucherService],
  exports: [MemberVoucherService],
})
export class MemberVoucherModule {}
