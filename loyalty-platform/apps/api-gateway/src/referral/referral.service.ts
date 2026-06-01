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

  async findAll(tenantId?: string, page = 1, limit = 20) {
    const where = tenantId ? { tenantId } : {};
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
}
