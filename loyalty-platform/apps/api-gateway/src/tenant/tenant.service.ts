import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; domain: string; email: string; phone?: string; address?: string; hostId: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { domain: data.domain } });
    if (existing) throw new ConflictException('Domain already exists');
    return this.prisma.tenant.create({
      data: { ...data, hostId: data.hostId },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.tenant.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id }, include: { _count: { select: { users: true, members: true } } } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(id: string, data: { name?: string; email?: string; phone?: string; address?: string; status?: string }) {
    await this.findOne(id);
    return this.prisma.tenant.update({ where: { id }, data: data as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tenant.update({ where: { id }, data: { status: 'DISABLED' as any } });
  }
}
