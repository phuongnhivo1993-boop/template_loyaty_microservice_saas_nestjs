import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateNotificationTemplateDto, UpdateNotificationTemplateDto } from './dto/template.dto';
import { SendNotificationDto, BroadcastDto } from './dto/send.dto';

@Injectable()
export class NotificationServiceService {
  private readonly logger = new Logger(NotificationServiceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createTemplate(dto: CreateNotificationTemplateDto) {
    return this.prisma.notificationTemplate.create({ data: dto });
  }

  async updateTemplate(id: string, dto: UpdateNotificationTemplateDto) {
    const tmpl = await this.prisma.notificationTemplate.findUnique({ where: { id } });
    if (!tmpl) throw new NotFoundException('Template not found');
    return this.prisma.notificationTemplate.update({ where: { id }, data: dto });
  }

  async deleteTemplate(id: string) {
    const tmpl = await this.prisma.notificationTemplate.findUnique({ where: { id } });
    if (!tmpl) throw new NotFoundException('Template not found');
    return this.prisma.notificationTemplate.delete({ where: { id } });
  }

  async getTemplate(id: string) {
    const tmpl = await this.prisma.notificationTemplate.findUnique({ where: { id } });
    if (!tmpl) throw new NotFoundException('Template not found');
    return tmpl;
  }

  async listTemplates(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notificationTemplate.findMany({ where: { tenantId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.notificationTemplate.count({ where: { tenantId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private replaceVariables(content: string, subject: string, variables: Record<string, string>) {
    let resolvedContent = content;
    let resolvedSubject = subject;
    for (const [key, value] of Object.entries(variables)) {
      resolvedContent = resolvedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      resolvedSubject = resolvedSubject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return { content: resolvedContent, subject: resolvedSubject };
  }

  async send(dto: SendNotificationDto) {
    const tmpl = await this.prisma.notificationTemplate.findUnique({ where: { id: dto.templateId } });
    if (!tmpl) throw new NotFoundException('Template not found');

    const { content, subject } = this.replaceVariables(tmpl.content, tmpl.subject, dto.variables || {});

    const log = await this.prisma.notificationLog.create({
      data: {
        templateId: dto.templateId,
        recipient: dto.recipient,
        channel: dto.channel,
        subject,
        content,
        status: 'PENDING',
        sentAt: new Date(),
        tenantId: dto.tenantId || tmpl.tenantId,
      },
    });

    let deliverySuccess = false;
    if (dto.channel === 'email') {
      deliverySuccess = await this.mailService.sendEmail({
        to: dto.recipient,
        subject,
        html: content,
      });
    }

    await this.prisma.notificationLog.update({
      where: { id: log.id },
      data: { status: deliverySuccess ? 'SENT' : 'FAILED' },
    });

    return { id: log.id, status: deliverySuccess ? 'SENT' : 'FAILED', recipient: dto.recipient };
  }

  async broadcast(dto: BroadcastDto) {
    const tmpl = await this.prisma.notificationTemplate.findUnique({ where: { id: dto.templateId } });
    if (!tmpl) throw new NotFoundException('Template not found');

    const members = await this.prisma.member.findMany({
      where: { tenantId: dto.tenantId, status: 'ACTIVE' },
      select: { id: true, email: true, phone: true, fullName: true },
    });

    if (members.length === 0) {
      throw new BadRequestException('No active members found for broadcast');
    }

    let sent = 0;
    let failed = 0;

    for (const m of members) {
      const recipient = dto.channel === 'email' ? m.email : m.phone;
      const memberVars = { ...(dto.variables || {}), memberName: m.fullName, memberId: m.id };
      const { content, subject } = this.replaceVariables(tmpl.content, tmpl.subject, memberVars);

      const log = await this.prisma.notificationLog.create({
        data: {
          templateId: dto.templateId,
          recipient: recipient || m.email,
          channel: dto.channel,
          subject,
          content,
          status: 'PENDING',
          sentAt: new Date(),
          tenantId: dto.tenantId,
        },
      });

      let success = false;
      if (dto.channel === 'email' && recipient?.includes('@')) {
        success = await this.mailService.sendEmail({
          to: recipient,
          subject,
          html: content,
        });
      }

      await this.prisma.notificationLog.update({
        where: { id: log.id },
        data: { status: success ? 'SENT' : 'FAILED' },
      });

      if (success) sent++;
      else failed++;
    }

    return { sent, failed, total: members.length };
  }

  async getLogs(tenantId?: string, status?: string, channel?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (channel) where.channel = channel;

    const [data, total] = await Promise.all([
      this.prisma.notificationLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.notificationLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
