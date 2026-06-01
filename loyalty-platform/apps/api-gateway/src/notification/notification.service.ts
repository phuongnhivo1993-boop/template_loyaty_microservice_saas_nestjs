import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface Template { id: string; name: string; type: string; subject: string; content: string; variables?: string; tenantId: string; createdAt: Date; updatedAt: Date; }
interface Log { id: string; templateId: string; recipient: string; channel: string; status: string; sentAt: Date; }

const templatesStore: Template[] = [];
const logsStore: Log[] = [];

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(data: { name: string; type: string; subject: string; content: string; variables?: string; tenantId: string }) {
    const template: Template = {
      id: `nt-${Date.now()}`,
      name: data.name,
      type: data.type,
      subject: data.subject,
      content: data.content,
      variables: data.variables,
      tenantId: data.tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    templatesStore.push(template);
    return template;
  }

  async listTemplates(tenantId?: string, page = 1, limit = 20) {
    let list = templatesStore;
    if (tenantId) list = list.filter(t => t.tenantId === tenantId);
    const total = list.length;
    const start = (page - 1) * limit;
    return { data: list.slice(start, start + limit), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateTemplate(id: string, data: { name?: string; subject?: string; content?: string; variables?: string }) {
    const idx = templatesStore.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException('Template not found');
    templatesStore[idx] = { ...templatesStore[idx], ...data, updatedAt: new Date() };
    return templatesStore[idx];
  }

  async deleteTemplate(id: string) {
    const idx = templatesStore.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException('Template not found');
    templatesStore.splice(idx, 1);
    return { deleted: true };
  }

  async send(data: { templateId: string; recipient: string; channel: string; variables?: Record<string, string> }) {
    const template = templatesStore.find(t => t.id === data.templateId);
    if (!template) throw new NotFoundException('Template not found');

    let content = template.content;
    if (data.variables) {
      for (const [key, val] of Object.entries(data.variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), val);
      }
    }

    const log: Log = {
      id: `nl-${Date.now()}`,
      templateId: data.templateId,
      recipient: data.recipient,
      channel: data.channel,
      status: 'SENT',
      sentAt: new Date(),
    };
    logsStore.push(log);

    return {
      logId: log.id,
      channel: data.channel,
      recipient: data.recipient,
      subject: template.subject,
      content,
      status: 'SENT',
    };
  }

  async listLogs(tenantId?: string, page = 1, limit = 20) {
    let list = logsStore;
    const total = list.length;
    const start = (page - 1) * limit;
    return { data: list.slice(start, start + limit), total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
