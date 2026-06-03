import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(data: { memberId: string; entityType: string; entityId: string; rating: number; content?: string }) {
    return this.prisma.memberFeedback.create({ data });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, entityType?: string, entityId?: string, rating?: number, status?: string, sort?: string) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (rating) where.rating = rating;
    if (status) where.status = status;
    if (tenantId) {
      where.member = { tenantId };
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.memberFeedback.findMany({
        where,
        orderBy: { [orderBy]: orderDirection },
        skip,
        take: limit,
        include: { member: { select: { id: true, fullName: true, avatar: true } } },
      }),
      this.prisma.memberFeedback.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const feedback = await this.prisma.memberFeedback.findUnique({ where: { id }, include: { member: { select: { id: true, fullName: true, avatar: true } } } });
    if (!feedback) throw new NotFoundException('Feedback not found');
    return feedback;
  }

  async update(id: string, data: { status?: string }) {
    await this.findOne(id);
    return this.prisma.memberFeedback.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.memberFeedback.delete({ where: { id } });
  }

  async getPublic(entityType: string, entityId: string) {
    const feedbacks = await this.prisma.memberFeedback.findMany({
      where: { entityType, entityId, status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { member: { select: { id: true, fullName: true, avatar: true } } },
    });

    const stats = await this.prisma.memberFeedback.groupBy({
      by: ['rating'],
      where: { entityType, entityId, status: 'PUBLISHED' },
      _count: { rating: true },
    });

    const total = feedbacks.length;
    const averageRating = total > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;

    return { feedbacks, stats: { total, averageRating, distribution: stats } };
  }
}
