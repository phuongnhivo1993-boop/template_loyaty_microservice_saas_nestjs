import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorCodes, ServiceException } from '../common/errors/error-codes';

const PLAN_LIMITS: Record<string, { members: number; campaigns: number; rewards: number; tiers: number; vouchers: number; stores: number; features: Record<string, boolean> }> = {
  FREE: { members: 100, campaigns: 2, rewards: 5, tiers: 3, vouchers: 50, stores: 1, features: { referral: false, gamification: false, apiAccess: false, customDomain: false, whiteLabel: false, advancedAnalytics: false } },
  STARTER: { members: 1000, campaigns: 10, rewards: 20, tiers: 5, vouchers: 500, stores: 3, features: { referral: true, gamification: false, apiAccess: true, customDomain: false, whiteLabel: false, advancedAnalytics: false } },
  PROFESSIONAL: { members: 10000, campaigns: 50, rewards: 100, tiers: 10, vouchers: 5000, stores: 10, features: { referral: true, gamification: true, apiAccess: true, customDomain: true, whiteLabel: false, advancedAnalytics: true } },
  ENTERPRISE: { members: 999999, campaigns: 999, rewards: 9999, tiers: 20, vouchers: 99999, stores: 999, features: { referral: true, gamification: true, apiAccess: true, customDomain: true, whiteLabel: true, advancedAnalytics: true } },
};

@Injectable()
export class PlanLimitsService {
  private readonly logger = new Logger(PlanLimitsService.name);
  constructor(private prisma: PrismaService) {}

  getPlanLimits(plan: string) {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
  }

  async checkLimit(tenantId: string, metric: string, currentCount: number): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!subscription || subscription.status === 'EXPIRED' || subscription.status === 'SUSPENDED') {
      throw new ServiceException('No active subscription', ErrorCodes.PLAN_LIMIT_EXCEEDED, 403);
    }
    const limits = this.getPlanLimits(subscription.plan);
    const limitMap: Record<string, number> = {
      members: limits.members,
      campaigns: limits.campaigns,
      rewards: limits.rewards,
      tiers: limits.tiers,
      vouchers: limits.vouchers,
      stores: limits.stores,
    };
    const max = limitMap[metric];
    if (max !== undefined && currentCount >= max) {
      throw new ServiceException(
        `${metric} limit reached (${max}). Please upgrade your plan.`,
        ErrorCodes.PLAN_LIMIT_EXCEEDED,
        403,
      );
    }
    return true;
  }

  async checkFeatureAccess(tenantId: string, feature: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!subscription) return false;
    const limits = this.getPlanLimits(subscription.plan);
    if (!limits.features[feature]) {
      throw new ServiceException(
        `Feature "${feature}" is not available on your plan. Please upgrade.`,
        ErrorCodes.PLAN_LIMIT_EXCEEDED,
        403,
      );
    }
    return true;
  }

  async recordUsage(tenantId: string, metric: string, value: number = 1): Promise<void> {
    try {
      await this.prisma.usageRecord.create({
        data: { tenantId, metric, value },
      });
    } catch (error) {
      this.logger.error(`Failed to record usage: ${metric} for tenant ${tenantId}`, error);
    }
  }

  async getUsageStats(tenantId: string) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const records = await this.prisma.usageRecord.groupBy({
      by: ['metric'],
      where: { tenantId, recordedAt: { gte: thirtyDaysAgo } },
      _sum: { value: true },
    });
    const stats: Record<string, number> = {};
    records.forEach((r) => { stats[r.metric] = r._sum.value || 0; });
    return stats;
  }
}
