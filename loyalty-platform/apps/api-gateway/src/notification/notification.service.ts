import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(data: { name: string; type: string; subject: string; content: string; variables?: string; tenantId: string }) {
    return this.prisma.notificationTemplate.create({ data });
  }

  async listTemplates(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notificationTemplate.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.notificationTemplate.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findTemplateOne(id: string) {
    const template = await this.prisma.notificationTemplate.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Notification template not found');
    return template;
  }

  async updateTemplate(id: string, data: { name?: string; subject?: string; content?: string; variables?: string }) {
    await this.findTemplateOne(id);
    return this.prisma.notificationTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    await this.findTemplateOne(id);
    await this.prisma.notificationTemplate.delete({ where: { id } });
    return { deleted: true };
  }

  async send(data: { templateId: string; recipient: string; channel: string; variables?: Record<string, string> }) {
    const template = await this.prisma.notificationTemplate.findUnique({ where: { id: data.templateId } });
    if (!template) throw new NotFoundException('Notification template not found');

    const content = data.variables
      ? Object.entries(data.variables).reduce((acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val), template.content)
      : template.content;

    const log = await this.prisma.notificationLog.create({
      data: {
        templateId: data.templateId,
        recipient: data.recipient,
        channel: data.channel,
        subject: template.subject,
        content,
        status: 'SENT',
        sentAt: new Date(),
        tenantId: template.tenantId,
      },
    });
    return { logId: log.id, channel: data.channel, recipient: data.recipient, status: 'SENT' };
  }

  async listLogs(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { recipient: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notificationLog.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.notificationLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
