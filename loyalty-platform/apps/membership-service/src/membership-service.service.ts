import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateMemberDto, UpdateMemberDto, MemberQueryDto } from './dto/member.dto';

@Injectable()
export class MembershipServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: MemberQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.tierId) where.tierId = query.tierId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = query.sort ? { [query.sort.replace('-', '')]: query.sort.startsWith('-') ? 'desc' : 'asc' } : { createdAt: 'desc' };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.member.findMany({
        where,
        include: { tier: true },
        orderBy,
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
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async create(dto: CreateMemberDto) {
    const member = await this.prisma.member.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        tags: dto.tags ?? [],
        tenantId: dto.tenantId,
        tierId: dto.tierId,
      },
      include: { tier: true },
    });
    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
    const existing = await this.prisma.member.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Member not found');

    const member = await this.prisma.member.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        tags: dto.tags,
        tierId: dto.tierId,
        status: dto.status as any,
      },
      include: { tier: true },
    });
    return member;
  }

  async getTier(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    return {
      memberId: member.id,
      currentTier: member.tier ?? null,
      totalPoints: member.totalPoints,
    };
  }

  async findAllTiers(tenantId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    return this.prisma.tier.findMany({ where, orderBy: { minPoints: 'asc' } });
  }
}
