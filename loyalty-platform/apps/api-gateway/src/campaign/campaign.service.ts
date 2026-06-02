import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; startDate: string; endDate: string; budget?: number; tenantId: string }) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate >= endDate) throw new BadRequestException('startDate must be before endDate');
    return this.prisma.campaign.create({ data: { ...data, startDate, endDate } });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, status?: string, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
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

  @Cron(CronExpression.EVERY_HOUR)
  async autoExpireCampaigns() {
    const now = new Date();
    await this.prisma.campaign.updateMany({
      where: { endDate: { lt: now }, status: { not: 'ENDED' } },
      data: { status: 'ENDED' },
    });
    await this.prisma.campaign.updateMany({
      where: { startDate: { lte: now }, endDate: { gt: now }, status: { notIn: ['ACTIVE', 'ENDED'] } },
      data: { status: 'ACTIVE' },
    });
  }
}
