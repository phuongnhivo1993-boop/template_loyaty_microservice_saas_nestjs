import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateReferralDto, ConvertReferralDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class ReferralServiceService {
  private readonly REFERRAL_POINTS = 100;

  constructor(private readonly prisma: PrismaService) {}

  async createReferralLink(dto: CreateReferralDto) {
    const referrer = await this.prisma.member.findUnique({ where: { id: dto.referrerId } });
    if (!referrer) throw new NotFoundException('Referrer member not found');

    const code = dto.code || this.generateCode();

    return this.prisma.referral.create({
      data: {
        code,
        referrerId: dto.referrerId,
        tenantId: dto.tenantId,
      },
    });
  }

  async findAll(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.referral.findMany({
      where,
      include: {
        referrer: { select: { id: true, fullName: true, email: true } },
        referee: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id },
      include: {
        referrer: { select: { id: true, fullName: true, email: true } },
        referee: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!referral) throw new NotFoundException('Referral not found');
    return referral;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.referral.delete({ where: { id } });
  }

  async getStats(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    const [total, converted] = await Promise.all([
      this.prisma.referral.count({ where }),
      this.prisma.referral.count({ where: { ...where, status: 'CONVERTED' } }),
    ]);
    return {
      total,
      converted,
      conversionRate: total > 0 ? (converted / total) * 100 : 0,
    };
  }

  async convert(id: string, dto: ConvertReferralDto) {
    const referral = await this.prisma.referral.findUnique({ where: { id } });
    if (!referral) throw new NotFoundException('Referral not found');
    if (referral.status !== 'PENDING') throw new BadRequestException('Referral is already converted');

    const referee = await this.prisma.member.findUnique({ where: { id: dto.refereeId } });
    if (!referee) throw new NotFoundException('Referee member not found');

    const referrer = await this.prisma.member.findUnique({ where: { id: referral.referrerId } });
    if (!referrer) throw new NotFoundException('Referrer member not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.referral.update({
        where: { id },
        data: {
          refereeId: dto.refereeId,
          status: 'CONVERTED',
          rewardGiven: true,
        },
      });

      await tx.member.update({
        where: { id: referral.referrerId },
        data: {
          totalPoints: { increment: this.REFERRAL_POINTS },
          availablePoints: { increment: this.REFERRAL_POINTS },
        },
      });

      await tx.pointTransaction.create({
        data: {
          memberId: referral.referrerId,
          type: 'EARN',
          amount: this.REFERRAL_POINTS,
          balance: referrer.availablePoints + this.REFERRAL_POINTS,
          reason: 'Referral reward',
          reference: id,
        },
      });

      return tx.referral.findUnique({
        where: { id },
        include: {
          referrer: { select: { id: true, fullName: true, email: true } },
          referee: { select: { id: true, fullName: true, email: true } },
        },
      });
    });
  }

  private generateCode(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }
}
