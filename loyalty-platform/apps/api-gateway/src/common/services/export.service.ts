import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  toCsv<T extends Record<string, any>>(data: T[], columns: { key: keyof T; label: string }[]): string {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(item =>
      columns.map(col => {
        const val = String(item[col.key] ?? '');
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(','),
    );
    return [header, ...rows].join('\n');
  }

  toJson<T>(data: T): string {
    return JSON.stringify(data, null, 2);
  }
}
