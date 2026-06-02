import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface TenantSettings {
  id: string;
  tenantId: string;
  theme: Record<string, any>;
  emailConfig: Record<string, any>;
  smsConfig: Record<string, any>;
  loyaltyConfig: Record<string, any>;
  updatedAt: Date;
}

interface PlatformSettings {
  id: string;
  maintenanceMode: boolean;
  defaultLanguage: string;
  currencies: string[];
  maxTenants: number;
  features: Record<string, boolean>;
}

const DEFAULT_TENANT_SETTINGS = {
  theme: { primaryColor: '#2563eb', logoUrl: null, brandName: null },
  emailConfig: { senderName: 'Loyalty Platform', senderEmail: null },
  smsConfig: { enabled: false, provider: null },
  loyaltyConfig: { defaultPointsPerCurrency: 1, pointExpiryDays: 365, minRedeemPoints: 100 },
};

const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  id: 'platform',
  maintenanceMode: false,
  defaultLanguage: 'vi',
  currencies: ['VND', 'USD'],
  maxTenants: 100,
  features: {
    referrals: true,
    gamification: true,
    notifications: true,
    analytics: true,
    importExport: true,
  },
};

@Injectable()
export class SettingsService {
  private platformSettings: PlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS };
  private tenantSettingsCache = new Map<string, TenantSettings>();

  constructor(private prisma: PrismaService) {}

  async getTenantSettings(tenantId: string): Promise<TenantSettings> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (this.tenantSettingsCache.has(tenantId)) {
      return this.tenantSettingsCache.get(tenantId)!;
    }

    return {
      id: tenantId,
      tenantId,
      ...DEFAULT_TENANT_SETTINGS,
      updatedAt: tenant.updatedAt,
    };
  }

  async updateTenantSettings(tenantId: string, data: Record<string, any>): Promise<TenantSettings> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const current = await this.getTenantSettings(tenantId);
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date(),
    };

    this.tenantSettingsCache.set(tenantId, updated);
    return updated;
  }

  async getPlatformSettings(): Promise<PlatformSettings> {
    return { ...this.platformSettings };
  }

  async updatePlatformSettings(data: Record<string, any>): Promise<PlatformSettings> {
    this.platformSettings = {
      ...this.platformSettings,
      ...data,
    };
    return { ...this.platformSettings };
  }
}
