import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberVoucherService {
  constructor(private prisma: PrismaService) {}

  async assign(memberId: string, voucherId: string) {
    const existing = await this.prisma.memberVoucher.findFirst({
      where: { memberId, voucherId, redeemed: false },
    });
    if (existing) throw new ConflictException('Voucher already assigned to this member');
    return this.prisma.memberVoucher.create({
      data: { memberId, voucherId },
      include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async findAll(memberId?: string, page = 1, limit = 20, search?: string) {
    const where: any = {};
    if (memberId) where.memberId = memberId;
    if (search) {
      where.member = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.memberVoucher.findMany({
        where,
        include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.memberVoucher.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const mv = await this.prisma.memberVoucher.findUnique({
      where: { id },
      include: { voucher: true, member: { select: { id: true, fullName: true, email: true } } },
    });
    if (!mv) throw new NotFoundException('Assignment not found');
    return mv;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.memberVoucher.delete({ where: { id } });
  }

  async redeem(id: string) {
    const mv = await this.prisma.memberVoucher.findUnique({ where: { id }, include: { voucher: true } });
    if (!mv) throw new NotFoundException('Assignment not found');
    if (mv.redeemed) throw new ConflictException('Voucher already redeemed');
    return this.prisma.memberVoucher.update({
      where: { id },
      data: { redeemed: true, redeemedAt: new Date() },
    });
  }
}
