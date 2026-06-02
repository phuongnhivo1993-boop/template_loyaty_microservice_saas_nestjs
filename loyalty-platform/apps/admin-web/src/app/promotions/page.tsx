'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';

interface PromotionForm {
  name: string; description: string; priority: string; conditions: string; actions: string; status: string;
}

const emptyForm: PromotionForm = { name: '', description: '', priority: '0', conditions: '[]', actions: '[]', status: 'DRAFT' };

export default function PromotionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<PromotionForm>(emptyForm);
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
      const res = await fetch(`/api/promotions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setPromotions(Array.isArray(result) ? result : result.data || []);
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
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', priority: p.priority?.toString() || '0',
      conditions: p.conditions ? JSON.stringify(p.conditions, null, 2) : '[]',
      actions: p.actions ? JSON.stringify(p.actions, null, 2) : '[]',
      status: p.status || 'DRAFT',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion rule?')) return;
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete promotion rule', 'error'); return; }
      showToast('Promotion rule deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name, description: form.description, priority: Number(form.priority),
        conditions: JSON.parse(form.conditions), actions: JSON.parse(form.actions), status: form.status,
      };
      const url = editing ? `/api/promotions/${editing.id}` : '/api/promotions';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Promotion rule updated successfully' : 'Promotion rule created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Invalid JSON in Conditions or Actions fields', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/promotions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['name', 'priority', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'promotions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace' as const };

  const columns = [
    { key: 'name', label: 'Name', render: (p: any) => <span style={{ fontWeight: 500 }}>{p.name}</span> },
    { key: 'priority', label: 'Priority', render: (p: any) => <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{p.priority || 0}</span> },
    { key: 'conditions', label: 'Conditions', render: (p: any) => <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '13px' }}>{p.conditions ? JSON.stringify(p.conditions).slice(0, 35) + '...' : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (p: any) => <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '13px' }}>{p.actions ? JSON.stringify(p.actions).slice(0, 35) + '...' : '-'}</span> },
    { key: 'status', label: 'Status', render: (p: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: p.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2', color: p.status === 'ACTIVE' ? '#16a34a' : '#dc2626' }}>{p.status || 'DRAFT'}</span> },
    { key: 'actionsBtn', label: 'Actions', render: (p: any) => (
      <>
        <button onClick={() => openEdit(p)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Promotions"
          subtitle="IF-THEN promotion rules engine"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Rule</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={promotions} emptyMessage="No promotion rules found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Rule' : 'New Rule'} onClose={() => setShowModal(false)} width={560}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Priority</label>
                <input type="number" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Conditions (JSON)</label>
              <textarea value={form.conditions} onChange={e => setForm({ ...form, conditions: e.target.value })} rows={4}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Actions (JSON)</label>
              <textarea value={form.actions} onChange={e => setForm({ ...form, actions: e.target.value })} rows={4}
                style={{ ...inputStyle, resize: 'vertical' }} />
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
