'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';

const typeColors: Record<string, { bg: string; color: string }> = {
  EARN: { bg: '#dcfce7', color: '#16a34a' },
  BURN: { bg: '#fef2f2', color: '#dc2626' },
  ADJUST: { bg: '#e0e7ff', color: '#4f46e5' },
};

export default function PointTransactionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
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

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    if (typeFilter !== 'ALL') params.set('type', typeFilter);
    const res = await fetch(`/api/points/transactions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['type', 'amount', 'balance', 'reason', 'reference', 'createdAt'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'point-transactions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'member', label: 'Member', render: (t: any) => <span style={{ fontWeight: 500 }}>{t.member?.name || t.memberId || '-'}</span> },
    { key: 'type', label: 'Type', render: (t: any) => { const tc = typeColors[t.type] || { bg: '#f1f5f9', color: '#64748b' }; return <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: tc.bg, color: tc.color }}>{t.type}</span>; }},
    { key: 'amount', label: 'Amount', render: (t: any) => <span style={{ fontWeight: 600, color: t.type === 'EARN' ? '#16a34a' : t.type === 'BURN' ? '#dc2626' : '#4f46e5' }}>{t.type === 'EARN' ? '+' : ''}{t.amount?.toLocaleString() || 0}</span> },
    { key: 'balance', label: 'Balance', render: (t: any) => <span style={{ color: '#64748b' }}>{t.balance?.toLocaleString() || '-'}</span> },
    { key: 'reason', label: 'Reason', render: (t: any) => <span style={{ color: '#64748b' }}>{t.reason || '-'}</span> },
    { key: 'reference', label: 'Reference', render: (t: any) => <span style={{ color: '#64748b', fontSize: '12px' }}>{t.reference || '-'}</span> },
    { key: 'createdAt', label: 'Created', render: (t: any) => <span style={{ color: '#64748b', fontSize: '13px' }}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</span> },
    { key: 'actions', label: '', render: (t: any) => <button onClick={() => router.push(`/point-transactions/${t.id}`)} style={{ padding: '6px 14px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View</button> },
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader title="Point Transactions" subtitle="View point earn, burn, and adjustment history" />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search member..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="ALL">ALL</option>
            <option value="EARN">EARN</option>
            <option value="BURN">BURN</option>
            <option value="ADJUST">ADJUST</option>
          </select>
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={transactions} emptyMessage="No transactions found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
