import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as XLSX from 'xlsx';

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
  users: {
    requiredFields: ['email', 'fullName'],
    optionalFields: ['phone', 'role'],
    transform: (row) => ({
      email: row.email,
      fullName: row.fullName,
      phone: row.phone || undefined,
      role: (row.role || 'MEMBER').toUpperCase(),
      tenantId: row.tenantId || undefined,
    }),
  },
  tiers: {
    requiredFields: ['name', 'minPoints', 'maxPoints'],
    optionalFields: ['benefits', 'color', 'status'],
    transform: (row) => ({
      name: row.name,
      minPoints: parseInt(row.minPoints, 10),
      maxPoints: parseInt(row.maxPoints, 10),
      benefits: row.benefits || undefined,
      color: row.color || undefined,
      status: (row.status || 'ACTIVE').toUpperCase(),
      tenantId: row.tenantId || undefined,
    }),
  },
  promotions: {
    requiredFields: ['name'],
    optionalFields: ['description', 'priority', 'conditions', 'actions', 'status'],
    transform: (row) => ({
      name: row.name,
      description: row.description || undefined,
      priority: row.priority ? parseInt(row.priority, 10) : 0,
      conditions: row.conditions ? JSON.parse(row.conditions) : undefined,
      actions: row.actions ? JSON.parse(row.actions) : undefined,
      status: (row.status || 'ACTIVE').toUpperCase(),
      tenantId: row.tenantId || undefined,
    }),
  },
  badges: {
    requiredFields: ['name'],
    optionalFields: ['description', 'iconUrl', 'criteria'],
    transform: (row) => ({
      name: row.name,
      description: row.description || undefined,
      iconUrl: row.iconUrl || undefined,
      criteria: row.criteria ? JSON.parse(row.criteria) : undefined,
      tenantId: row.tenantId || undefined,
    }),
  },
  missions: {
    requiredFields: ['name', 'pointsReward'],
    optionalFields: ['description', 'criteria', 'startDate', 'endDate'],
    transform: (row) => ({
      name: row.name,
      description: row.description || undefined,
      pointsReward: parseInt(row.pointsReward, 10),
      criteria: row.criteria ? JSON.parse(row.criteria) : undefined,
      startDate: row.startDate ? new Date(row.startDate) : undefined,
      endDate: row.endDate ? new Date(row.endDate) : undefined,
      tenantId: row.tenantId || undefined,
    }),
  },
};

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async importCsv(entity: string, csvContent: string, tenantId?: string) {
    const rows = this.parseCsvToRows(csvContent);
    return this.importRows(entity, rows, tenantId);
  }

  async importExcel(entity: string, base64Content: string, tenantId?: string) {
    const workbook = XLSX.read(base64Content, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new BadRequestException('Excel file has no sheets');
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
    if (jsonData.length === 0) throw new BadRequestException('Excel file has no data rows');
    const headers = Object.keys(jsonData[0]);
    const rows = jsonData.map(row => headers.map(h => row[h]?.toString() || ''));
    return this.importRows(entity, { headers, rows }, tenantId);
  }

  private async importRows(entity: string, parsed: { headers: string[]; rows: string[][] }, tenantId?: string) {
    const config = entityConfigs[entity];
    if (!config) throw new BadRequestException(`Unsupported entity: ${entity}`);

    const missing = config.requiredFields.filter(f => !parsed.headers.includes(f));
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required columns: ${missing.join(', ')}`);
    }

    const errors: { row: number; message: string }[] = [];
    const created: Record<string, any>[] = [];
    const prismaModel = (this.prisma as any)[
  entity === 'members' ? 'member' : 
  entity === 'tenants' ? 'tenant' : 
  entity === 'rewards' ? 'reward' : 
  entity === 'vouchers' ? 'voucher' : 
  entity === 'tiers' ? 'tier' :
  entity === 'promotions' ? 'promotion' :
  entity === 'badges' ? 'badge' :
  entity === 'missions' ? 'mission' :
  entity === 'users' ? 'user' : entity
];

    for (let i = 0; i < parsed.rows.length; i++) {
      try {
        const values = parsed.rows[i];
        if (values.length === 0 || values.every(v => !v.trim())) continue;
        const row: Record<string, string> = {};
        parsed.headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });

        const rowMissingFields = config.requiredFields.filter(f => !row[f]);
        if (rowMissingFields.length > 0) {
          errors.push({ row: i + 2, message: `Missing required fields: ${rowMissingFields.join(', ')}` });
          continue;
        }

        const data = config.transform!(row);
        if (tenantId) data.tenantId = tenantId;

        const record = await prismaModel.create({ data });
        created.push(record);
      } catch (err: any) {
        errors.push({ row: i + 2, message: err.message || 'Unknown error' });
      }
    }

    return { total: parsed.rows.length, created: created.length, errors };
  }

  private parseCsvToRows(csvContent: string): { headers: string[]; rows: string[][] } {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new BadRequestException('CSV must have a header row and at least one data row');
    const headers = this.parseCsvRow(lines[0]);
    const rows = lines.slice(1).map(line => this.parseCsvRow(line));
    return { headers, rows };
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
