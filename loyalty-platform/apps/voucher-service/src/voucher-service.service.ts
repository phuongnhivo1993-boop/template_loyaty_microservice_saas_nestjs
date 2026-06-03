import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateVoucherDto, UpdateVoucherDto, ValidateVoucherDto, BatchGenerateDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class VoucherServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVoucherDto) {
    const code = dto.code || this.generateCode();
    return this.prisma.voucher.create({
      data: {
        code,
        type: dto.type,
        value: dto.value,
        maxUsage: dto.maxUsage,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        tenantId: dto.tenantId,
      },
    });
  }

  async findAll(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async update(id: string, dto: UpdateVoucherDto) {
    await this.findOne(id);
    return this.prisma.voucher.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.voucher.delete({ where: { id } });
  }

  async validate(dto: ValidateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({ where: { code: dto.code } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    if (voucher.tenantId !== dto.tenantId) throw new BadRequestException('Voucher does not belong to this tenant');

    const errors: string[] = [];

    if (voucher.expiresAt && new Date() > new Date(voucher.expiresAt)) {
      errors.push('Voucher has expired');
    }

    if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) {
      errors.push('Voucher usage limit reached');
    }

    return { valid: errors.length === 0, errors, voucher };
  }

  async redeem(id: string) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new NotFoundException('Voucher not found');

    if (voucher.expiresAt && new Date() > new Date(voucher.expiresAt)) {
      throw new BadRequestException('Voucher has expired');
    }
    if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) {
      throw new BadRequestException('Voucher usage limit reached');
    }

    return this.prisma.voucher.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  }

  async batchGenerate(dto: BatchGenerateDto) {
    const vouchers: Array<{
      code: string;
      type: string;
      value: number;
      expiresAt: Date | null;
      tenantId: string;
    }> = [];

    for (let i = 0; i < dto.count; i++) {
      vouchers.push({
        code: this.generateCode(),
        type: dto.type,
        value: dto.value,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        tenantId: dto.tenantId,
      });
    }

    await this.prisma.voucher.createMany({ data: vouchers });
    return { count: dto.count, vouchers: vouchers.map((v) => v.code) };
  }

  async getExpiredStats(tenantId?: string) {
    const where: any = {
      expiresAt: { lte: new Date(), not: null },
    };
    if (tenantId) where.tenantId = tenantId;

    const expired = await this.prisma.voucher.findMany({ where });
    const total = await this.prisma.voucher.count({
      where: tenantId ? { tenantId } : {},
    });

    return {
      expiredCount: expired.length,
      totalCount: total,
      expiredRate: total > 0 ? (expired.length / total) * 100 : 0,
    };
  }

  private generateCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
}
