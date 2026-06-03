import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AnalyticsServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(tenantId: string) {
    const [
      totalMembers,
      activeMembers,
      totalPoints,
      totalEarned,
      totalBurned,
      totalCampaigns,
      totalVouchers,
      redeemedVouchers,
    ] = await Promise.all([
      this.prisma.member.count({ where: { tenantId } }),
      this.prisma.member.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.member.aggregate({ where: { tenantId }, _sum: { totalPoints: true } }),
      this.prisma.pointTransaction.aggregate({
        where: { member: { tenantId }, type: 'EARN' },
        _sum: { amount: true },
      }),
      this.prisma.pointTransaction.aggregate({
        where: { member: { tenantId }, type: 'BURN' },
        _sum: { amount: true },
      }),
      this.prisma.campaign.count({ where: { tenantId } }),
      this.prisma.voucher.count({ where: { tenantId } }),
      this.prisma.memberVoucher.count({
        where: { voucher: { tenantId }, redeemed: true },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      totalPoints: totalPoints._sum.totalPoints || 0,
      totalEarnedPoints: totalEarned._sum.amount || 0,
      totalBurnedPoints: totalBurned._sum.amount || 0,
      totalCampaigns,
      totalVouchers,
      redeemedVouchers,
    };
  }

  async getPointsTrend(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const transactions = await this.prisma.pointTransaction.findMany({
      where: { member: { tenantId }, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      select: { type: true, amount: true, createdAt: true },
    });

    const trend: Record<string, { date: string; earned: number; burned: number }> = {};
    for (const tx of transactions) {
      const dateKey = tx.createdAt.toISOString().slice(0, 10);
      if (!trend[dateKey]) trend[dateKey] = { date: dateKey, earned: 0, burned: 0 };
      if (tx.type === 'EARN') trend[dateKey].earned += tx.amount;
      else if (tx.type === 'BURN') trend[dateKey].burned += tx.amount;
    }
    return Object.values(trend).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getMemberGrowth(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const members = await this.prisma.member.findMany({
      where: { tenantId, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    const growth: Record<string, { date: string; count: number }> = {};
    for (const m of members) {
      const dateKey = m.createdAt.toISOString().slice(0, 10);
      if (!growth[dateKey]) growth[dateKey] = { date: dateKey, count: 0 };
      growth[dateKey].count++;
    }
    return Object.values(growth).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopMembers(tenantId: string, limit = 10) {
    return this.prisma.member.findMany({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { totalPoints: 'desc' },
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        totalPoints: true,
        availablePoints: true,
        tier: { select: { name: true, color: true } },
        createdAt: true,
      },
    });
  }

  async getVoucherStats(tenantId: string) {
    const [totalVouchers, totalRedeemed, byType, redeemedByDay] = await Promise.all([
      this.prisma.voucher.count({ where: { tenantId } }),
      this.prisma.memberVoucher.count({
        where: { voucher: { tenantId }, redeemed: true },
      }),
      this.prisma.voucher.groupBy({
        by: ['type'],
        where: { tenantId },
        _count: { id: true },
      }),
      this.prisma.memberVoucher.findMany({
        where: { voucher: { tenantId }, redeemed: true },
        select: { redeemedAt: true },
        orderBy: { redeemedAt: 'asc' },
      }),
    ]);

    const dailyRedemption: Record<string, { date: string; count: number }> = {};
    for (const rv of redeemedByDay) {
      if (rv.redeemedAt) {
        const dateKey = rv.redeemedAt.toISOString().slice(0, 10);
        if (!dailyRedemption[dateKey]) dailyRedemption[dateKey] = { date: dateKey, count: 0 };
        dailyRedemption[dateKey].count++;
      }
    }

    return {
      totalVouchers,
      totalRedeemed,
      redemptionRate: totalVouchers > 0 ? (totalRedeemed / totalVouchers) * 100 : 0,
      byType,
      dailyRedemption: Object.values(dailyRedemption).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }
}
