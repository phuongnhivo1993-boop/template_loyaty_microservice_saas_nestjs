import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';
import * as crypto from 'crypto';

@Injectable()
export class GiftCardService {
  constructor(private prisma: PrismaService) {}

  async create(data: { initialValue: number; type?: string; expiresAt?: string; tenantId: string }) {
    const code = 'GC' + crypto.randomBytes(4).toString('hex').toUpperCase();
    return this.prisma.giftCard.create({
      data: {
        code,
        initialValue: data.initialValue,
        balance: data.initialValue,
        type: data.type || 'digital',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        tenantId: data.tenantId,
      },
    });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, status?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (search) {
      where.OR = [{ code: { contains: search, mode: 'insensitive' } }];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.giftCard.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.giftCard.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const card = await this.prisma.giftCard.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Gift card not found');
    return card;
  }

  async update(id: string, data: { balance?: number; status?: string }) {
    await this.findOne(id);
    return this.prisma.giftCard.update({ where: { id }, data });
  }

  async assign(id: string, memberId: string) {
    const card = await this.findOne(id);
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');
    if (card.status !== 'ACTIVE') throw new BadRequestException('Gift card is not active');

    await this.prisma.memberGiftCard.create({ data: { memberId, giftCardId: id, balance: card.balance } });
    return { message: 'Gift card assigned successfully' };
  }

  async getMemberGiftCards(memberId: string) {
    return this.prisma.memberGiftCard.findMany({
      where: { memberId },
      include: { giftCard: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async redeem(id: string, memberId: string, amount: number) {
    const card = await this.findOne(id);
    if (card.balance < amount) throw new BadRequestException('Insufficient gift card balance');

    const memberCard = await this.prisma.memberGiftCard.findFirst({
      where: { giftCardId: id, memberId },
    });
    if (!memberCard) throw new BadRequestException('Gift card not assigned to this member');

    await this.prisma.$transaction(async (tx) => {
      await tx.giftCard.update({ where: { id }, data: { balance: { decrement: amount } } });
      await tx.memberGiftCard.update({ where: { id: memberCard.id }, data: { balance: { decrement: amount } } });
    });

    return { message: 'Gift card redeemed successfully', amount };
  }
}
