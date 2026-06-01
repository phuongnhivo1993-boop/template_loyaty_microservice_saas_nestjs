'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const typeColors: Record<string, { bg: string; color: string }> = {
  EARN: { bg: '#dcfce7', color: '#16a34a' },
  BURN: { bg: '#fef2f2', color: '#dc2626' },
  ADJUST: { bg: '#e0e7ff', color: '#4f46e5' },
};

export default function PointTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      const res = await fetch(`/api/points/transactions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setTransactions(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, typeFilter]);

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Point Transactions</h1>
          <p style={{ color: '#64748b' }}>View point earn, burn, and adjustment history</p>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px',
              fontSize: '14px', flex: 1, maxWidth: '360px',
            }}
          />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            style={{
              padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px',
              fontSize: '14px', background: 'white',
            }}
          >
            <option value="ALL">ALL</option>
            <option value="EARN">EARN</option>
            <option value="BURN">BURN</option>
            <option value="ADJUST">ADJUST</option>
          </select>
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            {total > 0 ? `${total} results` : ''}
          </span>
          <button onClick={async () => {
            const params = new URLSearchParams({ page: '1', limit: '10000' });
            if (search) params.set('search', search);
            if (typeFilter !== 'ALL') params.set('type', typeFilter);
            const res = await fetch(`/api/points/transactions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const result = await res.json();
            const data = Array.isArray(result) ? result : result.data || [];
            const cols = ['type', 'amount', 'balance', 'reason', 'reference', 'createdAt'];
            const header = cols.join(',');
            const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const csv = [header, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'point-transactions.csv'; a.click(); URL.revokeObjectURL(url);
          }} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Member</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Type</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Amount</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Balance</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Reason</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Reference</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No transactions found</td></tr>
              ) : transactions.map((t: any) => {
                const tc = typeColors[t.type] || { bg: '#f1f5f9', color: '#64748b' };
                return (
                  <tr key={t.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{t.member?.name || t.memberId || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        background: tc.bg, color: tc.color,
                      }}>{t.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: t.type === 'EARN' ? '#16a34a' : t.type === 'BURN' ? '#dc2626' : '#4f46e5' }}>
                      {t.type === 'EARN' ? '+' : ''}{t.amount?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{t.balance?.toLocaleString() || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.reason || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>{t.reference || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px',
                background: page <= 1 ? '#f1f5f9' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer',
                color: page <= 1 ? '#94a3b8' : '#475569', fontWeight: 500,
              }}
            >Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px',
                    background: p === page ? '#2563eb' : 'white', color: p === page ? 'white' : '#475569',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >{p}</button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px',
                background: page >= totalPages ? '#f1f5f9' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                color: page >= totalPages ? '#94a3b8' : '#475569', fontWeight: 500,
              }}
            >Next</button>
          </div>
        )}
      </main>
    </div>
  );
}
