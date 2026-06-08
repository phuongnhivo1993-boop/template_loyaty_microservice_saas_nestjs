import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async updateBadge(id: string, data: { name?: string; description?: string; iconUrl?: string; criteria?: any }, tenantId?: string) {
    await this.findBadge(id, tenantId);
    return this.prisma.badge.update({ where: { id }, data });
  }

  async removeBadge(id: string, tenantId?: string) {
    await this.findBadge(id, tenantId);
    return this.prisma.badge.delete({ where: { id } });
  }

  async findOneBadge(id: string, tenantId?: string) {
    const badge = await this.prisma.badge.findFirst({ where: { id, ...(tenantId ? { tenantId } : {}) } });
    if (!badge) throw new NotFoundException('Badge not found');
    return badge;
  }

  private async findBadge(id: string, tenantId?: string) {
    return this.findOneBadge(id, tenantId);
  }

  async assignBadge(badgeId: string, memberIds: string[], tenantId?: string) {
    const badge = await this.findOneBadge(badgeId, tenantId);
    const members = await this.prisma.member.findMany({
      where: { id: { in: memberIds }, tenantId: badge.tenantId },
    });
    if (members.length === 0) throw new BadRequestException('No valid members found');

    await this.prisma.auditLog.create({
      data: {
        entityType: 'badge_assignment',
        entityId: badgeId,
        action: 'CREATE',
        newValue: { badgeId, badgeName: badge.name, memberIds: members.map(m => ({ id: m.id, name: m.fullName })) },
      },
    });

    return { message: `Badge assigned to ${members.length} member(s)`, badge };
  }

  async getMemberBadges(memberId: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    const badges = await this.prisma.badge.findMany({ where: { tenantId: member.tenantId } });
    return badges;
  }

  async unassignBadge(badgeId: string, memberId: string, tenantId?: string) {
    const badge = await this.findOneBadge(badgeId, tenantId);
    await this.prisma.auditLog.create({
      data: {
        entityType: 'badge_assignment',
        entityId: badgeId,
        action: 'DELETE',
        newValue: { badgeId, badgeName: badge.name, memberId },
      },
    });
    return { message: 'Badge unassigned from member' };
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

  async findOneMission(id: string, tenantId?: string) {
    const mission = await this.prisma.mission.findFirst({ where: { id, ...(tenantId ? { tenantId } : {}) } });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async updateMission(id: string, data: { name?: string; description?: string; pointsReward?: number; criteria?: any }, tenantId?: string) {
    await this.findOneMission(id, tenantId);
    return this.prisma.mission.update({ where: { id }, data });
  }

  async removeMission(id: string, tenantId?: string) {
    await this.findOneMission(id, tenantId);
    return this.prisma.mission.delete({ where: { id } });
  }

  async updateMissionProgress(missionId: string, memberId: string, progress: number) {
    await this.findOneMission(missionId);
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const key = `mission_progress_${missionId}`;
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: member.tenantId, key } },
    });
    const entries = (settings?.value as any[]) ?? [];
    const idx = entries.findIndex(e => e.memberId === memberId);
    if (idx >= 0) {
      entries[idx].progress = progress;
      entries[idx].updatedAt = new Date().toISOString();
    } else {
      entries.push({ memberId, memberName: member.fullName, progress, updatedAt: new Date().toISOString() });
    }

    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: member.tenantId, key } },
      update: { value: entries },
      create: { scope: 'tenant', scopeId: member.tenantId, key, value: entries },
    });

    return { message: 'Progress updated', progress };
  }

  async getMissionLeaderboard(missionId: string) {
    const mission = await this.findOneMission(missionId);
    const key = `mission_progress_${missionId}`;
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: mission.tenantId, key } },
    });
    const entries = (settings?.value as any[]) ?? [];
    entries.sort((a, b) => b.progress - a.progress);
    return entries;
  }
}
