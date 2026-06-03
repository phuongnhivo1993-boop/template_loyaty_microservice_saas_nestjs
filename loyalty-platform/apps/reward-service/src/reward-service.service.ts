import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateRewardDto, UpdateRewardDto, RedeemRewardDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class RewardServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({ data: dto });
  }

  async findAll(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.reward.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async update(id: string, dto: UpdateRewardDto) {
    await this.findOne(id);
    return this.prisma.reward.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reward.delete({ where: { id } });
  }

  async redeem(rewardId: string, dto: RedeemRewardDto) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');
    if (reward.quantity < 1) throw new BadRequestException('Reward is out of stock');

    const member = await this.prisma.member.findUnique({ where: { id: dto.memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.availablePoints < reward.pointsRequired) {
      throw new BadRequestException('Insufficient points');
    }

    const voucherCode = this.generateVoucherCode();
    const qrCode = crypto.randomUUID();

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.reward.update({
        where: { id: rewardId },
        data: { quantity: { decrement: 1 } },
      });

      await tx.member.update({
        where: { id: dto.memberId },
        data: {
          availablePoints: { decrement: reward.pointsRequired },
          totalPoints: { decrement: reward.pointsRequired },
        },
      });

      await tx.pointTransaction.create({
        data: {
          memberId: dto.memberId,
          type: 'BURN',
          amount: -reward.pointsRequired,
          balance: member.availablePoints - reward.pointsRequired,
          reason: `Redeemed reward: ${reward.name}`,
          reference: rewardId,
        },
      });

      const voucher = await tx.voucher.create({
        data: {
          code: voucherCode,
          type: reward.type === 'voucher' ? 'discount' : reward.type,
          value: 0,
          tenantId: reward.tenantId,
        },
      });

      const memberVoucher = await tx.memberVoucher.create({
        data: {
          memberId: dto.memberId,
          voucherId: voucher.id,
          qrCode,
        },
      });

      return { voucher, memberVoucher };
    });

    return result;
  }

  async getRedemptions(rewardId: string) {
    await this.findOne(rewardId);
    return this.prisma.pointTransaction.findMany({
      where: { reference: rewardId, type: 'BURN' },
      include: { member: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateVoucherCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
}
