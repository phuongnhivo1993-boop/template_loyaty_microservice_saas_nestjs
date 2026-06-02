'use client';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  customActions?: { label: string; onClick: () => void; color?: string }[];
}

export default function BulkActionBar({ selectedCount, onDelete, onExport, onClear, customActions }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
      background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
      marginBottom: '16px',
    }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
        {selectedCount} selected
      </span>
      {onDelete && (
        <button onClick={onDelete}
          style={{ padding: '6px 16px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
          Delete Selected
        </button>
      )}
      {onExport && (
        <button onClick={onExport}
          style={{ padding: '6px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
          Export Selected
        </button>
      )}
      {customActions?.map((action, i) => (
        <button key={i} onClick={action.onClick}
          style={{ padding: '6px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: action.color || '#1e293b' }}>
          {action.label}
        </button>
      ))}
      {onClear && (
        <button onClick={onClear}
          style={{ padding: '6px 16px', border: 'none', borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
          Clear selection
        </button>
      )}
    </div>
  );
}
