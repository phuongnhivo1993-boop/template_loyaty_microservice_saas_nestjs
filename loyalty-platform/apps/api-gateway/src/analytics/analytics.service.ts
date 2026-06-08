import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getPointsTrend(days: number, tenantId?: string) {
    const cacheKey = tenantId ? `analytics:points-trend:${tenantId}:${days}` : `analytics:points-trend:global:${days}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const transactions = await this.prisma.pointTransaction.findMany({
        where: {
          createdAt: { gte: since },
          ...(tenantId ? { member: { tenantId } } : {}),
        },
        orderBy: { createdAt: 'asc' },
        include: { member: { select: { tenantId: true } } },
      });
      const daily: Record<string, { earned: number; burned: number }> = {};
      for (const t of transactions) {
        const day = t.createdAt.toISOString().slice(0, 10);
        if (!daily[day]) daily[day] = { earned: 0, burned: 0 };
        if (t.amount > 0) daily[day].earned += t.amount;
        else daily[day].burned += Math.abs(t.amount);
      }
      const result = Object.entries(daily).map(([date, val]) => ({ date, ...val }));
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load points trend');
    }
  }

  async getMemberGrowth(days: number, tenantId?: string) {
    const cacheKey = tenantId ? `analytics:member-growth:${tenantId}:${days}` : `analytics:member-growth:global:${days}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const where = { createdAt: { gte: since }, ...(tenantId ? { tenantId } : {}) };
      const members = await this.prisma.member.findMany({ where, orderBy: { createdAt: 'asc' } });
      const daily: Record<string, number> = {};
      for (const m of members) {
        const day = m.createdAt.toISOString().slice(0, 10);
        daily[day] = (daily[day] || 0) + 1;
      }
      let cumulative = 0;
      const result = Object.entries(daily).map(([date, count]) => {
        cumulative += count;
        return { date, newMembers: count, totalMembers: cumulative };
      });
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load member growth');
    }
  }

  async getCampaignPerformance(tenantId?: string) {
    const cacheKey = tenantId ? `analytics:campaigns:${tenantId}` : 'analytics:campaigns:global';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const where = tenantId ? { tenantId } : {};
      const campaigns = await this.prisma.campaign.findMany({ where });
      const total = campaigns.length;
      const active = campaigns.filter(c => c.status === 'ACTIVE').length;
      const completed = campaigns.filter(c => c.status === 'ENDED').length;
      const result = { total, active, completed, draft: total - active - completed };
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load campaign performance');
    }
  }

  async getTopMembers(limit: number, tenantId?: string) {
    const cacheKey = tenantId ? `analytics:topmembers:${tenantId}:${limit}` : `analytics:topmembers:global:${limit}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const where = tenantId ? { tenantId } : {};
      const result = await this.prisma.member.findMany({
        where, orderBy: { totalPoints: 'desc' }, take: limit,
        include: { tier: { select: { name: true, color: true } } },
      });
      await this.cache.set(cacheKey, result, 120);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load top members');
    }
  }

  async getVoucherStats(tenantId?: string) {
    const cacheKey = tenantId ? `analytics:vouchers:${tenantId}` : 'analytics:vouchers:global';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const where = tenantId ? { tenantId } : {};
      const total = await this.prisma.voucher.count({ where });
      const used = await this.prisma.voucher.count({ where: { ...where, usedCount: { gt: 0 } } });
      const result = { total, used, remaining: total - used, usageRate: total > 0 ? ((used / total) * 100).toFixed(1) : '0' };
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load voucher stats');
    }
  }

  async getExpiringPoints(tenantId?: string) {
    const cacheKey = tenantId ? `analytics:expiring-points:${tenantId}` : 'analytics:expiring-points:global';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const where = tenantId ? { tenantId } : {};
      const members = await this.prisma.member.findMany({
        where: { ...where, availablePoints: { gt: 0 } },
        select: { id: true, fullName: true, email: true, availablePoints: true, totalPoints: true },
        orderBy: { availablePoints: 'desc' },
        take: 10,
      });

      const memberIds = members.map(m => m.id);
      const oldestEarns = await this.prisma.pointTransaction.groupBy({
        by: ['memberId'],
        where: { memberId: { in: memberIds }, type: 'EARN' },
        _min: { createdAt: true },
      });
      const expiryMap = new Map(oldestEarns.map(e => [e.memberId, e._min.createdAt]));

      const membersWithExpiry = members.map(m => {
        const oldestEarnDate = expiryMap.get(m.id) || null;
        return {
          ...m,
          oldestEarnDate,
          daysSinceOldestEarn: oldestEarnDate
            ? Math.floor((Date.now() - oldestEarnDate.getTime()) / (1000 * 60 * 60 * 24))
            : null,
        };
      });

      const result = membersWithExpiry.filter(m => m.daysSinceOldestEarn !== null && m.daysSinceOldestEarn > 300);
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load expiring points');
    }
  }

  async getLeaderboard(tenantId?: string, limit = 20) {
    const cacheKey = tenantId ? `analytics:leaderboard:${tenantId}:${limit}` : `analytics:leaderboard:global:${limit}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const where = tenantId ? { tenantId } : {};
      if (tenantId) where.tenantId = tenantId;
      const members = await this.prisma.member.findMany({
        where,
        orderBy: { totalPoints: 'desc' },
        take: limit,
        include: { tier: { select: { name: true, color: true } } },
      });
      const result = members.map((m, i) => ({
        rank: i + 1,
        id: m.id,
        fullName: m.fullName,
        email: m.email,
        totalPoints: m.totalPoints,
        availablePoints: m.availablePoints,
        tier: m.tier?.name || 'Bronze',
        tierColor: m.tier?.color || '#94a3b8',
      }));
      await this.cache.set(cacheKey, result, 120);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load leaderboard');
    }
  }

  async getVoucherAnalytics(days = 30, tenantId?: string) {
    const cacheKey = tenantId ? `analytics:voucher-analytics:${tenantId}:${days}` : `analytics:voucher-analytics:global:${days}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const memberVoucherWhere: any = { redeemedAt: { gte: since } };
      if (tenantId) memberVoucherWhere.member = { tenantId };

      const redemptions = await this.prisma.memberVoucher.findMany({
        where: memberVoucherWhere,
        include: { voucher: { select: { code: true, type: true, value: true } } },
        orderBy: { redeemedAt: 'asc' },
      });

      const daily: Record<string, number> = {};
      const typeCount: Record<string, number> = {};
      const popular: Record<string, { code: string; count: number; value: number }> = {};

      for (const r of redemptions) {
        const day = r.redeemedAt!.toISOString().slice(0, 10);
        daily[day] = (daily[day] || 0) + 1;
        typeCount[r.voucher.type] = (typeCount[r.voucher.type] || 0) + 1;
        const key = r.voucher.code;
        if (!popular[key]) popular[key] = { code: key, count: 0, value: r.voucher.value };
        popular[key].count++;
      }

      const result = {
        totalRedemptions: redemptions.length,
        dailyTrend: Object.entries(daily).map(([date, count]) => ({ date, count })),
        byType: Object.entries(typeCount).map(([type, count]) => ({ type, count })),
        popular: Object.values(popular).sort((a, b) => b.count - a.count).slice(0, 10),
      };
      await this.cache.set(cacheKey, result, 180);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Failed to load voucher analytics');
    }
  }
}
