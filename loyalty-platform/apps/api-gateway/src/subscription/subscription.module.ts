import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PlanLimitsService } from './plan-limits.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PlanLimitsService],
  exports: [SubscriptionService, PlanLimitsService],
})
export class SubscriptionModule {}
