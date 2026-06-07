import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  private generateKey(): string {
    return `lp_${crypto.randomBytes(32).toString('hex')}`;
  }

  private maskKey(key: string): string {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  }

  async create(tenantId: string, data: { name: string; permissions?: string[] }) {
    const rawKey = this.generateKey();
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
    });

    const apiKeys = (settings?.value as any[]) ?? [];
    const newKey = {
      id: crypto.randomUUID(),
      name: data.name,
      key: rawKey,
      maskedKey: this.maskKey(rawKey),
      permissions: data.permissions ?? [],
      active: true,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apiKeys.push(newKey);

    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
      update: { value: apiKeys },
      create: { scope: 'tenant', scopeId: tenantId, key: 'api_keys', value: apiKeys },
    });

    return newKey;
  }

  async findAll(tenantId: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
    });
    const apiKeys = (settings?.value as any[]) ?? [];
    return apiKeys.map(k => ({ ...k, key: undefined }));
  }

  async findOne(tenantId: string, id: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
    });
    const apiKeys = (settings?.value as any[]) ?? [];
    const key = apiKeys.find(k => k.id === id);
    if (!key) throw new NotFoundException('API key not found');
    return { ...key, key: undefined };
  }

  async remove(tenantId: string, id: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
    });
    const apiKeys = (settings?.value as any[]) ?? [];
    const filtered = apiKeys.filter(k => k.id !== id);
    if (filtered.length === apiKeys.length) throw new NotFoundException('API key not found');

    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
      update: { value: filtered },
      create: { scope: 'tenant', scopeId: tenantId, key: 'api_keys', value: filtered },
    });

    return { message: 'API key revoked' };
  }

  async regenerate(tenantId: string, id: string) {
    const settings = await this.prisma.settings.findUnique({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
    });
    const apiKeys = (settings?.value as any[]) ?? [];
    const idx = apiKeys.findIndex(k => k.id === id);
    if (idx === -1) throw new NotFoundException('API key not found');

    const rawKey = this.generateKey();
    apiKeys[idx].key = rawKey;
    apiKeys[idx].maskedKey = this.maskKey(rawKey);
    apiKeys[idx].updatedAt = new Date().toISOString();

    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: 'tenant', scopeId: tenantId, key: 'api_keys' } },
      update: { value: apiKeys },
      create: { scope: 'tenant', scopeId: tenantId, key: 'api_keys', value: apiKeys },
    });

    return apiKeys[idx];
  }
}
