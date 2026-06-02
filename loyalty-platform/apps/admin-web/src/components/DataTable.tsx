'use client';
import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  style?: React.CSSProperties;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, loading, emptyMessage = 'No data found',
}: DataTableProps<T>) {
  if (loading) return null;

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b', ...col.style }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>{emptyMessage}</td></tr>
          ) : data.map((item, i) => (
            <tr key={item.id || i} style={{ borderTop: '1px solid #f1f5f9' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px 16px', ...col.style }}>
                  {col.render ? col.render(item) : item[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
