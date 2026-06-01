import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; startDate: string; endDate: string; budget?: number; tenantId: string }) {
    return this.prisma.campaign.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.campaign.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(id: string, data: { name?: string; description?: string; status?: string; budget?: number }) {
    await this.findOne(id);
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.campaign.delete({ where: { id } });
  }
}
