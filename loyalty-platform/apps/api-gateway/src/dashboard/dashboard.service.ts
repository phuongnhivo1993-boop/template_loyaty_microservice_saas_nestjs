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
      tiersWithMembers,
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
    ]);

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
      tiers: tiersWithMembers.map(t => ({ name: t.name, color: t.color, memberCount: t._count.members })),
    };
  }
}
