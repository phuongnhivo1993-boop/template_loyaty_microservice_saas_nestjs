import { Module } from '@nestjs/common';
import { RewardServiceController } from './reward-service.controller';
import { RewardServiceService } from './reward-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RewardServiceController],
  providers: [RewardServiceService],
})
export class RewardServiceModule {}
