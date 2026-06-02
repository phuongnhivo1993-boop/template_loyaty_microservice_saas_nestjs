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
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, loading, emptyMessage = 'No data found',
  selectable, selectedIds = [], onSelectionChange,
}: DataTableProps<T>) {
  if (loading) return null;

  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id));
  const someSelected = !allSelected && data.some((item) => selectedIds.includes(item.id));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !data.find((item) => item.id === id)));
    } else {
      const newIds = data.filter((item) => !selectedIds.includes(item.id)).map((item) => item.id);
      onSelectionChange([...selectedIds, ...newIds]);
    }
  };

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
            {selectable && (
              <th style={{ padding: '12px 16px', width: '40px' }}>
                <input type="checkbox" checked={allSelected} ref={(el) => { if (el) el.indeterminate = someSelected; }} onChange={toggleAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              </th>
            )}
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b', ...col.style }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>{emptyMessage}</td></tr>
          ) : data.map((item, i) => (
            <tr key={item.id || i} style={{ borderTop: '1px solid #f1f5f9', background: selectedIds.includes(item.id) ? '#eff6ff' : 'transparent' }}>
              {selectable && (
                <td style={{ padding: '12px 16px' }}>
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                </td>
              )}
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
