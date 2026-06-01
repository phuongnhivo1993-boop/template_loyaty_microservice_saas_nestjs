import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TierService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; minPoints: number; maxPoints: number; benefits?: string; color?: string; tenantId: string }) {
    return this.prisma.tier.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20) {
    const where = tenantId ? { tenantId } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.tier.findMany({ where, orderBy: { minPoints: 'asc' }, skip, take: limit }),
      this.prisma.tier.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tier = await this.prisma.tier.findUnique({ where: { id } });
    if (!tier) throw new NotFoundException('Tier not found');
    return tier;
  }

  async update(id: string, data: { name?: string; minPoints?: number; maxPoints?: number; benefits?: string }) {
    await this.findOne(id);
    return this.prisma.tier.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tier.delete({ where: { id } });
  }
}
