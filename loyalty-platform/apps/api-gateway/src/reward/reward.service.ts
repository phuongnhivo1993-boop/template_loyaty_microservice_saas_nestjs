import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; type: string; pointsRequired: number; quantity: number; imageUrl?: string; tenantId: string }) {
    return this.prisma.reward.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.reward.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.reward.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async redeem(rewardId: string, memberId: string, quantity = 1) {
    const [reward, member] = await Promise.all([
      this.prisma.reward.findUnique({ where: { id: rewardId } }),
      this.prisma.member.findUnique({ where: { id: memberId } }),
    ]);
    if (!reward) throw new NotFoundException('Reward not found');
    if (!member) throw new NotFoundException('Member not found');
    if (reward.quantity < quantity) throw new BadRequestException('Reward out of stock');
    const totalPoints = reward.pointsRequired * quantity;
    if (member.availablePoints < totalPoints) throw new BadRequestException('Insufficient points');

    const voucherCode = `RWD-${rewardId.slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`;

    const [transaction] = await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'BURN',
          amount: -totalPoints,
          balance: member.availablePoints - totalPoints,
          reason: `Redeemed reward: ${reward.name} x${quantity}`,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: { availablePoints: { decrement: totalPoints } },
      }),
      this.prisma.reward.update({
        where: { id: rewardId },
        data: { quantity: { decrement: quantity } },
      }),
      this.prisma.voucher.create({
        data: {
          code: voucherCode,
          type: reward.type,
          value: reward.pointsRequired,
          tenantId: member.tenantId,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
    return { transaction, voucherCode, rewardName: reward.name, pointsUsed: totalPoints };
  }

  async update(id: string, data: { name?: string; description?: string; pointsRequired?: number; quantity?: number }) {
    await this.findOne(id);
    return this.prisma.reward.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reward.delete({ where: { id } });
  }
}
