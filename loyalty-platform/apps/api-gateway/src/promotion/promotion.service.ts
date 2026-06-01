import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; priority?: number; conditions?: any; actions?: any; tenantId: string }) {
    return this.prisma.promotion.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20) {
    const where = tenantId ? { tenantId } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.promotion.findMany({ where, orderBy: { priority: 'asc' }, skip, take: limit }),
      this.prisma.promotion.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return promotion;
  }

  async update(id: string, data: { name?: string; description?: string; priority?: number; status?: string; conditions?: any; actions?: any }) {
    await this.findOne(id);
    return this.prisma.promotion.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.promotion.delete({ where: { id } });
  }
}
