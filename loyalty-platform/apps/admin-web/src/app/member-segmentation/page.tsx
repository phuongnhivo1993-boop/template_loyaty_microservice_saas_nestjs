'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { api, exportCsv } from '@/lib/api';

const segmentColors: Record<string, string> = {
  Champions: '#7c3aed',
  'Loyal Customers': '#2563eb',
  'Potential Loyalists': '#0891b2',
  'New Customers': '#16a34a',
  'At Risk': '#d97706',
  Lost: '#dc2626',
};

const segmentBg: Record<string, string> = {
  Champions: '#f5f3ff',
  'Loyal Customers': '#eff6ff',
  'Potential Loyalists': '#ecfeff',
  'New Customers': '#f0fdf4',
  'At Risk': '#fffbeb',
  Lost: '#fef2f2',
};

export default function MemberSegmentationPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rfmScore_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const handleExportCsv = async () => {
    try {
      const blob = await exportCsv('member-segmentation', { search, segment: segmentFilter || undefined, sort });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `rfm_segmentation.csv`; a.click();
      URL.revokeObjectURL(url);
      showToast('CSV exported', 'success');
    } catch { showToast('Export failed', 'error'); }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [summaryRes, listRes] = await Promise.all([
        api.get('/member-segmentation/summary') as Promise<any>,
        api.getList('/member-segmentation', { page, limit, search: search || undefined, segment: segmentFilter || undefined, sort }),
      ]);
      setSummary(summaryRes.summary || []);
      setTotalMembers(summaryRes.totalMembers || 0);
      setMembers(listRes.data);
      setTotalPages(listRes.totalPages);
      setTotal(listRes.total);
    } catch { showToast('Network error', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, segmentFilter, sort]);

  const columns = [
    { key: 'fullName', label: 'Member', render: (m: any) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{m.fullName}</div>
        <div className="text-muted" style={{ fontSize: '12px' }}>{m.email}</div>
      </div>
    )},
    { key: 'segment', label: 'Segment', render: (m: any) => (
      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${segmentColors[m.segment] || '#94a3b8'}20`, color: segmentColors[m.segment] || '#64748b' }}>{m.segment}</span>
    )},
    { key: 'rfm', label: 'RFM Score', render: (m: any) => (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '16px', color: segmentColors[m.segment] || '#64748b' }}>{m.rfm.totalScore}</span>
        <span className="text-muted" style={{ fontSize: '11px' }}>(R{m.rfm.recency}/F{m.rfm.frequency}/M{m.rfm.monetary})</span>
      </div>
    )},
    { key: 'orderCount', label: 'Orders', render: (m: any) => <span style={{ fontWeight: 600 }}>{m.orderCount}</span> },
    { key: 'totalSpend', label: 'Total Spend', render: (m: any) => <span style={{ fontWeight: 600 }}>{m.totalSpend?.toLocaleString()} VND</span> },
    { key: 'daysSinceLastOrder', label: 'Last Order', render: (m: any) => {
      if (m.daysSinceLastOrder === 999) return <span className="text-muted">Never</span>;
      if (m.daysSinceLastOrder === 0) return <span style={{ color: '#16a34a', fontWeight: 600 }}>Today</span>;
      if (m.daysSinceLastOrder === 1) return <span>Yesterday</span>;
      return <span>{m.daysSinceLastOrder} days ago</span>;
    }},
    { key: 'points', label: 'Points', render: (m: any) => <span className="text-muted">{m.availablePoints?.toLocaleString()}</span> },
    { key: 'actions', label: 'Actions', render: (m: any) => (
      <button onClick={() => router.push(`/members/${m.memberId}`)} className="btn-primary btn-sm">View</button>
    )},
  ];

  if (loading && members.length === 0) {
    return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={7} /></main></div>;
  }

  const totalMembersInSegments = summary.reduce((sum: number, s: any) => sum + (s.count || 0), 0);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Member Segmentation" subtitle="RFM-based member analysis and segmentation" />

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {summary.map((s: any) => (
            <div key={s.label} style={{
              flex: '1 1 150px', minWidth: '140px', padding: '16px', borderRadius: '12px',
              background: segmentBg[s.label] || '#f8fafc', border: `1px solid ${segmentColors[s.label] || '#e2e8f0'}30`,
              cursor: 'pointer', opacity: segmentFilter && segmentFilter !== s.label ? 0.5 : 1,
            }} onClick={() => {
              setSegmentFilter(segmentFilter === s.label ? '' : s.label);
              setPage(1);
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: segmentColors[s.label] || '#64748b', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: segmentColors[s.label] || '#1e293b' }}>{s.count}</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>{totalMembers > 0 ? `${Math.round(s.count / totalMembers * 100)}%` : ''} of members</div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <select value={segmentFilter} onChange={(e) => { setSegmentFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="">All Segments</option>
            {summary.map((s: any) => (
              <option key={s.label} value={s.label}>{s.label} ({s.count})</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="filter-select" style={{ maxWidth: '200px' }}>
            <option value="rfmScore_desc">RFM Score ↓</option>
            <option value="rfmScore_asc">RFM Score ↑</option>
            <option value="totalSpend_desc">Total Spend ↓</option>
            <option value="orderCount_desc">Orders ↓</option>
            <option value="orderCount_asc">Orders ↑</option>
            <option value="fullName_asc">Name A-Z</option>
          </select>
          <input type="text" placeholder="Search members..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={handleExportCsv} className="btn-secondary btn-sm">📥 Export CSV</button>
        </div>

        <DataTable columns={columns} data={members} emptyMessage="No members found matching the selected segment" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
    </div>
  );
}
