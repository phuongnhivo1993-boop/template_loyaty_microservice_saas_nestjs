import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebSocketEventService {
  constructor(private prisma: PrismaService) {}

  async log(event: string, payload: any, room?: string, memberId?: string, tenantId?: string) {
    return this.prisma.webSocketEventLog.create({
      data: { event, payload: payload as any, room, memberId, tenantId },
    });
  }

  async replay(room?: string, memberId?: string, since?: string, limit = 50) {
    const where: any = {};
    if (room) where.room = room;
    if (memberId) where.memberId = memberId;
    if (since) where.createdAt = { gte: new Date(since) };
    return this.prisma.webSocketEventLog.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async getRecent(limit = 50) {
    return this.prisma.webSocketEventLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
