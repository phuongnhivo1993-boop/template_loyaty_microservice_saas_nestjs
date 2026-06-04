import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PlanLimitsService } from './plan-limits.service';
import { StripeService } from './stripe.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PlanLimitsService, StripeService],
  exports: [SubscriptionService, PlanLimitsService, StripeService],
})
export class SubscriptionModule {}
