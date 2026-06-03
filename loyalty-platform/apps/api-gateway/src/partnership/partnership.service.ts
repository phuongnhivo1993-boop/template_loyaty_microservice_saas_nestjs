import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class PartnershipService {
  constructor(private prisma: PrismaService) {}

  async createBrand(data: { name: string; code: string; description?: string; logo?: string; website?: string; contactEmail?: string; contactPhone?: string; commissionRate?: number; tenantId: string }) {
    const existing = await this.prisma.partnerBrand.findUnique({ where: { code: data.code } });
    if (existing) throw new BadRequestException('Brand code already exists');
    return this.prisma.partnerBrand.create({
      data: { ...data, commissionRate: data.commissionRate || 0.05 },
    });
  }

  async listBrands(tenantId?: string, page = 1, limit = 20, search?: string, status?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.partnerBrand.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.partnerBrand.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getBrand(id: string) {
    const brand = await this.prisma.partnerBrand.findUnique({ where: { id }, include: { partnerRewards: true } });
    if (!brand) throw new NotFoundException('Partner brand not found');
    return brand;
  }

  async updateBrand(id: string, data: any) {
    await this.getBrand(id);
    return this.prisma.partnerBrand.update({ where: { id }, data });
  }

  async deleteBrand(id: string) {
    await this.getBrand(id);
    await this.prisma.partnerReward.deleteMany({ where: { brandId: id } });
    return this.prisma.partnerBrand.delete({ where: { id } });
  }

  async createReward(brandId: string, data: { name: string; description?: string; type: string; value: number; pointsRequired: number; quantity?: number; imageUrl?: string; startDate?: string; endDate?: string }) {
    await this.getBrand(brandId);
    return this.prisma.partnerReward.create({
      data: {
        ...data,
        quantity: data.quantity || 0,
        brandId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  async listRewards(brandId: string, page = 1, limit = 20) {
    const where: any = { brandId };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.partnerReward.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.partnerReward.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateReward(id: string, data: any) {
    const reward = await this.prisma.partnerReward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Partner reward not found');
    return this.prisma.partnerReward.update({ where: { id }, data });
  }

  async deleteReward(id: string) {
    const reward = await this.prisma.partnerReward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Partner reward not found');
    return this.prisma.partnerReward.delete({ where: { id } });
  }

  async redeemReward(memberId: string, rewardId: string, quantity = 1) {
    const reward = await this.prisma.partnerReward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Partner reward not found');
    if (reward.quantity < quantity) throw new BadRequestException('Not enough stock');

    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.availablePoints < reward.pointsRequired * quantity) {
      throw new BadRequestException('Insufficient points');
    }

    const totalPoints = reward.pointsRequired * quantity;
    await this.prisma.$transaction(async (tx) => {
      await tx.partnerReward.update({ where: { id: rewardId }, data: { quantity: { decrement: quantity } } });
      await tx.member.update({ where: { id: memberId }, data: { availablePoints: { decrement: totalPoints }, totalPoints: { decrement: totalPoints } } });
      await tx.pointTransaction.create({
        data: {
          memberId,
          type: 'BURN',
          amount: -totalPoints,
          balance: member.availablePoints - totalPoints,
          reason: `Redeemed partner reward: ${reward.name}`,
          reference: rewardId,
        },
      });
    });

    return { message: 'Partner reward redeemed successfully', reward: reward.name, pointsSpent: totalPoints };
  }
}
