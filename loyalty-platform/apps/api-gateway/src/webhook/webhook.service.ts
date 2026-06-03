import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  async createEndpoint(data: { name: string; url: string; secret?: string; events: string[]; tenantId: string }) {
    return this.prisma.webhookEndpoint.create({ data });
  }

  async listEndpoints(tenantId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    return this.prisma.webhookEndpoint.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getEndpoint(id: string) {
    const endpoint = await this.prisma.webhookEndpoint.findUnique({ where: { id } });
    if (!endpoint) throw new NotFoundException('Webhook endpoint not found');
    return endpoint;
  }

  async updateEndpoint(id: string, data: { name?: string; url?: string; secret?: string; events?: string[]; active?: boolean }) {
    await this.getEndpoint(id);
    return this.prisma.webhookEndpoint.update({ where: { id }, data });
  }

  async deleteEndpoint(id: string) {
    await this.getEndpoint(id);
    await this.prisma.webhookEventLog.deleteMany({ where: { endpointId: id } });
    return this.prisma.webhookEndpoint.delete({ where: { id } });
  }

  async testEndpoint(id: string) {
    const endpoint = await this.getEndpoint(id);
    const payload = { event: 'test', timestamp: new Date().toISOString(), data: { message: 'Webhook test from Loyalty Platform' } };
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': endpoint.secret || '',
          'X-Event': 'test',
        },
        body: JSON.stringify(payload),
      });
      await this.prisma.webhookEventLog.create({
        data: {
          endpointId: id,
          event: 'test',
          payload,
          responseCode: response.status,
          responseBody: await response.text(),
          success: response.ok,
        },
      });
      return { success: response.ok, statusCode: response.status };
    } catch (error) {
      await this.prisma.webhookEventLog.create({
        data: {
          endpointId: id,
          event: 'test',
          payload,
          responseCode: 0,
          responseBody: error.message,
          success: false,
        },
      });
      return { success: false, error: error.message };
    }
  }

  async listLogs(endpointId?: string, page = 1, limit = 20) {
    const where: any = {};
    if (endpointId) where.endpointId = endpointId;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.webhookEventLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.webhookEventLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getLog(id: string) {
    const log = await this.prisma.webhookEventLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Webhook log not found');
    return log;
  }

  async dispatch(eventName: string, payload: any, tenantId: string) {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: { tenantId, active: true, events: { has: eventName } },
    });
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': endpoint.secret || '',
            'X-Event': eventName,
          },
          body: JSON.stringify({ event: eventName, timestamp: new Date().toISOString(), data: payload }),
        });
        await this.prisma.webhookEventLog.create({
          data: {
            endpointId: endpoint.id,
            event: eventName,
            payload,
            responseCode: response.status,
            responseBody: await response.text(),
            success: response.ok,
          },
        });
        if (!response.ok) {
          await this.prisma.webhookEndpoint.update({ where: { id: endpoint.id }, data: { failureCount: { increment: 1 } } });
        }
      } catch (error) {
        await this.prisma.webhookEventLog.create({
          data: {
            endpointId: endpoint.id,
            event: eventName,
            payload,
            responseCode: 0,
            responseBody: error.message,
            success: false,
          },
        });
        await this.prisma.webhookEndpoint.update({ where: { id: endpoint.id }, data: { failureCount: { increment: 1 } } });
      }
    }
  }
}
