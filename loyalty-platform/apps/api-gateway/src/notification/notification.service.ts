import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(data: { name: string; type: string; subject: string; content: string; variables?: string; tenantId: string }) {
    return data;
  }

  async listTemplates(tenantId?: string, page = 1, limit = 20) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  async updateTemplate(id: string, data: { name?: string; subject?: string; content?: string; variables?: string }) {
    return { id, ...data };
  }

  async deleteTemplate(id: string) {
    return { deleted: true };
  }

  async send(data: { templateId: string; recipient: string; channel: string; variables?: Record<string, string> }) {
    const log = await this.prisma.notificationLog.create({
      data: {
        templateId: data.templateId,
        recipient: data.recipient,
        channel: data.channel,
        subject: 'Notification',
        content: JSON.stringify(data.variables || {}),
        status: 'SENT',
        sentAt: new Date(),
      },
    });
    return { logId: log.id, channel: data.channel, recipient: data.recipient, status: 'SENT' };
  }

  async listLogs(tenantId?: string, page = 1, limit = 20) {
    const where = tenantId ? { tenantId } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notificationLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.notificationLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
