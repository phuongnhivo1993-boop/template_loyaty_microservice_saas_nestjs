import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationTriggerService {
  private readonly logger = new Logger(NotificationTriggerService.name);

  constructor(private prisma: PrismaService) {}

  async sendWelcome(member: { id: string; email: string; fullName: string; tenantId: string }) {
    try {
      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId: member.tenantId, name: { contains: 'welcome', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No welcome template found for tenant ${member.tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{fullName}}/g, member.fullName)
        .replace(/{{email}}/g, member.email);

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: member.email,
          channel: 'email',
          subject: template.subject.replace(/{{fullName}}/g, member.fullName),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId: member.tenantId,
        },
      });
      this.logger.log(`Welcome notification sent to ${member.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome notification to ${member.email}`, error);
    }
  }

  async sendPointsEarned(memberId: string, amount: number, reason?: string) {
    try {
      const member = await this.prisma.member.findUnique({
        where: { id: memberId },
        select: { email: true, fullName: true, tenantId: true, availablePoints: true },
      });
      if (!member) return;

      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId: member.tenantId, name: { contains: 'points_earned', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No points_earned template found for tenant ${member.tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{fullName}}/g, member.fullName)
        .replace(/{{amount}}/g, amount.toLocaleString())
        .replace(/{{balance}}/g, member.availablePoints.toLocaleString())
        .replace(/{{reason}}/g, reason || '');

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: member.email,
          channel: 'email',
          subject: template.subject.replace(/{{amount}}/g, amount.toLocaleString()),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId: member.tenantId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send points earned notification to member ${memberId}`, error);
    }
  }

  async sendTierChanged(memberId: string, oldTierName: string, newTierName: string) {
    try {
      const member = await this.prisma.member.findUnique({
        where: { id: memberId },
        select: { email: true, fullName: true, tenantId: true },
      });
      if (!member) return;

      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId: member.tenantId, name: { contains: 'tier_changed', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No tier_changed template found for tenant ${member.tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{fullName}}/g, member.fullName)
        .replace(/{{oldTier}}/g, oldTierName)
        .replace(/{{newTier}}/g, newTierName);

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: member.email,
          channel: 'email',
          subject: template.subject.replace(/{{newTier}}/g, newTierName),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId: member.tenantId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send tier changed notification to member ${memberId}`, error);
    }
  }
}
