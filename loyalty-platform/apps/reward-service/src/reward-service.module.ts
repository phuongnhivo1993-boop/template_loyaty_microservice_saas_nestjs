import { Module } from '@nestjs/common';
import { RewardServiceController } from './reward-service.controller';
import { RewardServiceService } from './reward-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RewardServiceController, HealthController],
  providers: [RewardServiceService],
})
export class RewardServiceModule {}
