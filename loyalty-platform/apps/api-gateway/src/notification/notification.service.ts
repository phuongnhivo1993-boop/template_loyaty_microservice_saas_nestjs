import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3010';

function getInternalApiKey(): string {
  const key = process.env.INTERNAL_API_KEY;
  if (!key) {
    throw new Error('INTERNAL_API_KEY environment variable is required');
  }
  return key;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  private async dispatchToService(endpoint: string, payload: any): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(`${NOTIFICATION_SERVICE_URL}/api/v1/notifications${endpoint}`, payload, {
          headers: { 'x-api-key': getInternalApiKey(), 'Content-Type': 'application/json' },
          timeout: 10000,
        }),
      );
    } catch (err: any) {
      this.logger.error(`Notification service call failed (${endpoint}): ${err.message}`);
      throw new Error(`Failed to send notification: ${err.message}`);
    }
  }

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

    if (data.channel === 'email') {
      await this.dispatchToService('/send', {
        recipient: data.recipient,
        channel: 'email',
        subject: template.subject,
        content,
      });
    }

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

  async sendDirect(data: { recipient: string; subject: string; content: string }) {
    await this.dispatchToService('/send', {
      recipient: data.recipient,
      channel: 'email',
      subject: data.subject,
      content: data.content,
    });

    const log = await this.prisma.notificationLog.create({
      data: {
        templateId: '',
        recipient: data.recipient,
        channel: 'email',
        subject: data.subject,
        content: data.content,
        status: 'SENT',
        sentAt: new Date(),
        tenantId: '',
      },
    });
    return { logId: log.id, channel: 'email', recipient: data.recipient, status: 'SENT' };
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

  async broadcast(data: { templateId: string; channel: string; variables?: Record<string, string>; tenantId: string }) {
    const template = await this.prisma.notificationTemplate.findUnique({ where: { id: data.templateId } });
    if (!template) throw new NotFoundException('Notification template not found');

    const members = await this.prisma.member.findMany({
      where: { tenantId: data.tenantId, status: 'ACTIVE' },
    });

    if (members.length === 0) {
      return { sent: 0, total: 0, message: 'No active members found for this tenant' };
    }

    const logs = members.map((member) => {
      const content = data.variables
        ? Object.entries(data.variables).reduce((acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val), template.content)
        : template.content;

      return {
        templateId: data.templateId,
        recipient: member.email,
        channel: data.channel,
        subject: template.subject,
        content,
        status: 'SENT',
        sentAt: new Date(),
        tenantId: data.tenantId,
      };
    });

    if (data.channel === 'email') {
      await this.dispatchToService('/broadcast', {
        templateId: data.templateId,
        channel: 'email',
        variables: data.variables,
        tenantId: data.tenantId,
      });
    }

    await this.prisma.notificationLog.createMany({ data: logs });

    return { sent: logs.length, total: members.length, message: `Notification sent to ${logs.length} members` };
  }

  async findLogOne(id: string) {
    const log = await this.prisma.notificationLog.findUnique({
      where: { id },
    });
    if (!log) throw new NotFoundException('Notification log not found');
    return log;
  }

  async markAsRead(id: string, userId: string) {
    const log = await this.prisma.notificationLog.findUnique({
      where: { id },
    });
    if (!log) throw new NotFoundException('Notification log not found');
    if (log.recipient !== userId) throw new NotFoundException('Notification log not found');
    return this.prisma.notificationLog.update({
      where: { id },
      data: { status: 'READ' },
    });
  }
}
