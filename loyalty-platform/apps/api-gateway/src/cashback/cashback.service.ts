import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CashbackService {
  constructor(private prisma: PrismaService) {}

  async createConfig(data: { name: string; description?: string; rate: number; minAmount?: number; maxAmount?: number; minPointsBalance?: number; startDate?: string; endDate?: string; tenantId: string }) {
    return this.prisma.cashbackConfig.create({
      data: {
        ...data,
        rate: data.rate || 0.01,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  async listConfigs(tenantId?: string, page = 1, limit = 20) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.cashbackConfig.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.cashbackConfig.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getConfig(id: string) {
    const config = await this.prisma.cashbackConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('Cashback config not found');
    return config;
  }

  async updateConfig(id: string, data: any) {
    await this.getConfig(id);
    return this.prisma.cashbackConfig.update({ where: { id }, data });
  }

  async deleteConfig(id: string) {
    await this.getConfig(id);
    return this.prisma.cashbackConfig.delete({ where: { id } });
  }

  async getBalance(memberId: string) {
    const aggregations = await this.prisma.cashbackTransaction.aggregate({
      where: { memberId },
      _sum: { amount: true },
    });
    return { balance: aggregations._sum.amount || 0 };
  }

  async earn(memberId: string, amount: number, description?: string, referenceId?: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const currentBalance = (await this.getBalance(memberId)).balance;
    const newBalance = currentBalance + amount;

    return this.prisma.cashbackTransaction.create({
      data: {
        memberId,
        type: 'EARN',
        amount,
        balance: newBalance,
        description: description || 'Cashback earned',
        referenceId,
        tenantId: member.tenantId,
      },
    });
  }

  async redeem(memberId: string, amount: number, description?: string) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const currentBalance = (await this.getBalance(memberId)).balance;
    if (currentBalance < amount) throw new BadRequestException('Insufficient cashback balance');

    const newBalance = currentBalance - amount;

    return this.prisma.cashbackTransaction.create({
      data: {
        memberId,
        type: 'REDEEM',
        amount: -Math.abs(amount),
        balance: newBalance,
        description: description || 'Cashback redeemed',
        tenantId: member.tenantId,
      },
    });
  }

  async getTransactions(memberId: string, page = 1, limit = 20, type?: string) {
    const where: any = { memberId };
    if (type) where.type = type;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.cashbackTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.cashbackTransaction.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
