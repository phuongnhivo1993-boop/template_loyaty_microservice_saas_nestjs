import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; fullName: string; phone?: string; tenantId: string; tierId?: string }) {
    const existing = await this.prisma.member.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');
    return this.prisma.member.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, tierId?: string, status?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (tierId) where.tierId = tierId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        include: { tier: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.member.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: { tier: true, pointTransactions: { take: 20, orderBy: { createdAt: 'desc' } } },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async update(id: string, data: { fullName?: string; phone?: string; tierId?: string; status?: string }) {
    await this.findOne(id);
    return this.prisma.member.update({ where: { id }, data: data as any });
  }

  async kycVerify(id: string) {
    await this.findOne(id);
    return this.prisma.member.update({
      where: { id },
      data: { kycVerified: true, status: 'ACTIVE' as any },
    });
  }

  async toggleStatus(id: string) {
    const member = await this.findOne(id);
    const newStatus = member.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    return this.prisma.member.update({ where: { id }, data: { status: newStatus as any } });
  }
}
