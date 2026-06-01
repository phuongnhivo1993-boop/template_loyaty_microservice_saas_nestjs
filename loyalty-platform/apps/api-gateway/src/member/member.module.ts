import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TierModule } from '../tier/tier.module';
import { PointModule } from '../point/point.module';

@Module({
  imports: [TierModule, PointModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
