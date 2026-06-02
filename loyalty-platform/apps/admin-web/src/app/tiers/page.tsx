'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';

interface TierForm {
  name: string; minPoints: number; maxPoints: number; benefits: string; color: string; status: string;
}

const emptyForm: TierForm = { name: '', minPoints: 0, maxPoints: 0, benefits: '', color: '#6366f1', status: 'ACTIVE' };

export default function TiersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<TierForm>(emptyForm);
  const [search, setSearch] = useState('');
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
      const res = await fetch(`/api/tiers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setTiers(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, minPoints: t.minPoints, maxPoints: t.maxPoints, benefits: t.benefits || '', color: t.color || '#6366f1', status: t.status });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tier?')) return;
    try {
      const res = await fetch(`/api/tiers/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete tier', 'error'); return; }
      showToast('Tier deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/tiers/${editing.id}` : '/api/tiers';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Tier updated successfully' : 'Tier created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/tiers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['name', 'minPoints', 'maxPoints', 'benefits', 'color', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'tiers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (t: any) => <span style={{ fontWeight: 500 }}>{t.name}</span> },
    { key: 'minPoints', label: 'Min Points', render: (t: any) => <span style={{ color: '#64748b' }}>{t.minPoints?.toLocaleString()}</span> },
    { key: 'maxPoints', label: 'Max Points', render: (t: any) => <span style={{ color: '#64748b' }}>{t.maxPoints?.toLocaleString()}</span> },
    { key: 'benefits', label: 'Benefits', render: (t: any) => <span style={{ color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{t.benefits}</span> },
    { key: 'color', label: 'Color', render: (t: any) => <span style={{ display: 'inline-block', width: '24px', height: '24px', borderRadius: '4px', background: t.color || '#6366f1', verticalAlign: 'middle' }} /> },
    { key: 'status', label: 'Status', render: (t: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: t.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2', color: t.status === 'ACTIVE' ? '#16a34a' : '#dc2626' }}>{t.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (t: any) => (
      <>
        <button onClick={() => openEdit(t)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Tiers"
          subtitle="Manage loyalty tiers"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Tier</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={tiers} emptyMessage="No tiers found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Tier' : 'New Tier'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Min Points</label>
              <input type="number" value={form.minPoints} onChange={e => setForm({ ...form, minPoints: Number(e.target.value) })} required min={0}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Max Points</label>
              <input type="number" value={form.maxPoints} onChange={e => setForm({ ...form, maxPoints: Number(e.target.value) })} required min={0}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Benefits</label>
              <textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Color</label>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                style={{ width: '60px', height: '40px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button type="submit"
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {editing ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
