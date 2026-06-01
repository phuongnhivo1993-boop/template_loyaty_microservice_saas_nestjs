import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async createLink(referrerId: string, tenantId: string) {
    const code = `REF-${referrerId.slice(0, 8)}-${Date.now().toString(36)}`;
    return this.prisma.referral.create({
      data: { code, referrerId, tenantId },
    });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.referral.findMany({
        where,
        include: { referrer: true, referee: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.referral.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getStats(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    const total = await this.prisma.referral.count({ where });
    const converted = await this.prisma.referral.count({ where: { ...where, status: 'CONVERTED' } });
    return { total, converted, rate: total > 0 ? (converted / total * 100).toFixed(1) : '0' };
  }

  async convertReferral(referralId: string, refereeId: string) {
    const referral = await this.prisma.referral.findUnique({ where: { id: referralId } });
    if (!referral) throw new NotFoundException('Referral not found');

    const updated = await this.prisma.referral.update({
      where: { id: referralId },
      data: { status: 'CONVERTED', refereeId, rewardGiven: false },
    });

    // Auto-reward referrer with 500 points
    const rewardPoints = 500;
    await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId: referral.referrerId,
          type: 'EARN',
          amount: rewardPoints,
          balance: 0,
          reason: `Referral reward: ${refereeId.slice(0, 8)} joined`,
        },
      }),
      this.prisma.member.update({
        where: { id: referral.referrerId },
        data: {
          totalPoints: { increment: rewardPoints },
          availablePoints: { increment: rewardPoints },
        },
      }),
      this.prisma.referral.update({
        where: { id: referralId },
        data: { rewardGiven: true },
      }),
    ]);

    return updated;
  }
}
