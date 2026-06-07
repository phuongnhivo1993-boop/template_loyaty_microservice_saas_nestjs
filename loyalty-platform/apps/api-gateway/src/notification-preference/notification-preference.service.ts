import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_PREFERENCES = {
  email: { marketing: true, points: true, rewards: true, promotions: true },
  sms: { marketing: false, points: true, rewards: false },
  push: { marketing: false, points: true, rewards: true },
};

@Injectable()
export class NotificationPreferenceService {
  constructor(private prisma: PrismaService) {}

  async get(tenantId: string, memberId: string) {
    const key = `notif_prefs_${memberId}`;
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key } },
    });
    return (settings?.value as any) ?? DEFAULT_PREFERENCES;
  }

  async update(tenantId: string, memberId: string, data: Record<string, any>) {
    const key = `notif_prefs_${memberId}`;
    const current = await this.get(tenantId, memberId);
    const merged = this.deepMerge(current, data);

    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key } },
      update: { value: merged },
      create: { scope: 'tenant', scopeId: tenantId, key, value: merged },
    });

    return merged;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] ?? {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}
