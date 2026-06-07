import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PointExpiryService {
  private readonly logger = new Logger(PointExpiryService.name);

  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async processExpirations(): Promise<{ expired: number }> {
    this.logger.log('Manual point expiry triggered');
    const before = await this.prisma.pointTransaction.aggregate({
      where: { type: 'EXPIRE' },
      _sum: { amount: true },
    });
    const beforeCount = Math.abs(before._sum.amount ?? 0);
    await this.expireOldPoints();
    const after = await this.prisma.pointTransaction.aggregate({
      where: { type: 'EXPIRE' },
      _sum: { amount: true },
    });
    const afterCount = Math.abs(after._sum.amount ?? 0);
    return { expired: afterCount - beforeCount };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOldPoints(): Promise<void> {
    this.logger.log('Running point expiry check...');
    const tenants = await this.prisma.tenant.findMany({ where: { status: 'ACTIVE' } });

    let totalExpired = 0;
    for (const tenant of tenants) {
      const settings = await this.settingsService.getTenantSettings(tenant.id);
      const config = settings.loyaltyConfig ?? {};
      if (config.autoExpirePoints === false) {
        this.logger.log(`Skipping expiry for tenant ${tenant.id} (autoExpirePoints=false)`);
        continue;
      }
      const expiryDays = config.pointExpiryDays ?? 365;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - expiryDays);

      const members = await this.prisma.member.findMany({
        where: { tenantId: tenant.id, availablePoints: { gt: 0 }, status: 'ACTIVE' },
        orderBy: { totalPoints: 'asc' },
      });

      if (members.length === 0) continue;
      const memberIds = members.map(m => m.id);

      const [earnsByMember, expiredByMember] = await Promise.all([
        this.prisma.pointTransaction.groupBy({
          by: ['memberId'],
          where: { memberId: { in: memberIds }, type: 'EARN', createdAt: { lte: cutoff } },
          _sum: { amount: true },
        }),
        this.prisma.pointTransaction.groupBy({
          by: ['memberId'],
          where: { memberId: { in: memberIds }, type: 'EXPIRE' },
          _sum: { amount: true },
        }),
      ]);

      const earnMap = new Map(earnsByMember.map(e => [e.memberId, e._sum.amount ?? 0]));
      const expiredMap = new Map(expiredByMember.map(e => [e.memberId, Math.abs(e._sum.amount ?? 0)]));

      const expireOps: { memberId: string; amount: number; balance: number }[] = [];
      const memberUpdates: { id: string; decrement: number }[] = [];

      for (const member of members) {
        const earned = earnMap.get(member.id) ?? 0;
        if (earned <= 0) continue;
        const alreadyExpired = expiredMap.get(member.id) ?? 0;
        const availableForExpiry = member.availablePoints - alreadyExpired;
        if (availableForExpiry <= 0) continue;

        const actualExpiry = Math.min(earned, availableForExpiry);
        if (actualExpiry <= 0) continue;

        expireOps.push({
          memberId: member.id,
          amount: -actualExpiry,
          balance: member.availablePoints - actualExpiry,
        });
        memberUpdates.push({ id: member.id, decrement: actualExpiry });
        totalExpired += actualExpiry;
      }

      if (expireOps.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          await tx.pointTransaction.createMany({
            data: expireOps.map(op => ({
              memberId: op.memberId,
              type: 'EXPIRE' as const,
              amount: op.amount,
              balance: op.balance,
              reason: `Auto-expiry after ${expiryDays} days`,
            })),
          });
          for (const m of memberUpdates) {
            await tx.member.update({
              where: { id: m.id },
              data: { availablePoints: { decrement: m.decrement } },
            });
          }
        });
      }
    }
    this.logger.log(`Point expiry complete. ${totalExpired} points expired.`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async assignBirthdayBonuses(): Promise<void> {
    this.logger.log('Running birthday bonus check...');
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const members = await this.prisma.member.findMany({
      where: {
        birthday: { not: null },
        status: 'ACTIVE',
      },
    });

    const birthdayMembers = members.filter((m) => {
      if (!m.birthday) return false;
      const bd = new Date(m.birthday);
      return bd.getMonth() + 1 === month && bd.getDate() === day;
    });

    if (birthdayMembers.length === 0) {
      this.logger.log('No birthdays today');
      return;
    }

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const existingBonuses = await this.prisma.pointTransaction.findMany({
      where: {
        memberId: { in: birthdayMembers.map(m => m.id) },
        type: 'EARN',
        reason: { contains: 'Birthday bonus' },
        createdAt: { gte: todayStart },
      },
      select: { memberId: true },
    });
    const existingSet = new Set(existingBonuses.map(e => e.memberId));

    const tenantGroups = new Map<string, typeof birthdayMembers>();
    for (const member of birthdayMembers) {
      if (existingSet.has(member.id)) continue;
      const group = tenantGroups.get(member.tenantId) || [];
      group.push(member);
      tenantGroups.set(member.tenantId, group);
    }

    let totalBonus = 0;
    const bonusOps: { memberId: string; amount: number; balance: number }[] = [];
    const memberUpdates: { id: string; amount: number }[] = [];

    for (const [tenantId, tenantMembers] of tenantGroups) {
      const settings = await this.settingsService.getTenantSettings(tenantId);
      const bonusAmount = settings.loyaltyConfig?.birthdayBonus ?? 50000;
      if (bonusAmount <= 0) continue;

      for (const member of tenantMembers) {
        bonusOps.push({
          memberId: member.id,
          amount: bonusAmount,
          balance: member.availablePoints + bonusAmount,
        });
        memberUpdates.push({ id: member.id, amount: bonusAmount });
        totalBonus += bonusAmount;
      }
    }

    if (bonusOps.length > 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.pointTransaction.createMany({
          data: bonusOps.map(op => ({
            memberId: op.memberId,
            type: 'EARN' as const,
            amount: op.amount,
            balance: op.balance,
            reason: 'Birthday bonus',
          })),
        });
        for (const m of memberUpdates) {
          await tx.member.update({
            where: { id: m.id },
            data: {
              totalPoints: { increment: m.amount },
              availablePoints: { increment: m.amount },
            },
          });
        }
      });
    }

    this.logger.log(`Birthday bonuses assigned: ${totalBonus} points to ${birthdayMembers.length} members`);
  }
}
