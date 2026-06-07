import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    code: string; type: string; value: number; tenantId: string;
    minAmount?: number; maxDiscount?: number; maxUsage?: number;
    maxUsagePerMember?: number; description?: string;
    startDate?: string; endDate?: string; status?: string;
  }) {
    const existing = await this.prisma.coupon.findUnique({
      where: { code_tenantId: { code: data.code, tenantId: data.tenantId } },
    });
    if (existing) throw new BadRequestException(`Coupon code "${data.code}" already exists`);

    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minAmount: data.minAmount,
        maxDiscount: data.maxDiscount,
        maxUsage: data.maxUsage,
        maxUsagePerMember: data.maxUsagePerMember ?? 1,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status ?? 'ACTIVE',
        tenantId: data.tenantId,
      },
    });
  }

  async bulkGenerate(data: {
    prefix: string; count: number; type: string; value: number; tenantId: string;
    minAmount?: number; maxDiscount?: number; maxUsage?: number;
    maxUsagePerMember?: number; description?: string;
    startDate?: string; endDate?: string; status?: string;
  }) {
    if (data.count < 1 || data.count > 1000) throw new BadRequestException('Count must be between 1 and 1000');

    const codes: string[] = [];
    const coupons: any[] = [];
    const now = Date.now();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    for (let i = 0; i < data.count; i++) {
      let code = data.prefix.toUpperCase();
      for (let j = 0; j < 8; j++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      codes.push(code);
    }

    const existing = await this.prisma.coupon.findMany({
      where: { code: { in: codes.map(c => c.toUpperCase()) }, tenantId: data.tenantId },
      select: { code: true },
    });
    const existingSet = new Set(existing.map(e => e.code));

    for (const code of codes) {
      if (existingSet.has(code.toUpperCase())) continue;
      const coupon = await this.prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          type: data.type,
          value: data.value,
          minAmount: data.minAmount,
          maxDiscount: data.maxDiscount,
          maxUsage: data.maxUsage,
          maxUsagePerMember: data.maxUsagePerMember ?? 1,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: data.status ?? 'ACTIVE',
          tenantId: data.tenantId,
        },
      });
      coupons.push(coupon);
    }

    return { created: coupons.length, codes: coupons.map(c => c.code) };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async checkExpiringCoupons() {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const expiringCoupons = await this.prisma.coupon.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { gte: now, lte: threeDaysLater },
      },
      include: { tenant: { select: { name: true } } },
    });
    for (const coupon of expiringCoupons) {
      try {
        await this.prisma.notificationLog.create({
          data: {
            templateId: 'coupon_expiring',
            recipient: coupon.tenantId,
            channel: 'email',
            subject: `Coupon ${coupon.code} sắp hết hạn`,
            content: `Coupon ${coupon.code} sẽ hết hạn vào ${coupon.endDate?.toLocaleDateString('vi-VN')}. Còn ${Math.ceil((coupon.endDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày.`,
            status: 'PENDING',
            tenantId: coupon.tenantId,
          },
        });
      } catch {}
    }
  }

  async findAll(params: { tenantId?: string; page?: number; limit?: number; status?: string; search?: string; sort?: string }) {
    const { tenantId, page = 1, limit = 20, status, search, sort } = params;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where, orderBy: { [orderBy]: orderDirection }, skip, take: limit,
        include: { _count: { select: { usages: true } } },
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { _count: { select: { usages: true } } },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.code) updateData.code = data.code.toUpperCase();
    return this.prisma.coupon.update({ where: { id }, data: updateData });
  }

  async duplicate(id: string) {
    const coupon = await this.findOne(id);
    const { id: _, createdAt, updatedAt, usedCount, ...data } = coupon;
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return this.prisma.coupon.create({
      data: {
        ...data,
        code: `${data.code}-${suffix}`,
        usedCount: 0,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  async validate(couponCode: string, memberId: string, orderTotal: number, tenantId?: string) {
    const where: any = { code: couponCode.toUpperCase() };
    if (tenantId) where.tenantId = tenantId;

    const coupon = await this.prisma.coupon.findFirst({ where });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const errors: string[] = [];
    const now = new Date();

    if (coupon.status !== 'ACTIVE') errors.push('Coupon is not active');
    if (coupon.startDate && now < coupon.startDate) errors.push('Coupon is not yet valid');
    if (coupon.endDate && now > coupon.endDate) errors.push('Coupon has expired');
    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) errors.push('Coupon usage limit reached');
    if (coupon.minAmount && orderTotal < coupon.minAmount) errors.push(`Minimum order amount is ${coupon.minAmount.toLocaleString()} VND`);

    if (coupon.maxUsagePerMember) {
      const memberUsageCount = await this.prisma.couponUsage.count({
        where: { couponId: coupon.id, memberId },
      });
      if (memberUsageCount >= coupon.maxUsagePerMember) errors.push('Coupon usage limit reached for this member');
    }

    let discount = 0;
    if (errors.length === 0) {
      if (coupon.type === 'PERCENTAGE') {
        discount = Math.round(orderTotal * (coupon.value / 100));
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = coupon.value;
      }
      if (discount > orderTotal) discount = orderTotal;
    }

    return { valid: errors.length === 0, coupon, errors, discount };
  }

  async apply(couponCode: string, memberId: string, orderId: string, orderTotal: number, tenantId?: string) {
    const validation = await this.validate(couponCode, memberId, orderTotal, tenantId);
    if (!validation.valid) throw new BadRequestException(validation.errors.join('; '));

    await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: { id: validation.coupon.id },
        data: { usedCount: { increment: 1 } },
      }),
      this.prisma.couponUsage.create({
        data: {
          couponId: validation.coupon.id,
          memberId,
          orderId,
          discountAmount: validation.discount,
        },
      }),
    ]);

    return { discount: validation.discount, couponCode: validation.coupon.code };
  }

  async getPerformanceStats(tenantId?: string) {
    const couponWhere: any = {};
    if (tenantId) couponWhere.tenantId = tenantId;
    const coupons = await this.prisma.coupon.findMany({ where: couponWhere, include: { _count: { select: { usages: true } } } });
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.status === 'ACTIVE').length;
    const totalUsage = coupons.reduce((s, c) => s + c.usedCount, 0);
    const couponIds = coupons.map(c => c.id);
    const totalDiscount = couponIds.length > 0
      ? await this.prisma.couponUsage.aggregate({ where: { couponId: { in: couponIds } }, _sum: { discountAmount: true } })
      : { _sum: { discountAmount: 0 } };
    const topCoupons = coupons.sort((a, b) => b.usedCount - a.usedCount).slice(0, 5);
    return {
      totalCoupons,
      activeCoupons,
      totalUsage,
      totalDiscountAmount: totalDiscount._sum.discountAmount || 0,
      topCoupons: topCoupons.map(c => ({ id: c.id, code: c.code, type: c.type, value: c.value, usedCount: c.usedCount })),
    };
  }

  async getUsageReport(couponId: string) {
    await this.findOne(couponId);
    const usages = await this.prisma.couponUsage.findMany({
      where: { couponId },
      include: { member: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return usages;
  }
}
