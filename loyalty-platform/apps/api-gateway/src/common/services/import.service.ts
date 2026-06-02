import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ImportConfig {
  requiredFields: string[];
  optionalFields: string[];
  transform?: (row: Record<string, string>) => Record<string, any>;
}

const entityConfigs: Record<string, ImportConfig> = {
  tenants: {
    requiredFields: ['name', 'domain', 'email'],
    optionalFields: ['phone', 'address', 'status'],
    transform: (row) => ({
      name: row.name,
      domain: row.domain,
      email: row.email,
      phone: row.phone || undefined,
      address: row.address || undefined,
      status: (row.status || 'ACTIVE').toUpperCase(),
      hostId: row.hostId || undefined,
    }),
  },
  members: {
    requiredFields: ['fullName', 'email'],
    optionalFields: ['phone', 'status', 'availablePoints', 'tierId'],
    transform: (row) => ({
      fullName: row.fullName,
      email: row.email,
      phone: row.phone || undefined,
      status: (row.status || 'ACTIVE').toUpperCase(),
      availablePoints: row.availablePoints ? parseInt(row.availablePoints, 10) : 0,
      totalPoints: row.availablePoints ? parseInt(row.availablePoints, 10) : 0,
      tierId: row.tierId || undefined,
      tenantId: row.tenantId || undefined,
    }),
  },
  campaigns: {
    requiredFields: ['name', 'startDate', 'endDate'],
    optionalFields: ['description', 'budget', 'status'],
    transform: (row) => ({
      name: row.name,
      description: row.description || undefined,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      budget: row.budget ? parseFloat(row.budget) : undefined,
      status: (row.status || 'DRAFT').toUpperCase(),
      tenantId: row.tenantId || undefined,
    }),
  },
  rewards: {
    requiredFields: ['name', 'type', 'pointsRequired'],
    optionalFields: ['description', 'quantity', 'imageUrl'],
    transform: (row) => ({
      name: row.name,
      type: row.type,
      description: row.description || undefined,
      pointsRequired: parseInt(row.pointsRequired, 10),
      quantity: row.quantity ? parseInt(row.quantity, 10) : 0,
      imageUrl: row.imageUrl || undefined,
      tenantId: row.tenantId || undefined,
    }),
  },
  vouchers: {
    requiredFields: ['code', 'type', 'value'],
    optionalFields: ['maxUsage', 'expiresAt'],
    transform: (row) => ({
      code: row.code,
      type: row.type,
      value: parseFloat(row.value),
      maxUsage: row.maxUsage ? parseInt(row.maxUsage, 10) : undefined,
      expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
      tenantId: row.tenantId || undefined,
    }),
  },
};

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async importCsv(entity: string, csvContent: string, tenantId?: string) {
    const config = entityConfigs[entity];
    if (!config) throw new BadRequestException(`Unsupported entity: ${entity}`);

    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new BadRequestException('CSV must have a header row and at least one data row');

    const headers = this.parseCsvRow(lines[0]);
    const missing = config.requiredFields.filter(f => !headers.includes(f));
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required columns: ${missing.join(', ')}`);
    }

    const errors: { row: number; message: string }[] = [];
    const created: Record<string, any>[] = [];
    const prismaModel = (this.prisma as any)[entity === 'members' ? 'member' : entity === 'tenants' ? 'tenant' : entity === 'rewards' ? 'reward' : entity === 'vouchers' ? 'voucher' : entity];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCsvRow(lines[i]);
        if (values.length === 0 || values.every(v => !v.trim())) continue;
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });

        const missingFields = config.requiredFields.filter(f => !row[f]);
        if (missingFields.length > 0) {
          errors.push({ row: i + 1, message: `Missing required fields: ${missingFields.join(', ')}` });
          continue;
        }

        const data = config.transform!(row);
        if (tenantId) data.tenantId = tenantId;

        const record = await prismaModel.create({ data });
        created.push(record);
      } catch (err: any) {
        errors.push({ row: i + 1, message: err.message || 'Unknown error' });
      }
    }

    return { total: lines.length - 1, created: created.length, errors };
  }

  private parseCsvRow(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  getSupportedEntities() {
    return Object.keys(entityConfigs);
  }
}
