import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto } from './dto/campaign.dto';

@Injectable()
export class CampaignServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CampaignQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = query.sort
      ? { [query.sort.replace('-', '')]: query.sort.startsWith('-') ? 'desc' : 'asc' }
      : { createdAt: 'desc' };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.campaign.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.campaign.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: dto.budget,
        tenantId: dto.tenantId,
      },
    });
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        budget: dto.budget,
      },
    });
  }

  async getPerformance(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const now = new Date();
    const daysRunning = Math.max(1, Math.ceil((now.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalDays = Math.max(1, Math.ceil((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, Math.round((daysRunning / totalDays) * 100));

    const memberCount = await this.prisma.member.count({
      where: { tenantId: campaign.tenantId, createdAt: { gte: campaign.startDate } },
    });

    return {
      campaignId: campaign.id,
      name: campaign.name,
      status: campaign.status,
      daysRunning,
      totalDays,
      progressPercent: progress,
      memberCountSinceStart: memberCount,
      budget: campaign.budget,
    };
  }

  async activate(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'DRAFT' && campaign.status !== 'PAUSED') {
      throw new BadRequestException('Campaign must be in DRAFT or PAUSED status to activate');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async end(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status === 'ENDED') {
      throw new BadRequestException('Campaign is already ended');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: 'ENDED' },
    });
  }
}
