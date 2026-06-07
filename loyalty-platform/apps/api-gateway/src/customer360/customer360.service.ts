import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Customer360Service {
  constructor(private prisma: PrismaService) {}

  async getUnifiedProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        tier: { select: { id: true, name: true, color: true, pointsMultiplier: true } },
        _count: { select: { orders: true, referralsGiven: true, dailyCheckins: true, pointTransactions: true } },
      },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async getSummary(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, fullName: true, email: true, phone: true, status: true, totalPoints: true, availablePoints: true, createdAt: true, tierId: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const [orders, points, vouchers, referrals] = await Promise.all([
      this.prisma.order.aggregate({ where: { memberId }, _sum: { total: true }, _count: true }),
      this.prisma.pointTransaction.aggregate({ where: { memberId, type: 'EARN' }, _sum: { amount: true } }),
      this.prisma.memberVoucher.count({ where: { memberId, redeemed: false } }),
      this.prisma.referral.count({ where: { referrerId: memberId, status: 'CONVERTED' } }),
    ]);
    const lastOrder = await this.prisma.order.findFirst({ where: { memberId }, orderBy: { createdAt: 'desc' } });
    const membershipDays = Math.floor((Date.now() - member.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: member.id,
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      status: member.status,
      totalPoints: member.totalPoints,
      availablePoints: member.availablePoints,
      membershipDays,
      totalSpent: orders._sum.total || 0,
      totalOrders: orders._count,
      totalEarnedPoints: points._sum.amount || 0,
      activeVouchers: vouchers,
      convertedReferrals: referrals,
      lastOrderDate: lastOrder?.createdAt || null,
      lastOrderAmount: lastOrder?.total || null,
    };
  }

  async getActivityTimeline(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId }, select: { id: true } });
    if (!member) throw new NotFoundException('Member not found');
    const [transactions, orders, referrals, checkins, redemptions] = await Promise.all([
      this.prisma.pointTransaction.findMany({ where: { memberId }, orderBy: { createdAt: 'desc' }, take: 50 }),
      this.prisma.order.findMany({ where: { memberId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.referral.findMany({ where: { referrerId: memberId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.dailyCheckin.findMany({ where: { memberId }, orderBy: { date: 'desc' }, take: 30 }),
      this.prisma.memberVoucher.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);
    const events: Array<{ type: string; description: string; date: Date; amount?: number; reference?: string }> = [];
    transactions.forEach((t) => events.push({ type: t.type === 'EARN' ? 'points_earned' : 'points_burned', description: `${t.type === 'EARN' ? 'Earned' : 'Burned'} ${t.amount} points${t.reason ? `: ${t.reason}` : ''}`, date: t.createdAt, amount: t.amount, reference: t.reference ?? undefined }));
    orders.forEach((o) => events.push({ type: 'order', description: `Order #${o.orderCode} - ${o.status} (${o.total.toLocaleString()} VND)`, date: o.createdAt, amount: o.total }));
    referrals.forEach((r) => events.push({ type: 'referral', description: `Referral ${r.code} - ${r.status}`, date: r.createdAt }));
    checkins.forEach((c) => events.push({ type: 'checkin' as const, description: `Daily check-in (streak: ${c.streak})`, date: c.date instanceof Date ? c.date : new Date(c.date) }));
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events.slice(0, 100);
  }
}
