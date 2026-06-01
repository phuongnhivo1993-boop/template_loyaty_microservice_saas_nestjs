import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async findAll(tenantId?: string, page = 1, limit = 20) {
    const where = tenantId ? { tenantId } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
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
}
