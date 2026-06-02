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

interface TenantForm {
  name: string; domain: string; email: string; status: string; description: string;
}

const emptyForm: TenantForm = { name: '', domain: '', email: '', status: 'ACTIVE', description: '' };

export default function TenantsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [filterStatus, setFilterStatus] = useState('');
  const [showImport, setShowImport] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/tenants?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const payload = result.data ?? result;
      setTenants(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, filterStatus]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t: any) => { setEditing(t); setForm({ name: t.name, domain: t.domain, email: t.email, status: t.status, description: t.description || '' }); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tenant?')) return;
    try {
      const res = await fetch(`/api/tenants/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete tenant', 'error'); return; }
      showToast('Tenant deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/tenants/${editing.id}` : '/api/tenants';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Tenant updated successfully' : 'Tenant created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/tenants?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
    const cols = ['name', 'domain', 'email', 'status', 'description'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'tenants.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (t: any) => <span style={{ fontWeight: 500 }}>{t.name}</span> },
    { key: 'domain', label: 'Domain', render: (t: any) => <span style={{ color: '#64748b' }}>{t.domain}</span> },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (t: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: t.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2', color: t.status === 'ACTIVE' ? '#16a34a' : '#dc2626' }}>{t.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (t: any) => (
      <>
        <button onClick={() => router.push(`/tenants/${t.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View</button>
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
          title="Tenants"
          subtitle="Manage tenant organizations"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Tenant</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import CSV</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={tenants} emptyMessage="No tenants found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Tenant' : 'New Tenant'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            {(['name', 'domain', 'email'] as const).map(f => (
              <div key={f} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
            ))}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
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
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="tenants" entityLabel="tenants" onImportComplete={load} />
      </main>
    </div>
  );
}
