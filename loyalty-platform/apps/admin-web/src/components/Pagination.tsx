'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const btnStyle = (active = false, disabled = false): React.CSSProperties => ({
    padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px',
    background: active ? '#2563eb' : disabled ? '#f1f5f9' : 'white',
    color: active ? 'white' : disabled ? '#94a3b8' : '#475569',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: active ? 600 : 500,
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
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
    </div>
  );
}
