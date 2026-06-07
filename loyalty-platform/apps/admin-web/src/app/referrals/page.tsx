'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import ImportModal from '@/components/ImportModal';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getReferrals, convertReferral, getReferralStats, api, duplicateEntity } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import ConfirmModal from '@/components/ConfirmModal';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmConvertId, setConfirmConvertId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const result = await getReferrals(params);
      setReferrals(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const result = await api.get('/referrals/stats');
      setStats(result);
    } catch {}
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
    loadStats();
  }, [search, page, filterStatus]);

  const handleConvert = (id: string) => {
    setConfirmConvertId(id);
  };

  const handleConfirmConvert = async () => {
    if (!confirmConvertId) return;
    setConverting(confirmConvertId);
    try {
      await convertReferral(confirmConvertId, {});
      showToast('Referral converted successfully', 'success');
      load();
      loadStats();
    } catch { showToast('Failed to convert referral', 'error'); }
    setConverting(null);
    setConfirmConvertId(null);
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getReferrals(params);
    const data = result.data;
    const cols = ['code', 'status', 'createdAt'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'referrals.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'code', label: 'Code', render: (r: any) => <span className="font-medium" style={{ fontFamily: 'monospace' }}>{r.code}</span> },
    { key: 'referrer', label: 'Referrer', render: (r: any) => <span className="text-muted">{r.referrer?.fullName || r.referrer?.email || r.referrerId || '-'}</span> },
    { key: 'referee', label: 'Referee', render: (r: any) => <span className="text-muted">{r.referee?.fullName || r.referee?.email || r.refereeId || '-'}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <span className="status-badge" style={{ background: r.status === 'CONVERTED' ? '#dcfce7' : r.status === 'PENDING' ? '#fef9c3' : '#f1f5f9', color: r.status === 'CONVERTED' ? '#16a34a' : r.status === 'PENDING' ? '#a16207' : '#64748b' }}>{r.status}</span> },
    { key: 'createdAt', label: 'Created', render: (r: any) => <span className="text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('referrals', r.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/referrals/${r.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        {r.status !== 'CONVERTED' ? (
        <button onClick={() => handleConvert(r.id)} disabled={converting === r.id}
          style={{ padding: '6px 14px', border: '1px solid #86efac', borderRadius: '6px', background: '#f0fdf4', color: '#16a34a', cursor: converting === r.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500 }}>
          {converting === r.id ? 'Converting...' : 'Convert'}
        </button>
        ) : null}
        </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  const statCards = stats ? [
    { label: 'Total Referrals', value: stats.totalReferrals ?? stats.total ?? 0 },
    { label: 'Converted', value: stats.convertedReferrals ?? stats.converted ?? 0 },
    { label: 'Pending', value: stats.pendingReferrals ?? stats.pending ?? 0 },
    { label: 'Conversion Rate', value: stats.conversionRate ? `${stats.conversionRate}%` : '0%' },
  ] : [];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
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

        <div className="toolbar">
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="filter-select">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONVERTED">Converted</option>
          </select>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xuất CSV', variant: 'primary', icon: '📥',
              onClick: async () => {
                const cols = ['code', 'status', 'createdAt'];
                const rows = referrals.filter(r => selectedIds.includes(r.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
                const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
                const a = document.createElement('a'); a.href = url; a.download = 'selected-referrals.csv'; a.click(); URL.revokeObjectURL(url);
              },
            },
          ]} />
        <DataTable columns={columns} data={referrals} emptyMessage="No referrals found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="referrals" entityLabel="referrals" onImportComplete={load} />
        <ConfirmModal open={!!confirmConvertId} title="Convert Referral" message="Convert this referral?" onConfirm={handleConfirmConvert} onCancel={() => setConfirmConvertId(null)} confirmText="Convert" />
      </main>
    </div>
  );
}
