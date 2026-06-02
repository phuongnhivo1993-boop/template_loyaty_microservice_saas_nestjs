'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import ImportModal from '@/components/ImportModal';

export default function AuditLogPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [filterEntity, setFilterEntity] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [showImport, setShowImport] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (filterEntity) params.set('entityType', filterEntity);
    if (filterAction) params.set('action', filterAction);
    const r = await fetch(`/api/audit-logs?${params}`, { headers });
    const res = await r.json();
    setLogs(Array.isArray(res) ? res : res.data || []);
    setTotalPages(res.totalPages || 1);
    setTotal(res.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, filterEntity, filterAction]);

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const r = await fetch(`/api/audit-logs?${params}`, { headers });
    const res = await r.json();
    const data = Array.isArray(res) ? res : res.data || [];
    const cols = ['createdAt', 'entityType', 'action', 'userEmail', 'entityId', 'ipAddress'];
    const header = cols.join(',');
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit-log.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'createdAt', label: 'Time', render: (l: any) => <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(l.createdAt).toLocaleString()}</span> },
    { key: 'entityType', label: 'Entity', render: (l: any) => <span style={{ fontWeight: 500 }}>{l.entityType}</span> },
    { key: 'action', label: 'Action', render: (l: any) => (
      <span style={{
        padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
        background: l.action === 'CREATE' ? '#dcfce7' : l.action === 'DELETE' ? '#fef2f2' : '#e0e7ff',
        color: l.action === 'CREATE' ? '#16a34a' : l.action === 'DELETE' ? '#dc2626' : '#4f46e5',
      }}>{l.action}</span>
    )},
    { key: 'userEmail', label: 'User', render: (l: any) => <span style={{ color: '#64748b' }}>{l.userEmail || '-'}</span> },
    { key: 'entityId', label: 'Entity ID', render: (l: any) => <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>{l.entityId?.slice(0, 12)}...</span> },
    { key: 'ipAddress', label: 'IP', render: (l: any) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{l.ipAddress || '-'}</span> },
    { key: 'actions', label: '', render: (l: any) => <button onClick={() => router.push(`/audit-log/${l.id}`)} style={{ padding: '6px 14px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View</button> },
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader title="Audit Log" subtitle="Track all changes made in the system" />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={filterEntity} onChange={e => { setFilterEntity(e.target.value); setPage(1); }}
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">All Entities</option>
            <option value="tenants">Tenants</option>
            <option value="users">Users</option>
            <option value="members">Members</option>
            <option value="tiers">Tiers</option>
            <option value="campaigns">Campaigns</option>
            <option value="rewards">Rewards</option>
            <option value="vouchers">Vouchers</option>
            <option value="promotions">Promotions</option>
            <option value="referrals">Referrals</option>
            <option value="badges">Badges</option>
            <option value="missions">Missions</option>
          </select>
          <select value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(1); }}
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
          <input type="text" placeholder="Search by entity type or user email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '420px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import CSV</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={logs} emptyMessage="No audit logs found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="audit_logs" entityLabel="audit logs" onImportComplete={load} />
      </main>
    </div>
  );
}
