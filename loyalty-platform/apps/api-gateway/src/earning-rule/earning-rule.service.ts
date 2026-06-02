import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EarningRuleService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; pointsPerUnit?: number; minAmount?: number; maxAmount?: number; category?: string; tenantId: string }) {
    return this.prisma.pointEarningRule.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, category?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.pointEarningRule.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.pointEarningRule.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const rule = await this.prisma.pointEarningRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Earning rule not found');
    return rule;
  }

  async update(id: string, data: { name?: string; description?: string; pointsPerUnit?: number; minAmount?: number; maxAmount?: number; category?: string; status?: string }) {
    await this.findOne(id);
    return this.prisma.pointEarningRule.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pointEarningRule.delete({ where: { id } });
  }

  async calculateEarning(tenantId: string, amount: number, category?: string) {
    const where: any = { tenantId, status: 'ACTIVE' };
    if (category) where.category = category;
    const rules = await this.prisma.pointEarningRule.findMany({ where, orderBy: { pointsPerUnit: 'desc' } });
    if (rules.length === 0) return { points: 0, rule: null, amount };

    const matched = rules.find(r => {
      if (r.minAmount && amount < r.minAmount) return false;
      if (r.maxAmount && amount > r.maxAmount) return false;
      return true;
    });
    if (!matched) return { points: 0, rule: null, amount };

    const points = Math.round(amount * matched.pointsPerUnit);
    return { points, rule: matched.name, amount };
  }
}
