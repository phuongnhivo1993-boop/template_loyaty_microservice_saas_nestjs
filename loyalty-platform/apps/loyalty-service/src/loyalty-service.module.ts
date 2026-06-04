import { Module } from '@nestjs/common';
import { LoyaltyServiceController } from './loyalty-service.controller';
import { LoyaltyServiceService } from './loyalty-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoyaltyServiceController, HealthController],
  providers: [LoyaltyServiceService],
})
export class LoyaltyServiceModule {}
