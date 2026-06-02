import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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

  async findOne(id: string) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
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

  async redeem(id: string) {
    const voucher = await this.findOne(id);
    if (voucher.expiresAt && voucher.expiresAt < new Date()) throw new BadRequestException('Voucher expired');
    if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) throw new BadRequestException('Voucher usage limit reached');
    return this.prisma.voucher.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  }

  async update(id: string, data: { value?: number; maxUsage?: number; expiresAt?: string }) {
    await this.findOne(id);
    return this.prisma.voucher.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
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
}
