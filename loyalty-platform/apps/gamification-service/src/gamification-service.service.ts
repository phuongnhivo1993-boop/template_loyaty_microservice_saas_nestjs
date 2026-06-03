import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateBadgeDto, UpdateBadgeDto } from './dto/badge.dto';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto';

@Injectable()
export class GamificationServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async createBadge(dto: CreateBadgeDto) {
    return this.prisma.badge.create({ data: dto });
  }

  async updateBadge(id: string, dto: UpdateBadgeDto) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException('Badge not found');
    return this.prisma.badge.update({ where: { id }, data: dto });
  }

  async deleteBadge(id: string) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException('Badge not found');
    return this.prisma.badge.delete({ where: { id } });
  }

  async getBadge(id: string) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException('Badge not found');
    return badge;
  }

  async listBadges(tenantId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    const [data, total] = await Promise.all([
      this.prisma.badge.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.badge.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createMission(dto: CreateMissionDto) {
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.mission.create({ data });
  }

  async updateMission(id: string, dto: UpdateMissionDto) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.mission.update({ where: { id }, data });
  }

  async deleteMission(id: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return this.prisma.mission.delete({ where: { id } });
  }

  async getMission(id: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async listMissions(tenantId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    const [data, total] = await Promise.all([
      this.prisma.mission.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.mission.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getLeaderboard(tenantId: string, limit = 20) {
    return this.prisma.member.findMany({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { totalPoints: 'desc' },
      take: limit,
      include: { tier: true },
    });
  }

  async getMemberBadges(memberId: string) {
    return this.prisma.badge.findMany({
      where: { tenant: { members: { some: { id: memberId } } } },
    });
  }

  async getMemberMissions(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId }, select: { tenantId: true } });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.mission.findMany({ where: { tenantId: member.tenantId } });
  }
}
