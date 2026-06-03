import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EarnPointsDto, BurnPointsDto, PointsQueryDto } from './dto/point.dto';

@Injectable()
export class LoyaltyServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    return {
      memberId: member.id,
      fullName: member.fullName,
      totalPoints: member.totalPoints,
      availablePoints: member.availablePoints,
      tier: member.tier ? { id: member.tier.id, name: member.tier.name, multiplier: member.tier.pointsMultiplier } : null,
    };
  }

  async earn(dto: EarnPointsDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: dto.memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');

    const multiplier = member.tier?.pointsMultiplier ?? 1.0;
    const earnedPoints = Math.round(dto.amount * multiplier);

    const [updatedMember, transaction] = await this.prisma.$transaction([
      this.prisma.member.update({
        where: { id: dto.memberId },
        data: {
          totalPoints: { increment: earnedPoints },
          availablePoints: { increment: earnedPoints },
        },
      }),
      this.prisma.pointTransaction.create({
        data: {
          memberId: dto.memberId,
          type: 'EARN',
          amount: earnedPoints,
          balance: member.availablePoints + earnedPoints,
          reason: dto.reason ?? 'Points earned',
        },
      }),
    ]);

    return {
      transactionId: transaction.id,
      memberId: updatedMember.id,
      amount: earnedPoints,
      rawAmount: dto.amount,
      multiplier,
      balance: updatedMember.availablePoints,
    };
  }

  async burn(dto: BurnPointsDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: dto.memberId },
    });
    if (!member) throw new NotFoundException('Member not found');
    if (member.availablePoints < dto.amount) {
      throw new BadRequestException('Insufficient points');
    }

    const [updatedMember, transaction] = await this.prisma.$transaction([
      this.prisma.member.update({
        where: { id: dto.memberId },
        data: {
          totalPoints: { decrement: dto.amount },
          availablePoints: { decrement: dto.amount },
        },
      }),
      this.prisma.pointTransaction.create({
        data: {
          memberId: dto.memberId,
          type: 'BURN',
          amount: -dto.amount,
          balance: member.availablePoints - dto.amount,
          reason: dto.reason ?? 'Points burned',
        },
      }),
    ]);

    return {
      transactionId: transaction.id,
      memberId: updatedMember.id,
      amount: -dto.amount,
      balance: updatedMember.availablePoints,
    };
  }

  async getTransactions(memberId: string, query: PointsQueryDto) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { memberId };
    if (query.type) where.type = query.type;

    const [data, total] = await this.prisma.$transaction([
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
}
