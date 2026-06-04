import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationTriggerService {
  private readonly logger = new Logger(NotificationTriggerService.name);

  constructor(private prisma: PrismaService) {}

  async sendWelcome(memberEmail: string, memberName: string, tenantId: string): Promise<void> {
    try {
      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId, name: { contains: 'welcome', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No welcome template found for tenant ${tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{memberName}}/g, memberName)
        .replace(/{{fullName}}/g, memberName)
        .replace(/{{memberEmail}}/g, memberEmail)
        .replace(/{{email}}/g, memberEmail)
        .replace(/{{tierName}}/g, 'Member');

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: memberEmail,
          channel: 'email',
          subject: template.subject
            .replace(/{{memberName}}/g, memberName)
            .replace(/{{fullName}}/g, memberName)
            .replace(/{{tierName}}/g, 'Member'),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId,
        },
      });
      this.logger.log(`Welcome notification sent to ${memberEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome notification to ${memberEmail}`, error);
    }
  }

  async sendPointsEarned(memberEmail: string, points: number, reason: string, tenantId: string): Promise<void> {
    try {
      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId, name: { contains: 'points_earned', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No points_earned template found for tenant ${tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{memberEmail}}/g, memberEmail)
        .replace(/{{points}}/g, points.toLocaleString())
        .replace(/{{reason}}/g, reason);

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: memberEmail,
          channel: 'email',
          subject: template.subject.replace(/{{points}}/g, points.toLocaleString()),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId,
        },
      });
      this.logger.log(`Points earned notification sent to ${memberEmail}: ${points} points`);
    } catch (error) {
      this.logger.error(`Failed to send points earned notification to ${memberEmail}`, error);
    }
  }

  async sendTierChanged(memberEmail: string, oldTier: string, newTier: string, tenantId: string): Promise<void> {
    try {
      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId, name: { contains: 'tier_changed', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No tier_changed template found for tenant ${tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{memberEmail}}/g, memberEmail)
        .replace(/{{oldTier}}/g, oldTier)
        .replace(/{{newTier}}/g, newTier);

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: memberEmail,
          channel: 'email',
          subject: template.subject.replace(/{{newTier}}/g, newTier),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId,
        },
      });
      this.logger.log(`Tier changed notification sent to ${memberEmail}: ${oldTier} -> ${newTier}`);
    } catch (error) {
      this.logger.error(`Failed to send tier changed notification to ${memberEmail}`, error);
    }
  }

  async sendOrderConfirmation(memberEmail: string, orderCode: string, total: number, tenantId: string): Promise<void> {
    try {
      const template = await this.prisma.notificationTemplate.findFirst({
        where: { tenantId, name: { contains: 'order_confirmation', mode: 'insensitive' } },
      });
      if (!template) {
        this.logger.log(`No order_confirmation template found for tenant ${tenantId}`);
        return;
      }
      const content = template.content
        .replace(/{{memberEmail}}/g, memberEmail)
        .replace(/{{orderCode}}/g, orderCode)
        .replace(/{{total}}/g, total.toLocaleString());

      await this.prisma.notificationLog.create({
        data: {
          templateId: template.id,
          recipient: memberEmail,
          channel: 'email',
          subject: template.subject.replace(/{{orderCode}}/g, orderCode),
          content,
          status: 'SENT',
          sentAt: new Date(),
          tenantId,
        },
      });
      this.logger.log(`Order confirmation sent to ${memberEmail} for order ${orderCode}`);
    } catch (error) {
      this.logger.error(`Failed to send order confirmation to ${memberEmail}`, error);
    }
  }
}
