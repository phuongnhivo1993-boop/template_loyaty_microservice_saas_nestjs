'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import ImportModal from '@/components/ImportModal';

export default function ReferralsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/referrals?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setReferrals(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const res = await fetch('/api/referrals/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    loadStats();
  }, [search, page, filterStatus]);

  const handleConvert = async (id: string) => {
    if (!confirm('Convert this referral?')) return;
    setConverting(id);
    try {
      const res = await fetch(`/api/referrals/${id}/convert`, { method: 'POST', headers });
      if (!res.ok) { showToast('Failed to convert referral', 'error'); setConverting(null); return; }
      showToast('Referral converted successfully', 'success');
      load();
      loadStats();
    } catch { showToast('Network error', 'error'); }
    setConverting(null);
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/referrals?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['code', 'status', 'createdAt'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'referrals.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'code', label: 'Code', render: (r: any) => <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{r.code}</span> },
    { key: 'referrer', label: 'Referrer', render: (r: any) => <span style={{ color: '#64748b' }}>{r.referrer?.fullName || r.referrer?.email || r.referrerId || '-'}</span> },
    { key: 'referee', label: 'Referee', render: (r: any) => <span style={{ color: '#64748b' }}>{r.referee?.fullName || r.referee?.email || r.refereeId || '-'}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: r.status === 'CONVERTED' ? '#dcfce7' : r.status === 'PENDING' ? '#fef9c3' : '#f1f5f9', color: r.status === 'CONVERTED' ? '#16a34a' : r.status === 'PENDING' ? '#a16207' : '#64748b' }}>{r.status}</span> },
    { key: 'createdAt', label: 'Created', render: (r: any) => <span style={{ color: '#64748b', fontSize: '13px' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <>
        <button onClick={() => router.push(`/referrals/${r.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View</button>
        {r.status !== 'CONVERTED' ? (
        <button onClick={() => handleConvert(r.id)} disabled={converting === r.id}
          style={{ padding: '6px 14px', border: '1px solid #86efac', borderRadius: '6px', background: '#f0fdf4', color: '#16a34a', cursor: converting === r.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500 }}>
          {converting === r.id ? 'Converting...' : 'Convert'}
        </button>
        ) : null}
        </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  const statCards = stats ? [
    { label: 'Total Referrals', value: stats.totalReferrals ?? stats.total ?? 0 },
    { label: 'Converted', value: stats.convertedReferrals ?? stats.converted ?? 0 },
    { label: 'Pending', value: stats.pendingReferrals ?? stats.pending ?? 0 },
    { label: 'Conversion Rate', value: stats.conversionRate ? `${stats.conversionRate}%` : '0%' },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader title="Referrals" subtitle="Monitor and manage member referrals" />

        {statCards.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {statCards.map(s => (
              <div key={s.label} style={{
                flex: 1, background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 6px 0' }}>{s.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONVERTED">Converted</option>
          </select>
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={referrals} emptyMessage="No referrals found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="referrals" entityLabel="referrals" onImportComplete={load} />
      </main>
    </div>
  );
}
