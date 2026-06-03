import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationTriggerService } from '../common/services/notification-trigger.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class TierService {
  private readonly logger = new Logger(TierService.name);

  constructor(
    private prisma: PrismaService,
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
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tier = await this.prisma.tier.findUnique({ where: { id } });
    if (!tier) throw new NotFoundException('Tier not found');
    return tier;
  }

  async update(id: string, data: { name?: string; minPoints?: number; maxPoints?: number; benefits?: string }) {
    await this.findOne(id);
    return this.prisma.tier.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoAssignTiers(): Promise<void> {
    this.logger.log('Running auto tier assignment...');
    const tenants = await this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      include: { tiers: { orderBy: { minPoints: 'desc' } } },
    });

    let updated = 0;
    for (const tenant of tenants) {
      if (tenant.tiers.length === 0) continue;

      const members = await this.prisma.member.findMany({
        where: { tenantId: tenant.id, status: 'ACTIVE' },
      });

      for (const member of members) {
        const matchingTier = tenant.tiers.find(
          t => member.totalPoints >= t.minPoints && member.totalPoints <= t.maxPoints,
        );
        if (matchingTier && member.tierId !== matchingTier.id) {
          await this.prisma.member.update({
            where: { id: member.id },
            data: { tierId: matchingTier.id },
          });
          updated++;
        }
      }
    }
    this.logger.log(`Auto tier assignment complete. ${updated} members updated.`);
  }
}
