import { Module } from '@nestjs/common';
import { RewardServiceController } from './reward-service.controller';
import { RewardServiceService } from './reward-service.service';

@Module({
  imports: [],
  controllers: [RewardServiceController],
  providers: [RewardServiceService],
})
export class RewardServiceModule {}
