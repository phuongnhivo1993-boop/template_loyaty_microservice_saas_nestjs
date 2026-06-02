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

interface RewardForm {
  name: string; description: string; type: string; pointsRequired: string; quantity: string; imageUrl: string;
}

const emptyForm: RewardForm = { name: '', description: '', type: 'PHYSICAL', pointsRequired: '', quantity: '', imageUrl: '' };

export default function RewardsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<RewardForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
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
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      const res = await fetch(`/api/rewards?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const payload = result.data ?? result;
      setRewards(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, typeFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: any) => {
    setEditing(r);
    setForm({ name: r.name, description: r.description || '', type: r.type, pointsRequired: r.pointsRequired?.toString() || '', quantity: r.quantity?.toString() || '', imageUrl: r.imageUrl || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reward?')) return;
    try {
      const res = await fetch(`/api/rewards/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete reward', 'error'); return; }
      showToast('Reward deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, pointsRequired: Number(form.pointsRequired), quantity: form.quantity ? Number(form.quantity) : undefined };
      const url = editing ? `/api/rewards/${editing.id}` : '/api/rewards';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Reward updated successfully' : 'Reward created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/rewards?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
    const cols = ['name', 'type', 'pointsRequired', 'quantity', 'description'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'rewards.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r: any) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: 'type', label: 'Type', render: (r: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{r.type}</span>
    )},
    { key: 'pointsRequired', label: 'Points Required', render: (r: any) => <span style={{ fontWeight: 600, color: '#2563eb' }}>{r.pointsRequired?.toLocaleString()} pts</span> },
    { key: 'quantity', label: 'Stock', render: (r: any) => <span style={{ color: r.quantity > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{r.quantity}</span> },
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <>
        <button onClick={() => router.push(`/rewards/${r.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View</button>
        <button onClick={() => openEdit(r)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Rewards"
          subtitle="Manage redeemable rewards"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Reward</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="ALL">All Types</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
            <option value="GIFT_CARD">Gift Card</option>
            <option value="DISCOUNT">Discount</option>
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import CSV</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={rewards} emptyMessage="No rewards found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Reward' : 'New Reward'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="PHYSICAL">Physical</option>
                <option value="DIGITAL">Digital</option>
                <option value="GIFT_CARD">Gift Card</option>
                <option value="DISCOUNT">Discount</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Points Required</label>
                <input type="number" value={form.pointsRequired} onChange={e => setForm({ ...form, pointsRequired: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Stock Quantity</label>
                <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
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
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="rewards" entityLabel="rewards" onImportComplete={load} />
      </main>
    </div>
  );
}
