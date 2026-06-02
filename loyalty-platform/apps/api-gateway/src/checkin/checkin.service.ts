import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async doCheckin(memberId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCheckedIn = await this.prisma.dailyCheckin.findUnique({
      where: { memberId_date: { memberId, date: today } },
    });
    if (alreadyCheckedIn) throw new BadRequestException('Already checked in today');

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckin = await this.prisma.dailyCheckin.findUnique({
      where: { memberId_date: { memberId, date: yesterday } },
    });

    const streak = yesterdayCheckin ? yesterdayCheckin.streak + 1 : 1;
    const pointsAwarded = Math.min(10 + (streak - 1) * 5, 100);

    const checkin = await this.prisma.dailyCheckin.create({
      data: { memberId, date: today, streak, pointsAwarded },
    });

    await this.prisma.$transaction([
      this.prisma.pointTransaction.create({
        data: {
          memberId,
          type: 'EARN',
          amount: pointsAwarded,
          balance: 0,
          reason: `Daily check-in (streak: ${streak})`,
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: {
          totalPoints: { increment: pointsAwarded },
          availablePoints: { increment: pointsAwarded },
        },
      }),
    ]);

    return checkin;
  }

  async getStats(memberId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCheckins, latest, todayCheckin] = await Promise.all([
      this.prisma.dailyCheckin.count({ where: { memberId } }),
      this.prisma.dailyCheckin.findFirst({
        where: { memberId },
        orderBy: { date: 'desc' },
      }),
      this.prisma.dailyCheckin.findUnique({
        where: { memberId_date: { memberId, date: today } },
      }),
    ]);

    return {
      currentStreak: todayCheckin?.streak ?? 0,
      totalCheckins,
      longestStreak: latest?.streak ?? 0,
      checkedInToday: !!todayCheckin,
    };
  }

  async getHistory(memberId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.dailyCheckin.findMany({
      where: { memberId, date: { gte: startOfMonth } },
      orderBy: { date: 'desc' },
    });
  }

  async getAdminStats(tenantId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const memberFilter = tenantId ? { member: { tenantId } } : {};
    const tenantFilter = tenantId ? { tenantId } : {};

    const [checkedInToday, totalThisMonth, streaks, recent] = await Promise.all([
      this.prisma.dailyCheckin.count({
        where: { date: today, ...memberFilter },
      }),
      this.prisma.dailyCheckin.count({
        where: { date: { gte: startOfMonth }, ...memberFilter },
      }),
      this.prisma.dailyCheckin.findMany({
        where: { ...memberFilter, streak: { gte: 7 } },
        include: { member: { select: { id: true, fullName: true, email: true } } },
        orderBy: { streak: 'desc' },
        take: 10,
      }),
      this.prisma.dailyCheckin.findMany({
        where: memberFilter,
        include: { member: { select: { id: true, fullName: true, email: true } } },
        orderBy: { date: 'desc' },
        take: 20,
      }),
    ]);

    return {
      checkedInToday,
      totalThisMonth,
      activeStreaks: streaks.length,
      topStreaks: (streaks as any[]).map(s => ({
        memberId: s.memberId,
        fullName: s.member?.fullName,
        email: s.member?.email,
        streak: s.streak,
        lastCheckin: s.date,
      })),
      recentActivity: (recent as any[]).map(r => ({
        id: r.id,
        memberId: r.memberId,
        fullName: r.member?.fullName,
        streak: r.streak,
        pointsAwarded: r.pointsAwarded,
        date: r.date,
      })),
    };
  }
}
