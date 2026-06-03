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
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getTenants, createTenant, updateTenant, deleteTenant } from '@/lib/api';

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

  const load = async () => {
    setLoading(true);
    try {
      const result = await getTenants({ page, limit, search: search || undefined, status: filterStatus || undefined });
      setTenants(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, filterStatus]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t: any) => { setEditing(t); setForm({ name: t.name, domain: t.domain, email: t.email, status: t.status, description: t.description || '' }); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tenant?')) return;
    try {
      await deleteTenant(id);
      showToast('Tenant deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateTenant(editing.id, form);
      } else {
        await createTenant(form);
      }
      showToast(editing ? 'Tenant updated successfully' : 'Tenant created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const result = await getTenants({ page: 1, limit: 10000, search: search || undefined });
    const data = result.data;
    const cols = ['name', 'domain', 'email', 'status', 'description'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'tenants.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (t: any) => <span className="font-medium">{t.name}</span> },
    { key: 'domain', label: 'Domain', render: (t: any) => <span className="text-muted">{t.domain}</span> },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (t: any) => (
      <span className={`status-badge ${(t.status || '').toLowerCase()}`}>{t.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (t: any) => (
      <>
        <button onClick={() => router.push(`/tenants/${t.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(t)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Tenants"
          subtitle="Manage tenant organizations"
          actions={<button onClick={openCreate} className="btn-primary">+ New Tenant</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search tenants..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="filter-select">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <DataTable columns={columns} data={tenants} emptyMessage="No tenants found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Tenant' : 'New Tenant'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="Domain" value={form.domain} onChange={v => setForm({ ...form, domain: v })} required />
            <FormInput label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="tenants" entityLabel="tenants" onImportComplete={load} />
      </main>
    </div>
  );
}
