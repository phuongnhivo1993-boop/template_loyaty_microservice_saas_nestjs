import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getTenantSettings(tenantId: string): Promise<Record<string, any>> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const rows = await this.prisma.settings.findMany({
      where: { scope: 'tenant', scopeId: tenantId },
    });

    const settings: Record<string, any> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return {
      theme: settings.theme ?? { primaryColor: '#2563eb', logoUrl: null, brandName: null },
      emailConfig: settings.emailConfig ?? { senderName: 'Loyalty Platform', senderEmail: null },
      smsConfig: settings.smsConfig ?? { enabled: false, provider: null },
      loyaltyConfig: settings.loyaltyConfig ?? { defaultPointsPerCurrency: 1, pointExpiryDays: 365, minRedeemPoints: 100 },
    };
  }

  async updateTenantSettings(tenantId: string, data: Record<string, any>): Promise<Record<string, any>> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          const fullKey = `${key}.${subKey}`;
          await this.prisma.settings.upsert({
            where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: fullKey } },
            update: { value: subValue as any },
            create: { scope: 'tenant', scopeId: tenantId, key: fullKey, value: subValue as any },
          });
        }
      } else {
        await this.prisma.settings.upsert({
          where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key } },
          update: { value: value as any },
          create: { scope: 'tenant', scopeId: tenantId, key, value: value as any },
        });
      }
    }

    return this.getTenantSettings(tenantId);
  }

  async getPlatformSettings(): Promise<Record<string, any>> {
    const rows = await this.prisma.settings.findMany({
      where: { scope: 'platform', scopeId: '_platform' },
    });

    const settings: Record<string, any> = { id: 'platform' };
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return {
      maintenanceMode: settings.maintenanceMode ?? false,
      defaultLanguage: settings.defaultLanguage ?? 'vi',
      currencies: settings.currencies ?? ['VND', 'USD'],
      maxTenants: settings.maxTenants ?? 100,
      features: settings.features ?? {
        referrals: true,
        gamification: true,
        notifications: true,
        analytics: true,
        importExport: true,
      },
    };
  }

  async updatePlatformSettings(data: Record<string, any>): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          const fullKey = `${key}.${subKey}`;
          await this.prisma.settings.upsert({
            where: { scope_scopeId_key: { scope: 'platform', scopeId: '_platform', key: fullKey } },
            update: { value: subValue as any },
            create: { scope: 'platform', scopeId: '_platform', key: fullKey, value: subValue as any },
          });
        }
      } else {
        await this.prisma.settings.upsert({
          where: { scope_scopeId_key: { scope: 'platform', scopeId: '_platform', key } },
          update: { value: value as any },
          create: { scope: 'platform', scopeId: '_platform', key, value: value as any },
        });
      }
    }

    return this.getPlatformSettings();
  }
}
