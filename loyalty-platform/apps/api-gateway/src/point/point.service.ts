import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async getTransactions(memberId?: string, page = 1, limit = 20, type?: string) {
    const where: any = {};
    if (memberId) where.memberId = memberId;
    if (type) where.type = type;

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

  async adjust(memberId: string, amount: number, reason: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const newAvailable = member.availablePoints + amount;
    if (newAvailable < 0) throw new BadRequestException('Insufficient points');

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
    return transaction;
  }
}
