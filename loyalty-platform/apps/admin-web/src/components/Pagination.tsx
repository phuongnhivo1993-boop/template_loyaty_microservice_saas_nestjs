'use client';
import { useState } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange }: PaginationProps) {
  const [goToValue, setGoToValue] = useState('');

  if (totalPages <= 1 && !pageSize) return null;

  const btnStyle = (active = false, disabled = false): React.CSSProperties => ({
    padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px',
    background: active ? '#2563eb' : disabled ? '#f1f5f9' : 'var(--bg-card, white)',
    color: active ? 'white' : disabled ? '#94a3b8' : '#475569',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: active ? 600 : 500,
  });

  const handleGoTo = () => {
    const p = parseInt(goToValue, 10);
    if (p >= 1 && p <= totalPages) {
      onPageChange(p);
      setGoToValue('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
      {pageSize !== undefined && onPageSizeChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Rows:</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px',
              fontSize: '13px', background: 'var(--bg-card, white)', cursor: 'pointer', outline: 'none',
            }}
          >
            {[10, 20, 50, 100].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {totalPages > 1 && (
        <>
          <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} style={btnStyle(false, page <= 1)}>
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            if (p > totalPages) return null;
            return (
              <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p === page)}>
                {p}
              </button>
            );
          })}
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} style={btnStyle(false, page >= totalPages)}>
            Next
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={goToValue}
              onChange={e => setGoToValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGoTo(); }}
              style={{
                width: '60px', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px',
                fontSize: '13px', outline: 'none', textAlign: 'center',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
