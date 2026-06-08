import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { NotificationTriggerService } from '../common/services/notification-trigger.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class TierService {
  private readonly logger = new Logger(TierService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private notificationTrigger: NotificationTriggerService,
  ) {}

  create(data: { name: string; minPoints?: number; maxPoints?: number; pointsMultiplier?: number; benefits?: string; color?: string; tenantId: string }) {
    return this.prisma.tier.create({
      data: {
        ...data,
        minPoints: data.minPoints ?? 0,
        maxPoints: data.maxPoints ?? 999999,
        pointsMultiplier: data.pointsMultiplier ?? 1.0,
      },
    });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string, status?: string) {
    const cacheKey = `tiers:list:${page}:${limit}:${search || ''}:${sort || ''}:${status || ''}`;
    const cached = await this.cacheService.get<any>(cacheKey, tenantId);
    if (cached) return cached;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.tier.findMany({ where, orderBy: sort ? { [orderBy]: orderDirection } : { minPoints: 'asc' }, skip, take: limit }),
      this.prisma.tier.count({ where }),
    ]);
    const result = { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.cacheService.set(cacheKey, result, 300, tenantId);
    return result;
  }

  async findOne(id: string, tenantId?: string) {
    const tier = await this.prisma.tier.findFirst({ where: { id, ...(tenantId ? { tenantId } : {}) } });
    if (!tier) throw new NotFoundException('Tier not found');
    return tier;
  }

  async update(id: string, data: { name?: string; minPoints?: number; maxPoints?: number; benefits?: string }, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.tier.update({ where: { id }, data });
  }

  async remove(id: string, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.tier.delete({ where: { id } });
  }

  async assignTierToMember(memberId: string): Promise<void> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tenant: { include: { tiers: { orderBy: { minPoints: 'desc' } } } }, tier: true },
    });
    if (!member || !member.tenant) return;

    const tiers = member.tenant.tiers;
    if (tiers.length === 0) return;

    const matchingTier = tiers.find(
      t => member.totalPoints >= t.minPoints && member.totalPoints <= t.maxPoints,
    );

    if (matchingTier && member.tierId !== matchingTier.id) {
      const oldTierName = member.tier?.name || 'Unknown';
      await this.prisma.member.update({
        where: { id: memberId },
        data: { tierId: matchingTier.id },
      });
      this.logger.log(`Member ${memberId} upgraded/downgraded to tier ${matchingTier.name}`);
      this.notificationTrigger.sendTierChanged(memberId, oldTierName, matchingTier.name);
    }
  }

  async getStats(tenantId: string) {
    const tiers = await this.prisma.tier.findMany({
      where: { tenantId },
      include: {
        _count: { select: { members: true } },
      },
    });

    const memberAgg = await this.prisma.member.groupBy({
      by: ['tierId'],
      where: { tenantId, tierId: { not: null } },
      _avg: { totalPoints: true },
      _count: { id: true },
    });

    const aggMap = new Map(memberAgg.map(a => [a.tierId, { avgPoints: a._avg.totalPoints ?? 0, memberCount: a._count.id }]));

    return tiers.map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
      minPoints: t.minPoints,
      maxPoints: t.maxPoints,
      memberCount: aggMap.get(t.id)?.memberCount ?? t._count.members,
      avgPoints: aggMap.get(t.id)?.avgPoints ?? 0,
    }));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoAssignTiers(): Promise<void> {
    this.logger.log('Running auto tier assignment...');
    const tenants = await this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      include: { tiers: { orderBy: { minPoints: 'desc' } } },
    });

    let updated = 0;
    const BATCH_SIZE = 1000;
    for (const tenant of tenants) {
      if (tenant.tiers.length === 0) continue;

      let skip = 0;
      while (true) {
        const members = await this.prisma.member.findMany({
          where: { tenantId: tenant.id, status: 'ACTIVE' },
          select: { id: true, totalPoints: true, tierId: true },
          skip,
          take: BATCH_SIZE,
        });
        if (members.length === 0) break;

        const bulkUpdates: { id: string; tierId: string }[] = [];
        for (const member of members) {
          const matchingTier = tenant.tiers.find(
            t => member.totalPoints >= t.minPoints && member.totalPoints <= t.maxPoints,
          );
          if (matchingTier && member.tierId !== matchingTier.id) {
            bulkUpdates.push({ id: member.id, tierId: matchingTier.id });
          }
        }

        if (bulkUpdates.length > 0) {
          const grouped = new Map<string, string[]>();
          for (const u of bulkUpdates) {
            const ids = grouped.get(u.tierId) || [];
            ids.push(u.id);
            grouped.set(u.tierId, ids);
          }
          await Promise.all(
            Array.from(grouped.entries()).map(([tierId, ids]) =>
              this.prisma.member.updateMany({
                where: { id: { in: ids } },
                data: { tierId },
              })
            )
          );
          updated += bulkUpdates.length;
        }
        skip += BATCH_SIZE;
      }
    }
    this.logger.log(`Auto tier assignment complete. ${updated} members updated.`);
  }
}
