import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPointsTrend(days: number, tenantId?: string) {
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
      return Object.entries(daily).map(([date, val]) => ({ date, ...val }));
    } catch (e) {
      throw new InternalServerErrorException('Failed to load points trend');
    }
  }

  async getMemberGrowth(days: number, tenantId?: string) {
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
      return Object.entries(daily).map(([date, count]) => {
        cumulative += count;
        return { date, newMembers: count, totalMembers: cumulative };
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to load member growth');
    }
  }

  async getCampaignPerformance(tenantId?: string) {
    try {
      const where = tenantId ? { tenantId } : {};
      const campaigns = await this.prisma.campaign.findMany({ where });
      const total = campaigns.length;
      const active = campaigns.filter(c => c.status === 'ACTIVE').length;
      const completed = campaigns.filter(c => c.status === 'ENDED').length;
      return { total, active, completed, draft: total - active - completed };
    } catch (e) {
      throw new InternalServerErrorException('Failed to load campaign performance');
    }
  }

  async getTopMembers(limit: number, tenantId?: string) {
    try {
      const where = tenantId ? { tenantId } : {};
      return this.prisma.member.findMany({
        where, orderBy: { totalPoints: 'desc' }, take: limit,
        include: { tier: { select: { name: true, color: true } } },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to load top members');
    }
  }

  async getVoucherStats(tenantId?: string) {
    try {
      const where = tenantId ? { tenantId } : {};
      const total = await this.prisma.voucher.count({ where });
      const used = await this.prisma.voucher.count({ where: { ...where, usedCount: { gt: 0 } } });
      return { total, used, remaining: total - used, usageRate: total > 0 ? ((used / total) * 100).toFixed(1) : '0' };
    } catch (e) {
      throw new InternalServerErrorException('Failed to load voucher stats');
    }
  }
}
