import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberSelfService {
  constructor(private prisma: PrismaService) {}

  async getProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const { ...data } = member;
    return data;
  }

  async getWallet(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const transactions = await this.prisma.pointTransaction.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      tier: member.tier?.name || 'N/A',
      totalPoints: member.totalPoints,
      availablePoints: member.availablePoints,
      recentTransactions: transactions,
    };
  }

  async changePassword(memberId: string, oldPassword: string, newPassword: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    throw new BadRequestException('Password change requires password to be stored first');
  }

  async getBadges(memberId: string) {
    const badges = await this.prisma.badge.findMany({
      where: { tenant: { members: { some: { id: memberId } } } },
    });
    return badges;
  }

  async getReferrals(memberId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: memberId },
      include: { referee: true },
      orderBy: { createdAt: 'desc' },
    });
    const total = referrals.length;
    const converted = referrals.filter(r => r.status === 'CONVERTED').length;
    return {
      referralCode: `REF-${memberId.slice(0, 8)}`,
      total,
      converted,
      rate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
      referrals,
    };
  }
}
