'use client';
import { ReactNode, useState } from 'react';
import { TableSkeleton } from './LoadingSkeleton';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  style?: React.CSSProperties;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, loading, emptyMessage = 'No data found',
  selectable, selectedIds = [], onSelectionChange, onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  if (loading) {
    return <TableSkeleton rows={5} cols={columns.length} />;
  }

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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data];
  if (sortKey) {
    sorted.sort((a, b) => {
      const aVal = a[sortKey!];
      const bVal = b[sortKey!];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

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
              <th
                key={col.key}
                style={{
                  padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b',
                  cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none',
                  ...col.style,
                }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span style={{ marginLeft: '4px', fontSize: '11px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>{emptyMessage}</td></tr>
          ) : sorted.map((item, i) => (
            <tr
              key={item.id || i}
              style={{
                borderTop: '1px solid #f1f5f9', background: selectedIds.includes(item.id) ? '#eff6ff' : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick?.(item)}
            >
              {selectable && (
                <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
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
