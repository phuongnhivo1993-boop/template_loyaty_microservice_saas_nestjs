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

      for (const member of members) {
        const alreadyExpired = await this.prisma.pointTransaction.aggregate({
          where: { memberId: member.id, type: 'EXPIRE' },
          _sum: { amount: true },
        });
        const expiredSum = Math.abs(alreadyExpired._sum.amount ?? 0);
        const availableForExpiry = member.availablePoints - expiredSum;
        if (availableForExpiry <= 0) continue;

        const oldestEarns = await this.prisma.pointTransaction.findMany({
          where: { memberId: member.id, type: 'EARN', createdAt: { lte: cutoff } },
          orderBy: { createdAt: 'asc' },
          take: 100,
        });

        if (oldestEarns.length === 0) continue;

        const expiryAmount = oldestEarns.reduce((sum, tx) => sum + tx.amount, 0);
        const actualExpiry = Math.min(expiryAmount, availableForExpiry);

        if (actualExpiry <= 0) continue;

        await this.prisma.$transaction([
          this.prisma.pointTransaction.create({
            data: {
              memberId: member.id,
              type: 'EXPIRE',
              amount: -actualExpiry,
              balance: member.availablePoints - actualExpiry,
              reason: `Auto-expiry after ${expiryDays} days`,
            },
          }),
          this.prisma.member.update({
            where: { id: member.id },
            data: { availablePoints: { decrement: actualExpiry } },
          }),
        ]);
        totalExpired += actualExpiry;
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

    let totalBonus = 0;
    for (const member of birthdayMembers) {
      const settings = await this.settingsService.getTenantSettings(member.tenantId);
      const bonusAmount = settings.loyaltyConfig?.birthdayBonus ?? 50000;

      if (bonusAmount <= 0) continue;

      const existing = await this.prisma.pointTransaction.findFirst({
        where: {
          memberId: member.id,
          type: 'EARN',
          reason: { contains: 'Birthday bonus' },
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          },
        },
      });
      if (existing) continue;

      await this.prisma.$transaction([
        this.prisma.pointTransaction.create({
          data: {
            memberId: member.id,
            type: 'EARN',
            amount: bonusAmount,
            balance: member.availablePoints + bonusAmount,
            reason: 'Birthday bonus',
          },
        }),
        this.prisma.member.update({
          where: { id: member.id },
          data: {
            totalPoints: { increment: bonusAmount },
            availablePoints: { increment: bonusAmount },
          },
        }),
      ]);
      totalBonus += bonusAmount;
    }
    this.logger.log(`Birthday bonuses assigned: ${totalBonus} points to ${birthdayMembers.length} members`);
  }
}
