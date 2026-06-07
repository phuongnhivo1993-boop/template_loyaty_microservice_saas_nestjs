'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import BulkActionBar from '@/components/BulkActionBar';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import ImportModal from '@/components/ImportModal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getStores, createStore, updateStore, deleteStore, duplicateEntity } from '@/lib/api';

interface StoreForm {
  name: string; code: string; address: string; phone: string; email: string; openingHours: string; status: string;
}

const emptyForm: StoreForm = { name: '', code: '', address: '', phone: '', email: '', openingHours: '', status: 'ACTIVE' };

export default function StoresPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<StoreForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const result = await getStores(params);
      setStores(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({
      name: s.name, code: s.code || '', address: s.address || '', phone: s.phone || '',
      email: s.email || '', openingHours: s.openingHours || '', status: s.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this store?')) return;
    try {
      await deleteStore(id);
      showToast('Store deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete store', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateStore(editing.id, form);
        showToast('Store updated successfully', 'success');
      } else {
        await createStore(form);
        showToast('Store created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getStores(params);
    const data = result.data;
    const cols = ['name', 'code', 'address', 'phone', 'email', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'stores.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (s: any) => <span className="font-medium">{s.name}</span> },
    { key: 'code', label: 'Code', render: (s: any) => <span className="text-muted">{s.code || '-'}</span> },
    { key: 'address', label: 'Address', render: (s: any) => <span className="text-muted">{s.address || '-'}</span> },
    { key: 'phone', label: 'Phone', render: (s: any) => <span>{s.phone || '-'}</span> },
    { key: 'status', label: 'Status', render: (s: any) => (
      <span className={`status-badge ${(s.status || 'ACTIVE').toLowerCase()}`}>{s.status || 'ACTIVE'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (s: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('stores', s.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/stores/${s.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(s)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Stores"
          subtitle="Manage store/outlet locations"
          actions={<button onClick={openCreate} className="btn-primary">+ New Store</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <input type="text" placeholder="Search stores..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} stores?`)) return;
            for (const id of selectedIds) await deleteStore(id);
            showToast(`Deleted ${selectedIds.length} stores`, 'success');
            setSelectedIds([]); load();
          }}
          onExport={() => {
            const cols = ['name', 'code', 'address', 'phone', 'email', 'status'];
            const rows = stores.filter(s => selectedIds.includes(s.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
            const a = document.createElement('a'); a.href = url; a.download = 'selected-stores.csv'; a.click(); URL.revokeObjectURL(url);
          }} />
        <DataTable columns={columns} data={stores} emptyMessage="No stores found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Store' : 'New Store'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="Code" value={form.code} onChange={v => setForm({ ...form, code: v })} placeholder="e.g. STORE-001" />
            <FormInput label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
            <div className="grid-2">
              <FormInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
              <FormInput label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
            </div>
            <FormInput label="Opening Hours" value={form.openingHours} onChange={v => setForm({ ...form, openingHours: v })} placeholder="e.g. 08:00-22:00" />
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="stores" entityLabel="stores" onImportComplete={load} />
      </main>
    </div>
  );
}
