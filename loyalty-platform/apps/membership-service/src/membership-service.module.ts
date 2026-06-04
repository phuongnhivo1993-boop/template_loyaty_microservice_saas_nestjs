import { Module } from '@nestjs/common';
import { MembershipServiceController } from './membership-service.controller';
import { MembershipServiceService } from './membership-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembershipServiceController, HealthController],
  providers: [MembershipServiceService],
})
export class MembershipServiceModule {}
