import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class Customer360ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getUnifiedProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        tier: true,
        tenant: { select: { id: true, name: true, domain: true } },
        pointTransactions: { orderBy: { createdAt: 'desc' }, take: 50 },
        memberVouchers: { include: { voucher: true }, orderBy: { createdAt: 'desc' }, take: 20 },
        referralsGiven: { include: { referee: { select: { id: true, fullName: true, email: true } } }, take: 10 },
        referralsReceived: { include: { referrer: { select: { id: true, fullName: true, email: true } } }, take: 10 },
        dailyCheckins: { orderBy: { date: 'desc' }, take: 30 },
        feedback: { orderBy: { createdAt: 'desc' }, take: 10 },
        cashbackTransactions: { orderBy: { createdAt: 'desc' }, take: 20 },
        memberGiftCards: { include: { giftCard: true }, take: 10 },
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    const badges = await this.prisma.badge.findMany({
      where: { tenant: { members: { some: { id: memberId } } } },
    });
    const missions = await this.prisma.mission.findMany({
      where: { tenantId: member.tenantId },
    });

    const { password, ...safeMember } = member;
    return { ...safeMember, badges, missions };
  }

  async getActivityTimeline(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, tenantId: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const [transactions, vouchers, checkins, feedback, referrals] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.memberVoucher.findMany({
        where: { memberId },
        include: { voucher: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.dailyCheckin.findMany({
        where: { memberId },
        orderBy: { date: 'desc' },
        take: 50,
      }),
      this.prisma.memberFeedback.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.referral.findMany({
        where: { OR: [{ referrerId: memberId }, { refereeId: memberId }] },
        include: {
          referrer: { select: { id: true, fullName: true } },
          referee: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    const timeline: Array<{
      type: string;
      description: string;
      timestamp: Date;
      data?: any;
    }> = [];

    for (const tx of transactions) {
      timeline.push({
        type: 'point_transaction',
        description: `${tx.type === 'EARN' ? 'Earned' : 'Burned'} ${tx.amount} points${tx.reason ? ` (${tx.reason})` : ''}`,
        timestamp: tx.createdAt,
        data: tx,
      });
    }
    for (const mv of vouchers) {
      timeline.push({
        type: mv.redeemed ? 'voucher_redeemed' : 'voucher_issued',
        description: `${mv.redeemed ? 'Redeemed' : 'Received'} voucher ${mv.voucher.code}`,
        timestamp: mv.redeemedAt || mv.createdAt,
        data: mv,
      });
    }
    for (const dc of checkins) {
      timeline.push({
        type: 'daily_checkin',
        description: `Checked in (streak: ${dc.streak}, +${dc.pointsAwarded} pts)`,
        timestamp: dc.date,
        data: dc,
      });
    }
    for (const fb of feedback) {
      timeline.push({
        type: 'feedback',
        description: `Left ${fb.rating}/5 rating on ${fb.entityType}`,
        timestamp: fb.createdAt,
        data: fb,
      });
    }
    for (const ref of referrals) {
      const isReferrer = ref.referrerId === memberId;
      timeline.push({
        type: 'referral',
        description: `${isReferrer ? 'Referred' : 'Was referred by'} ${isReferrer ? ref.referee?.fullName || 'someone' : ref.referrer.fullName}`,
        timestamp: ref.createdAt,
        data: ref,
      });
    }

    timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return timeline;
  }

  async getMemberSegments(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const segments: string[] = [];

    if (member.tags && member.tags.length > 0) segments.push(...member.tags);

    if (member.totalPoints > 10000) segments.push('high_value');
    else if (member.totalPoints > 5000) segments.push('medium_value');
    else if (member.totalPoints > 0) segments.push('low_value');
    else segments.push('inactive');

    if (member.tier) segments.push(`tier:${member.tier.name.toLowerCase()}`);

    if (member.kycVerified) segments.push('kyc_verified');

    const now = new Date();
    const daysSinceJoin = Math.floor((now.getTime() - member.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceJoin > 365) segments.push('loyal_member');
    else if (daysSinceJoin > 180) segments.push('established');
    else if (daysSinceJoin > 30) segments.push('active_new');
    else segments.push('new_member');

    const recentActivity = await this.prisma.pointTransaction.count({
      where: { memberId, createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
    });
    if (recentActivity === 0) segments.push('dormant');
    else if (recentActivity > 10) segments.push('highly_active');

    return { memberId, fullName: member.fullName, email: member.email, segments, tags: member.tags };
  }
}
