import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ENTITY_MAP: Record<string, string> = {
  tenants: 'tenant',
  members: 'member',
  users: 'user',
  tiers: 'tier',
  campaigns: 'campaign',
  rewards: 'reward',
  vouchers: 'voucher',
  products: 'product',
  promotions: 'promotion',
  referrals: 'referral',
  badges: 'badge',
  missions: 'mission',
  notificationTemplates: 'notificationTemplate',
  notificationLogs: 'notificationLog',
  memberVouchers: 'memberVoucher',
  pointTransactions: 'pointTransaction',
};

const SOFT_DELETE_ENTITIES = new Set(['tenant', 'member', 'user']);

@Injectable()
export class BulkService {
  constructor(private prisma: PrismaService) {}

  async bulkDelete(entity: string, ids: string[], tenantId?: string) {
    const modelName = ENTITY_MAP[entity];
    if (!modelName) throw new BadRequestException(`Unsupported entity: ${entity}`);
    const model = (this.prisma as any)[modelName];
    if (!model) throw new BadRequestException(`Model not found: ${modelName}`);

    const where: any = { id: { in: ids } };
    if (tenantId) where.tenantId = tenantId;

    if (SOFT_DELETE_ENTITIES.has(modelName)) {
      const result = await model.updateMany({
        where,
        data: { status: modelName === 'tenant' ? 'DISABLED' : 'INACTIVE' },
      });
      return { deleted: result.count, total: ids.length, soft: true };
    }

    const result = await model.deleteMany({ where });
    return { deleted: result.count, total: ids.length, soft: false };
  }

  async bulkRestore(entity: string, ids: string[], tenantId?: string) {
    const modelName = ENTITY_MAP[entity];
    if (!modelName) throw new BadRequestException(`Unsupported entity: ${entity}`);
    const model = (this.prisma as any)[modelName];
    if (!model) throw new BadRequestException(`Model not found: ${modelName}`);

    const where: any = { id: { in: ids } };
    if (tenantId) where.tenantId = tenantId;

    if (SOFT_DELETE_ENTITIES.has(modelName)) {
      if (modelName === 'tenant') {
        where.status = 'DISABLED';
      } else {
        where.status = 'INACTIVE';
      }
      const result = await model.updateMany({
        where,
        data: { status: 'ACTIVE' },
      });
      return { restored: result.count, total: ids.length, soft: true };
    }

    where.deletedAt = { not: null };
    const result = await model.updateMany({
      where,
      data: { deletedAt: null, status: 'ACTIVE' },
    });

    return { restored: result.count, total: ids.length, soft: true };
  }

  async bulkUpdateStatus(entity: string, ids: string[], status: string, tenantId?: string) {
    const modelName = ENTITY_MAP[entity];
    if (!modelName) throw new BadRequestException(`Unsupported entity: ${entity}`);
    const model = (this.prisma as any)[modelName];
    if (!model) throw new BadRequestException(`Model not found: ${modelName}`);

    const where: any = { id: { in: ids } };
    if (tenantId) where.tenantId = tenantId;

    const result = await model.updateMany({
      where,
      data: { status },
    });

    return { updated: result.count, total: ids.length };
  }
}
