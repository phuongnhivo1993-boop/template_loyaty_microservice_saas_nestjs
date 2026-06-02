import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // Badges
  createBadge(data: { name: string; description?: string; iconUrl?: string; criteria?: any; tenantId: string }) {
    return this.prisma.badge.create({ data });
  }

  async findAllBadges(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.badge.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.badge.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateBadge(id: string, data: { name?: string; description?: string; iconUrl?: string; criteria?: any }) {
    await this.findBadge(id);
    return this.prisma.badge.update({ where: { id }, data });
  }

  async removeBadge(id: string) {
    await this.findBadge(id);
    return this.prisma.badge.delete({ where: { id } });
  }

  async findOneBadge(id: string) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException('Badge not found');
    return badge;
  }

  private async findBadge(id: string) {
    return this.findOneBadge(id);
  }

  // Missions
  createMission(data: { name: string; description?: string; pointsReward?: number; criteria?: any; startDate?: string; endDate?: string; tenantId: string }) {
    return this.prisma.mission.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async findAllMissions(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.mission.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.mission.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneMission(id: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async updateMission(id: string, data: { name?: string; description?: string; pointsReward?: number; criteria?: any }) {
    await this.findOneMission(id);
    return this.prisma.mission.update({ where: { id }, data });
  }

  async removeMission(id: string) {
    await this.findOneMission(id);
    return this.prisma.mission.delete({ where: { id } });
  }
}
