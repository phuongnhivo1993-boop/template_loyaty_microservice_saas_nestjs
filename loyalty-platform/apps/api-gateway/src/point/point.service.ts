import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationTriggerService } from '../common/services/notification-trigger.service';

@Injectable()
export class PointService {
  constructor(
    private prisma: PrismaService,
    private notificationTrigger: NotificationTriggerService,
  ) {}

  async getWallet(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    return {
      available: member.availablePoints,
      total: member.totalPoints,
      memberId: member.id,
    };
  }

  async earn(memberId: string, amount: number, reason?: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const multiplier = member.tier?.pointsMultiplier ?? 1.0;
    const finalAmount = Math.round(amount * multiplier);
    const newTotal = member.totalPoints + finalAmount;

    const [transaction] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'EARN',
          amount: finalAmount,
          balance: member.availablePoints + finalAmount,
          reason: reason ? `${reason} (x${multiplier})` : undefined,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: {
          totalPoints: { increment: finalAmount },
          availablePoints: { increment: finalAmount },
        },
      }),
    ]);

    const oldTierId = member.tierId;
    await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
    const updatedMember = await this.prisma.member.findUnique({ where: { id: memberId }, include: { tier: true } });
    if (updatedMember?.tierId && updatedMember.tierId !== oldTierId && updatedMember.tier) {
      const oldTierName = member.tier?.name || 'Unknown';
      this.notificationTrigger.sendTierChanged(memberId, oldTierName, updatedMember.tier.name);
    }
    this.notificationTrigger.sendPointsEarned(memberId, finalAmount, reason);
    return transaction;
  }

  private async maybeUpgradeTier(memberId: string, tenantId: string, totalPoints: number) {
    const tiers = await this.prisma.tier.findMany({
      where: { tenantId, minPoints: { lte: totalPoints }, maxPoints: { gte: totalPoints } },
      orderBy: { minPoints: 'desc' },
      take: 1,
    });
    if (tiers.length > 0) {
      const member = await this.prisma.member.findUnique({ where: { id: memberId } });
      if (member && member.tierId !== tiers[0].id) {
        await this.prisma.member.update({
          where: { id: memberId },
          data: { tierId: tiers[0].id },
        });
      }
    }
  }

  async burn(memberId: string, amount: number, reason?: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.availablePoints < amount) {
      throw new BadRequestException('Insufficient points');
    }

    const [transaction] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'BURN',
          amount: -amount,
          balance: member.availablePoints - amount,
          reason,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: { availablePoints: { decrement: amount } },
      }),
    ]);
    return transaction;
  }

  async getTransaction(id: string) {
    const transaction = await this.prisma.pointTransaction.findUnique({
      where: { id },
      include: { member: { select: { id: true, fullName: true, email: true } } },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async getTransactions(memberId?: string, page = 1, limit = 20, type?: string, tenantId?: string, search?: string, sort?: string) {
    const where: any = {};
    if (memberId) where.memberId = memberId;
    if (type) where.type = type;
    if (tenantId) {
      where.member = { tenantId };
    }
    if (search) {
      where.OR = [
        { reason: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    const orderBy = sort ? { [sort.split(':')[0]]: (sort.split(':')[1] || 'desc') } : { createdAt: 'desc' as const };
    const [data, total] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where,
        orderBy: orderBy as any,
        skip,
        take: limit,
        include: { member: { select: { id: true, fullName: true, email: true, tenantId: true } } },
      }),
      this.prisma.pointTransaction.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adjust(memberId: string, amount: number, reason: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const newAvailable = member.availablePoints + amount;
    if (newAvailable < 0) throw new BadRequestException('Insufficient points');

    const newTotal = member.totalPoints + (amount >= 0 ? amount : 0);

    const [transaction] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'ADJUST',
          amount,
          balance: newAvailable,
          reason,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: {
          totalPoints: { increment: amount >= 0 ? amount : 0 },
          availablePoints: { increment: amount },
        },
      }),
    ]);
    if (amount > 0) await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
    return transaction;
  }
}
