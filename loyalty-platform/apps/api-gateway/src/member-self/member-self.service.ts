import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberSelfService {
  constructor(private prisma: PrismaService) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async getProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { tier: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    const { password, ...data } = member;
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

  async setPassword(memberId: string, password: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.password) throw new BadRequestException('Password already set. Use change-password instead.');
    await this.prisma.member.update({
      where: { id: memberId },
      data: { password: this.hashPassword(password) },
    });
    return { message: 'Password set successfully' };
  }

  async changePassword(memberId: string, oldPassword: string, newPassword: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (!member.password) throw new BadRequestException('No password set. Use set-password first.');
    if (member.password !== this.hashPassword(oldPassword)) {
      throw new BadRequestException('Current password is incorrect');
    }
    await this.prisma.member.update({
      where: { id: memberId },
      data: { password: this.hashPassword(newPassword) },
    });
    return { message: 'Password changed successfully' };
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

  async getVouchers(memberId: string) {
    const vouchers = await this.prisma.memberVoucher.findMany({
      where: { memberId },
      include: { voucher: true },
      orderBy: { createdAt: 'desc' },
    });
    return vouchers;
  }
}
