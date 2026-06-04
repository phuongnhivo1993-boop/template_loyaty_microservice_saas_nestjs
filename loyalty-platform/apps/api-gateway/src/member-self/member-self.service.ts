import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberSelfService {
  private readonly saltRounds = 12;

  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const { password: _, ...data } = member;
    return data;
  }

  async getWallet(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const transactions = await this.prisma.pointTransaction.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      tier: member.tier?.name || 'N/A',
      totalPoints: member.totalPoints,
      availablePoints: member.availablePoints,
      recentTransactions: transactions,
    };
  }

  async setPassword(memberId: string, password: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException('Member not found');
    if (member.password)
      throw new BadRequestException(
        'Password already set. Use change-password instead.',
      );
    await this.prisma.member.update({
      where: { id: memberId },
      data: { password: await this.hashPassword(password) },
    });
    return { message: 'Password set successfully' };
  }

  async changePassword(
    memberId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException('Member not found');
    if (!member.password)
      throw new BadRequestException('No password set. Use set-password first.');
    if (!(await this.comparePassword(oldPassword, member.password))) {
      throw new BadRequestException('Current password is incorrect');
    }
    await this.prisma.member.update({
      where: { id: memberId },
      data: { password: await this.hashPassword(newPassword) },
    });
    return { message: 'Password changed successfully' };
  }

  async getBadges(memberId: string) {
    const badges = await this.prisma.badge.findMany({
      where: { tenant: { members: { some: { id: memberId } } } },
    });
    return badges;
  }

  async getReferrals(memberId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: memberId },
      include: { referee: true },
      orderBy: { createdAt: 'desc' },
    });
    const total = referrals.length;
    const converted = referrals.filter((r) => r.status === 'CONVERTED').length;
    return {
      referralCode: `REF-${memberId.slice(0, 8)}`,
      total,
      converted,
      rate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
      referrals,
    };
  }

  async getVouchers(memberId: string) {
    const vouchers = await this.prisma.memberVoucher.findMany({
      where: { memberId },
      include: { voucher: true },
      orderBy: { createdAt: 'desc' },
    });
    return vouchers;
  }

  async getMissions(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { tenantId: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const missions = await this.prisma.mission.findMany({
      where: { tenantId: member.tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return missions;
  }

  async getNotifications(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { tenantId: true, email: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const notifications = await this.prisma.notificationLog.findMany({
      where: {
        tenantId: member.tenantId,
        OR: [
          { recipient: member.email },
          { recipient: memberId },
        ],
      },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
    return notifications;
  }

  async getTierProgress(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const currentTier = member.tier as any;
    const allTiers = await this.prisma.tier.findMany({
      where: { tenantId: member.tenantId },
      orderBy: { minPoints: 'asc' },
    });
    const currentIndex = allTiers.findIndex(t => t.id === currentTier?.id);
    const nextTier = currentIndex >= 0 && currentIndex < allTiers.length - 1 ? allTiers[currentIndex + 1] : null;
    const progress = nextTier
      ? Math.min(100, Math.max(0, ((member.availablePoints - (currentTier?.minPoints || 0)) / (nextTier.minPoints - (currentTier?.minPoints || 0))) * 100))
      : 100;
    return {
      currentTier: currentTier ? { id: currentTier.id, name: currentTier.name, minPoints: currentTier.minPoints, color: currentTier.color } : null,
      nextTier: nextTier ? { id: nextTier.id, name: nextTier.name, minPoints: nextTier.minPoints, color: nextTier.color } : null,
      currentPoints: member.availablePoints,
      progress: Math.round(progress),
      pointsToNext: nextTier ? Math.max(0, nextTier.minPoints - member.availablePoints) : 0,
      allTiers: allTiers.map(t => ({ id: t.id, name: t.name, minPoints: t.minPoints, color: t.color })),
    };
  }

  async updateProfile(memberId: string, data: { fullName?: string; phone?: string }) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException('Member not found');
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    const updated = await this.prisma.member.update({
      where: { id: memberId },
      data: updateData,
    });
    const { password: _, ...result } = updated;
    return result;
  }

  async cartRedeem(memberId: string, items: { rewardId: string; quantity: number }[]) {
    if (!items.length) throw new BadRequestException('Cart is empty');

    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const rewardIds = items.map(i => i.rewardId);
    const rewards = await this.prisma.reward.findMany({ where: { id: { in: rewardIds } } });
    const rewardMap = new Map(rewards.map(r => [r.id, r]));

    let totalPoints = 0;
    const voucherEntries: { code: string; type: string; value: number; tenantId: string; expiresAt: Date }[] = [];

    for (const item of items) {
      const reward = rewardMap.get(item.rewardId);
      if (!reward) throw new NotFoundException(`Reward ${item.rewardId} not found`);
      if (reward.quantity < item.quantity) throw new BadRequestException(`Reward "${reward.name}" out of stock`);
      const points = reward.pointsRequired * item.quantity;
      totalPoints += points;
      for (let i = 0; i < item.quantity; i++) {
        voucherEntries.push({
          code: `CRT-${reward.id.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}-${i}`,
          type: reward.type,
          value: reward.pointsRequired,
          tenantId: member.tenantId,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        });
      }
    }

    if (member.availablePoints < totalPoints) {
      throw new BadRequestException(`Insufficient points. Need ${totalPoints}, have ${member.availablePoints}`);
    }

    const createdVouchers = await this.prisma.$transaction(async (tx) => {
      await tx.pointTransaction.create({
        data: {
          memberId,
          type: 'BURN',
          amount: -totalPoints,
          balance: member.availablePoints - totalPoints,
          reason: `Cart redemption: ${items.map(i => {
            const r = rewardMap.get(i.rewardId);
            return `${r?.name} x${i.quantity}`;
          }).join(', ')}`,
        },
      });

      await tx.member.update({
        where: { id: memberId },
        data: { availablePoints: { decrement: totalPoints } },
      });

      for (const item of items) {
        await tx.reward.update({
          where: { id: item.rewardId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      const vouchers = await Promise.all(
        voucherEntries.map(v => tx.voucher.create({ data: v }))
      );

      await Promise.all(
        vouchers.map(v => tx.memberVoucher.create({
          data: {
            memberId,
            voucherId: v.id,
            qrCode: `QR-${v.id.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`,
          },
        }))
      );

      return vouchers;
    });

    return {
      vouchers: createdVouchers,
      totalPointsUsed: totalPoints,
      items: items.map(i => ({ rewardId: i.rewardId, quantity: i.quantity })),
    };
  }

  async getTransactions(memberId: string, page = 1, limit = 50, type?: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const where: any = { memberId };
    if (type === 'earned') where.amount = { gt: 0 };
    else if (type === 'burned') where.amount = { lt: 0 };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.pointTransaction.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCashback(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const aggregation = await this.prisma.cashbackTransaction.aggregate({
      where: { memberId },
      _sum: { amount: true },
    });

    const transactions = await this.prisma.cashbackTransaction.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { balance: aggregation._sum.amount || 0, transactions };
  }

  async getGiftCards(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.memberGiftCard.findMany({
      where: { memberId },
      include: { giftCard: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStores(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId }, select: { tenantId: true } });
    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.store.findMany({
      where: { tenantId: member.tenantId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });
  }

  async createFeedback(memberId: string, data: { entityType: string; entityId: string; rating: number; content?: string }) {
    return this.prisma.memberFeedback.create({ data: { ...data, memberId } });
  }

  async getOrders(memberId: string, status?: string, page = 1, limit = 20) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const where: any = { memberId };
    if (status) where.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { items: true, store: { select: { name: true } } },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFeedback(memberId: string) {
    return this.prisma.memberFeedback.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
