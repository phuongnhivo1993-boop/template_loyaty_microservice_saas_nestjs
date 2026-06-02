import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    entityType: string;
    entityId: string;
    action: string;
    userId?: string;
    userEmail?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({ data: params });
  }

  async findAll(page = 1, limit = 20, search?: string, entityType?: string, action?: string, userId?: string, sort?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { entityType: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
