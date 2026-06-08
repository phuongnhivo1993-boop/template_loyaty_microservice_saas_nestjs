import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';
import { randomBytes } from 'crypto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  async create(data: { code: string; type: string; value: number; maxUsage?: number; expiresAt?: string; tenantId: string }) {
    const existing = await this.prisma.voucher.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException('Voucher code already exists');
    return this.prisma.voucher.create({
      data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : null },
    });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.voucher.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tenantId?: string) {
    const voucher = await this.prisma.voucher.findFirst({ where: { id, ...(tenantId ? { tenantId } : {}) } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async validate(code: string) {
    const voucher = await this.prisma.voucher.findUnique({ where: { code } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    if (voucher.expiresAt && voucher.expiresAt < new Date()) throw new BadRequestException('Voucher expired');
    if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) throw new BadRequestException('Voucher usage limit reached');
    return { valid: true, voucher };
  }

  async redeem(id: string, tenantId?: string) {
    const voucher = await this.findOne(id, tenantId);
    if (voucher.expiresAt && voucher.expiresAt < new Date()) throw new BadRequestException('Voucher expired');
    if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) throw new BadRequestException('Voucher usage limit reached');
    return this.prisma.voucher.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  }

  async update(id: string, data: { value?: number; maxUsage?: number; expiresAt?: string }, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.voucher.update({ where: { id }, data });
  }

  async duplicate(id: string, tenantId?: string) {
    const voucher = await this.findOne(id, tenantId);
    const { id: _, createdAt, updatedAt, usedCount, ...data } = voucher;
    const suffix = randomBytes(3).toString('hex').toUpperCase();
    return this.prisma.voucher.create({
      data: {
        ...data,
        code: `${data.code}-${suffix}`,
        usedCount: 0,
        expiresAt: data.expiresAt || null,
      },
    });
  }

  async remove(id: string, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.voucher.delete({ where: { id } });
  }

  async batchGenerate(data: { prefix: string; count: number; type: string; value: number; maxUsage?: number; expiresAt?: string; tenantId: string }) {
    const codes: string[] = [];
    const entries: any[] = [];

    for (let i = 0; i < data.count; i++) {
      const suffix = randomBytes(3).toString('hex').toUpperCase();
      const code = `${data.prefix}-${suffix}`;
      codes.push(code);
      entries.push({
        code,
        type: data.type,
        value: data.value,
        maxUsage: data.maxUsage,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        tenantId: data.tenantId,
      });
    }

    await this.prisma.voucher.createMany({ data: entries, skipDuplicates: true });
    return { generated: codes.length, codes };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoExpireVouchers() {
    const now = new Date();
    const result = await this.prisma.voucher.updateMany({
      where: { expiresAt: { lt: now }, NOT: { expiresAt: null } },
      data: { maxUsage: 0 },
    });
    return { expired: result.count };
  }

  async getExpiredStats(tenantId?: string) {
    const now = new Date();
    const where = tenantId ? { tenantId, expiresAt: { lt: now } } : { expiresAt: { lt: now } };
    const total = await this.prisma.voucher.count({ where });
    const withRedemptions = await this.prisma.voucher.count({
      where: { ...where, usedCount: { gt: 0 } },
    });
    return { totalExpired: total, hadRedemptions: withRedemptions };
  }
}
