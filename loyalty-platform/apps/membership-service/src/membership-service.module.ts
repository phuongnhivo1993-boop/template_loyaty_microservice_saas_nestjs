import { Module } from '@nestjs/common';
import { MembershipServiceController } from './membership-service.controller';
import { MembershipServiceService } from './membership-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembershipServiceController],
  providers: [MembershipServiceService],
})
export class MembershipServiceModule {}
