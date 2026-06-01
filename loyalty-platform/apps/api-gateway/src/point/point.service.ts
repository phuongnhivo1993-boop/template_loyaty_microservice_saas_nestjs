import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointService {
  constructor(private prisma: PrismaService) {}

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
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const newTotal = member.totalPoints + amount;

    const [transaction] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'EARN',
          amount,
          balance: member.availablePoints + amount,
          reason,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: {
          totalPoints: { increment: amount },
          availablePoints: { increment: amount },
        },
      }),
    ]);

    await this.maybeUpgradeTier(memberId, member.tenantId, newTotal);
    return transaction;
  }

  private async maybeUpgradeTier(memberId: string, tenantId: string, totalPoints: number) {
    const tiers = await this.prisma.tier.findMany({
      where: { tenantId, minPoints: { lte: totalPoints }, maxPoints: { gte: totalPoints } },
      orderBy: { minPoints: 'desc' },
      take: 1,
    });
    if (tiers.length > 0) {
      await this.prisma.member.update({
        where: { id: memberId },
        data: { tierId: tiers[0].id },
      });
    }
  }

  async burn(memberId: string, amount: number, reason?: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.availablePoints < amount) {
      throw new Error('Insufficient points');
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

  getTransactions(memberId?: string) {
    const where = memberId ? { memberId } : {};
    return this.prisma.pointTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
