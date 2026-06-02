'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import ImportModal from '@/components/ImportModal';

interface AssignForm { memberId: string; voucherId: string; }

export default function MemberVouchersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState<AssignForm>({ memberId: '', voucherId: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('memberId', search);
      const res = await fetch(`/api/member-vouchers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setAssignments(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/member-vouchers', { method: 'POST', headers, body: JSON.stringify(form) });
      if (!res.ok) { showToast('Failed to assign voucher', 'error'); return; }
      showToast('Voucher assigned successfully', 'success');
      setShowModal(false);
      setForm({ memberId: '', voucherId: '' });
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleUnassign = async (id: string) => {
    if (!confirm('Remove this voucher assignment?')) return;
    try {
      const res = await fetch(`/api/member-vouchers/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to remove assignment', 'error'); return; }
      showToast('Assignment removed', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    const res = await fetch(`/api/member-vouchers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['memberId', 'voucherId', 'redeemed', 'redeemedAt', 'createdAt'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'member-vouchers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'member', label: 'Member', render: (a: any) => <span style={{ fontWeight: 500 }}>{a.member?.fullName || a.memberId?.slice(0, 12) || '-'}</span> },
    { key: 'voucher', label: 'Voucher', render: (a: any) => <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{a.voucher?.code || a.voucherId?.slice(0, 12) || '-'}</span> },
    { key: 'redeemed', label: 'Redeemed', render: (a: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: a.redeemed ? '#dcfce7' : '#f1f5f9', color: a.redeemed ? '#16a34a' : '#64748b' }}>{a.redeemed ? 'Yes' : 'No'}</span>
    )},
    { key: 'redeemedAt', label: 'Redeemed At', render: (a: any) => <span style={{ color: '#64748b', fontSize: '13px' }}>{a.redeemedAt ? new Date(a.redeemedAt).toLocaleString() : '-'}</span> },
    { key: 'createdAt', label: 'Assigned', render: (a: any) => <span style={{ color: '#64748b', fontSize: '13px' }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (a: any) => (
      <>
        <button onClick={() => router.push(`/member-vouchers/${a.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View</button>
        {!a.redeemed && (
          <button onClick={() => handleUnassign(a.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Unassign</button>
        )}
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Member Vouchers"
          subtitle="Assign and manage vouchers for members"
          actions={<button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ Assign Voucher</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search by member ID..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import CSV</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={assignments} emptyMessage="No member voucher assignments found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="member_vouchers" entityLabel="member vouchers" onImportComplete={load} />

        <Modal open={showModal} title="Assign Voucher" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAssign}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Member ID</label>
              <input value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Voucher ID</label>
              <input value={form.voucherId} onChange={e => setForm({ ...form, voucherId: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button type="submit"
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Assign</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
