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
    return transaction;
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
