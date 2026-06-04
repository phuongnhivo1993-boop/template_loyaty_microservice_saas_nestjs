import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanLimitsService } from './plan-limits.service';
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
}
