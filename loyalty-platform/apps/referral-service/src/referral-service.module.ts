import { Module } from '@nestjs/common';
import { ReferralServiceController } from './referral-service.controller';
import { ReferralServiceService } from './referral-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReferralServiceController, HealthController],
  providers: [ReferralServiceService],
})
export class ReferralServiceModule {}
