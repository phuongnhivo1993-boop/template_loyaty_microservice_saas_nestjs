import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId?: string) {
    try {
      const tenantFilter = tenantId ? { tenantId } : {};
      const [
        tenants, members, activeCampaigns, rewards, vouchers,
        totalPoints, promotions, badges, missions, referrals,
        tiersWithMembers, membersByStatus, kycCount, activeVouchers,
      ] = await Promise.all([
        this.prisma.tenant.count(),
        this.prisma.member.count({ where: tenantId ? { tenantId } : {} }),
        this.prisma.campaign.count({ where: { ...tenantFilter, status: 'ACTIVE' } }),
        this.prisma.reward.count({ where: tenantFilter }),
        this.prisma.voucher.count({ where: tenantFilter }),
        this.prisma.member.aggregate({ where: tenantFilter, _sum: { totalPoints: true } }),
        this.prisma.promotion.count({ where: tenantFilter }),
        this.prisma.badge.count({ where: tenantFilter }),
        this.prisma.mission.count({ where: tenantFilter }),
        this.prisma.referral.count({ where: tenantFilter }),
        this.prisma.tier.findMany({
          where: tenantFilter,
          include: { _count: { select: { members: true } } },
          orderBy: { minPoints: 'asc' },
        }),
        this.prisma.member.groupBy({ by: ['status'], where: tenantFilter, _count: true }),
        this.prisma.member.count({ where: { ...tenantFilter, kycVerified: true } }),
        this.prisma.memberVoucher.count({ where: { redeemed: false, ...(tenantId ? { member: { tenantId } } : {}) } }),
      ]);

      const statusBreakdown = membersByStatus.reduce((acc, cur) => {
        acc[cur.status] = cur._count;
        return acc;
      }, {} as Record<string, number>);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ptWhere = { createdAt: { gte: today }, ...(tenantId ? { member: { tenantId } } : {}) };
      const [earnedToday, burnedToday, newMembersToday, redeemedToday] = await Promise.all([
        this.prisma.pointTransaction.aggregate({
          where: { ...ptWhere, amount: { gt: 0 } },
          _sum: { amount: true },
        }),
        this.prisma.pointTransaction.aggregate({
          where: { ...ptWhere, amount: { lt: 0 } },
          _sum: { amount: true },
        }),
        this.prisma.member.count({
          where: { createdAt: { gte: today }, ...(tenantId ? { tenantId } : {}) },
        }),
        this.prisma.memberVoucher.count({
          where: { redeemedAt: { gte: today }, ...(tenantId ? { member: { tenantId } } : {}) },
        }),
      ]);

      return {
        tenants, members, activeCampaigns, rewards, vouchers,
        totalPoints: totalPoints._sum.totalPoints || 0,
        promotions, badges, missions, referrals,
        kycRate: members > 0 ? Math.round((kycCount / members) * 100) : 0,
        activeVouchers,
        membersByStatus: statusBreakdown,
        tiers: tiersWithMembers.map(t => ({ name: t.name, color: t.color, memberCount: t._count.members })),
        today: {
          earned: earnedToday._sum.amount || 0,
          burned: Math.abs(burnedToday._sum.amount || 0),
          newMembers: newMembersToday,
          redemptions: redeemedToday,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException('Failed to load dashboard stats');
    }
  }
}
