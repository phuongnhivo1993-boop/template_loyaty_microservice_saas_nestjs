import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanLimitsService } from './plan-limits.service';
import { StripeService } from './stripe.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

const PLAN_CONFIGS: Record<string, { members: number; campaigns: number; rewards: number; tiers: number; vouchers: number; stores: number; features: Record<string, boolean> }> = {
  FREE: { members: 100, campaigns: 2, rewards: 5, tiers: 3, vouchers: 50, stores: 1, features: { referral: false, gamification: false, apiAccess: false, customDomain: false, whiteLabel: false, advancedAnalytics: false } },
  STARTER: { members: 1000, campaigns: 10, rewards: 20, tiers: 5, vouchers: 500, stores: 3, features: { referral: true, gamification: false, apiAccess: true, customDomain: false, whiteLabel: false, advancedAnalytics: false } },
  PROFESSIONAL: { members: 10000, campaigns: 50, rewards: 100, tiers: 10, vouchers: 5000, stores: 10, features: { referral: true, gamification: true, apiAccess: true, customDomain: true, whiteLabel: false, advancedAnalytics: true } },
  ENTERPRISE: { members: 999999, campaigns: 999, rewards: 9999, tiers: 20, vouchers: 99999, stores: 999, features: { referral: true, gamification: true, apiAccess: true, customDomain: true, whiteLabel: true, advancedAnalytics: true } },
};

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(
    private prisma: PrismaService,
    private planLimits: PlanLimitsService,
    private stripeService: StripeService,
  ) {}

  async create(data: CreateSubscriptionDto) {
    const config = PLAN_CONFIGS[data.plan] || PLAN_CONFIGS.FREE;
    const subscription = await this.prisma.subscription.create({
      data: {
        tenantId: data.tenantId,
        plan: data.plan as any,
        status: 'TRIAL',
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        autoRenew: data.autoRenew ?? true,
        maxMembers: config.members,
        maxCampaigns: config.campaigns,
        maxRewards: config.rewards,
        maxTiers: config.tiers,
        maxVouchers: config.vouchers,
        maxStores: config.stores,
        features: config.features,
      },
    });
    this.logger.log(`Subscription created: ${subscription.id} for tenant ${data.tenantId}`);
    return subscription;
  }

  async findByTenant(tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!subscription) throw new NotFoundException('Subscription not found');
    const usage = await this.planLimits.getUsageStats(tenantId);
    const daysLeft = subscription.trialEndDate
      ? Math.max(0, Math.ceil((subscription.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;
    return { ...subscription, usage, daysLeft };
  }

  async findAll(page = 1, limit = 20, search?: string, status?: string, plan?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;
    if (search) {
      where.tenant = { name: { contains: search, mode: 'insensitive' } };
    }
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: { tenant: { select: { id: true, name: true, domain: true, status: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, data: UpdateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscription not found');
    const updateData: any = {};
    if (data.plan) {
      const config = PLAN_CONFIGS[data.plan];
      if (config) {
        updateData.plan = data.plan;
        updateData.maxMembers = config.members;
        updateData.maxCampaigns = config.campaigns;
        updateData.maxRewards = config.rewards;
        updateData.maxTiers = config.tiers;
        updateData.maxVouchers = config.vouchers;
        updateData.maxStores = config.stores;
        updateData.features = config.features;
      }
    }
    if (data.autoRenew !== undefined) updateData.autoRenew = data.autoRenew;
    if (data.maxMembers !== undefined) updateData.maxMembers = data.maxMembers;
    if (data.maxCampaigns !== undefined) updateData.maxCampaigns = data.maxCampaigns;
    if (data.maxRewards !== undefined) updateData.maxRewards = data.maxRewards;
    if (data.maxTiers !== undefined) updateData.maxTiers = data.maxTiers;
    if (data.maxVouchers !== undefined) updateData.maxVouchers = data.maxVouchers;
    if (data.maxStores !== undefined) updateData.maxStores = data.maxStores;
    if (data.features) updateData.features = { ...((existing.features as any) || {}), ...data.features };
    const subscription = await this.prisma.subscription.update({ where: { id }, data: updateData });
    this.logger.log(`Subscription updated: ${id} plan=${data.plan || existing.plan}`);
    return subscription;
  }

  async cancel(id: string) {
    const existing = await this.prisma.subscription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscription not found');
    const subscription = await this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED', autoRenew: false },
    });
    this.logger.log(`Subscription cancelled: ${id}`);
    return subscription;
  }

  async changePlan(id: string, newPlan: string) {
    return this.update(id, { plan: newPlan as any });
  }

  async getPlatformStats() {
    const [totalTenants, activeSubscriptions, trialSubscriptions, totalRevenue] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.subscription.count({ where: { status: 'TRIAL' } }),
      this.prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    ]);
    const planDistribution = await this.prisma.subscription.groupBy({
      by: ['plan'],
      _count: true,
    });
    return {
      totalTenants,
      activeSubscriptions,
      trialSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      planDistribution: planDistribution.map((p) => ({ plan: p.plan, count: p._count })),
    };
  }

  async createCheckoutSession(tenantId: string, plan: string, successUrl: string, cancelUrl: string) {
    const session = await this.stripeService.createCheckoutSession(tenantId, plan, successUrl, cancelUrl);
    this.logger.log(`Checkout session initiated: tenant=${tenantId} plan=${plan} session=${session.id}`);
    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(tenantId: string, returnUrl: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!subscription) throw new NotFoundException('Subscription not found');
    const customerId = subscription.stripeCustomerId;
    if (!customerId) {
      throw new NotFoundException('No Stripe customer found for this subscription');
    }
    const session = await this.stripeService.createPortalSession(customerId, returnUrl);
    this.logger.log(`Portal session created: tenant=${tenantId} session=${session.id}`);
    return { url: session.url };
  }

  async handleStripeWebhook(signature: string, payload: Buffer | string) {
    const event = await this.stripeService.handleWebhook(signature, payload);
    this.logger.log(`Processing webhook event: ${event.type} [${event.id}]`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await this.handleCheckoutCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await this.handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as any;
        await this.handleInvoicePaid(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await this.handleInvoicePaymentFailed(invoice);
        break;
      }
      default:
        this.logger.log(`Unhandled webhook event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: any) {
    const tenantId = session.metadata?.tenantId;
    const plan = session.metadata?.plan;
    if (!tenantId || !plan) {
      this.logger.warn(`Missing metadata on checkout session: ${session.id}`);
      return;
    }

    const config = PLAN_CONFIGS[plan] || PLAN_CONFIGS.FREE;
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status: 'ACTIVE',
        plan: plan as any,
        startDate: new Date(),
        endDate,
        maxMembers: config.members,
        maxCampaigns: config.campaigns,
        maxRewards: config.rewards,
        maxTiers: config.tiers,
        maxVouchers: config.vouchers,
        maxStores: config.stores,
        features: config.features,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      },
    });

    this.logger.log(`Subscription activated via Stripe: tenant=${tenantId} plan=${plan} session=${session.id}`);
  }

  private async handleSubscriptionUpdated(subscription: any) {
    const metadata = subscription.metadata || {};
    const tenantId = metadata.tenantId;
    if (!tenantId) {
      this.logger.warn(`No tenantId in subscription metadata: ${subscription.id}`);
      return;
    }

    if (subscription.status === 'active') {
      const existing = await this.prisma.subscription.findUnique({ where: { tenantId } });
      if (!existing) {
        this.logger.warn(`No subscription found for tenant: ${tenantId}`);
        return;
      }

      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined;

      await this.prisma.subscription.update({
        where: { tenantId },
        data: {
          status: 'ACTIVE',
          endDate: currentPeriodEnd,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
        },
      });
      this.logger.log(`Stripe subscription updated: ${subscription.id} tenant=${tenantId}`);
    }
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const metadata = subscription.metadata || {};
    const tenantId = metadata.tenantId;
    if (!tenantId) {
      this.logger.warn(`No tenantId in deleted subscription metadata: ${subscription.id}`);
      return;
    }

    await this.prisma.subscription.update({
      where: { tenantId },
      data: { status: 'CANCELLED', autoRenew: false },
    });
    this.logger.log(`Subscription cancelled via Stripe: tenant=${tenantId} stripeSub=${subscription.id}`);
  }

  private async handleInvoicePaid(invoice: any) {
    const stripeSubId = invoice.subscription;
    if (!stripeSubId) {
      this.logger.warn(`Invoice ${invoice.id} has no associated subscription`);
      return;
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubId },
    });

    if (!subscription) {
      this.logger.warn(`No local subscription found for Stripe subscription: ${stripeSubId}`);
      return;
    }

    await this.prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency?.toUpperCase() || 'USD',
        status: 'PAID',
        paymentMethod: 'stripe',
        paidAt: new Date(),
        dueDate: new Date(),
        description: `Stripe invoice ${invoice.id}`,
        metadata: { stripeInvoiceId: invoice.id, stripeSubscriptionId: stripeSubId },
      },
    });

    this.logger.log(`Invoice recorded: stripeInvoice=${invoice.id} amount=${invoice.amount_paid / 100} ${invoice.currency}`);
  }

  private async handleInvoicePaymentFailed(invoice: any) {
    const stripeSubId = invoice.subscription;
    if (!stripeSubId) return;

    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubId },
    });

    if (!subscription) return;

    await this.prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        amount: invoice.amount_due / 100,
        currency: invoice.currency?.toUpperCase() || 'USD',
        status: 'FAILED',
        paymentMethod: 'stripe',
        dueDate: new Date(),
        description: `Failed Stripe invoice ${invoice.id}`,
        metadata: { stripeInvoiceId: invoice.id, stripeSubscriptionId: stripeSubId, failed: true },
      },
    });

    this.logger.warn(`Invoice payment failed: stripeInvoice=${invoice.id} subscription=${stripeSubId}`);
  }
}
