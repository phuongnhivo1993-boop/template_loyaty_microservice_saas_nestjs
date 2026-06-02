import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId?: string) {
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

    return {
      tenants,
      members,
      activeCampaigns,
      rewards,
      vouchers,
      totalPoints: totalPoints._sum.totalPoints || 0,
      promotions,
      badges,
      missions,
      referrals,
      kycRate: members > 0 ? Math.round((kycCount / members) * 100) : 0,
      activeVouchers,
      membersByStatus: statusBreakdown,
      tiers: tiersWithMembers.map(t => ({ name: t.name, color: t.color, memberCount: t._count.members })),
    };
  }
}
