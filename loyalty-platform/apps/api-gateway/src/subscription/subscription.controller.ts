import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { PlanLimitsService } from './plan-limits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { SkipTenantCheck } from '../auth/skip-tenant.decorator';
import { Roles } from '../auth/roles.decorator';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionQueryDto } from './dto/subscription.dto';
import { CreateCheckoutSessionDto, CreatePortalSessionDto } from './dto/stripe.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private planLimits: PlanLimitsService,
  ) {}

  @Post()
  @Roles('HOST')
  @ApiOperation({ summary: 'Create a subscription for a tenant' })
  create(@Body() body: CreateSubscriptionDto) {
    return this.subscriptionService.create(body);
  }

  @Get()
  @Roles('HOST')
  @ApiOperation({ summary: 'List all subscriptions (paginated & filterable)' })
  findAll(@Query() query: SubscriptionQueryDto) {
    return this.subscriptionService.findAll(query.page, query.limit, query.search, query.status, query.plan);
  }

  @Get('tenant/:tenantId')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get subscription by tenant ID' })
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.subscriptionService.findByTenant(tenantId);
  }

  @Put(':id')
  @Roles('HOST')
  @ApiOperation({ summary: 'Update subscription (plan, limits)' })
  update(@Param('id') id: string, @Body() body: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, body);
  }

  @Post(':id/cancel')
  @Roles('HOST')
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@Param('id') id: string) {
    return this.subscriptionService.cancel(id);
  }

  @Post(':id/change-plan')
  @Roles('HOST')
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(@Param('id') id: string, @Body() body: { plan: string }) {
    return this.subscriptionService.changePlan(id, body.plan);
  }

  @Get('platform/stats')
  @Roles('HOST')
  @ApiOperation({ summary: 'Get platform-wide subscription stats' })
  getPlatformStats() {
    return this.subscriptionService.getPlatformStats();
  }

  @Get('limits/:tenantId')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Check plan limits for tenant' })
  async getLimits(@Param('tenantId') tenantId: string) {
    const subscription = await this.subscriptionService.findByTenant(tenantId);
    const usage = await this.planLimits.getUsageStats(tenantId);
    return {
      plan: (subscription as any).plan,
      limits: {
        members: (subscription as any).maxMembers,
        campaigns: (subscription as any).maxCampaigns,
        rewards: (subscription as any).maxRewards,
        tiers: (subscription as any).maxTiers,
        vouchers: (subscription as any).maxVouchers,
        stores: (subscription as any).maxStores,
      },
      usage,
      features: (subscription as any).features,
    };
  }

  @Post('create-checkout-session')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create Stripe checkout session for subscription' })
  async createCheckoutSession(@Req() req: any, @Body() body: CreateCheckoutSessionDto) {
    const tenantId = req.tenantId;
    return this.subscriptionService.createCheckoutSession(tenantId, body.plan, body.successUrl, body.cancelUrl);
  }

  @Post('webhook')
  @Public()
  @SkipTenantCheck()
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    return this.subscriptionService.handleStripeWebhook(signature, rawBody);
  }

  @Post(':id/portal-session')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create Stripe customer portal session' })
  async createPortalSession(@Param('id') id: string, @Body() body: CreatePortalSessionDto) {
    return this.subscriptionService.createPortalSession(id, body.returnUrl);
  }
}
