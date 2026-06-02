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
}
