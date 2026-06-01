import { Module } from '@nestjs/common';
import { MemberSelfController } from './member-self.controller';
import { MemberSelfService } from './member-self.service';

@Module({
  controllers: [MemberSelfController],
  providers: [MemberSelfService],
  exports: [MemberSelfService],
})
export class MemberSelfModule {}
