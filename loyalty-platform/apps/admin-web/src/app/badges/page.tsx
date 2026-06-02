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

interface BadgeForm {
  name: string; description: string; iconUrl: string; criteria: string;
}

const emptyForm: BadgeForm = { name: '', description: '', iconUrl: '', criteria: '{}' };

export default function BadgesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<BadgeForm>(emptyForm);
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
      const res = await fetch(`/api/badges?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const payload = result.data ?? result;
      setBadges(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '', iconUrl: c.iconUrl || '',
      criteria: typeof c.criteria === 'object' ? JSON.stringify(c.criteria, null, 2) : c.criteria || '{}',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this badge?')) return;
    try {
      const res = await fetch(`/api/badges/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete badge', 'error'); return; }
      showToast('Badge deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let criteria = form.criteria;
    try { criteria = JSON.parse(form.criteria); } catch { criteria = form.criteria; }
    try {
      const body = { ...form, criteria };
      const url = editing ? `/api/badges/${editing.id}` : '/api/badges';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Badge updated successfully' : 'Badge created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/badges?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
    const cols = ['name', 'description', 'iconUrl', 'criteria'];
    const header = cols.join(',');
    const rows = data.map((item: any) => cols.map((col: string) => { const v = typeof item[col] === 'object' ? JSON.stringify(item[col]) : (item[col]?.toString() || ''); return v.includes(',') ? `"${v}"` : v; }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'badges.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span style={{ fontWeight: 500 }}>{c.name}</span> },
    { key: 'icon', label: 'Icon', render: (c: any) => c.iconUrl ? <img src={c.iconUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px' }} /> : <span style={{ color: '#94a3b8' }}>-</span> },
    { key: 'description', label: 'Description', render: (c: any) => <span style={{ color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{c.description || '-'}</span> },
    { key: 'criteria', label: 'Criteria', render: (c: any) => <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{typeof c.criteria === 'object' ? JSON.stringify(c.criteria) : c.criteria || '{}'}</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => router.push(`/badges/${c.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View</button>
        <button onClick={() => openEdit(c)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Badges"
          subtitle="Manage achievement badges"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Badge</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={badges} emptyMessage="No badges found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Badge' : 'New Badge'} onClose={() => setShowModal(false)} width={520}>
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
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Icon URL</label>
              <input value={form.iconUrl} onChange={e => setForm({ ...form, iconUrl: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Criteria (JSON)</label>
              <textarea value={form.criteria} onChange={e => setForm({ ...form, criteria: e.target.value })} rows={5}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical', fontFamily: 'monospace' }} />
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
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="badges" entityLabel="badges" onImportComplete={load} />
      </main>
    </div>
  );
}
