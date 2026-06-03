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
import { getPartnerBrands, createPartnerBrand, updatePartnerBrand, deletePartnerBrand } from '@/lib/api';

interface BrandForm {
  name: string; code: string; description: string; website: string; logoUrl: string; status: string;
}

const emptyForm: BrandForm = { name: '', code: '', description: '', website: '', logoUrl: '', status: 'ACTIVE' };

export default function PartnerBrandsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<BrandForm>(emptyForm);
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
      const result = await getPartnerBrands(params);
      setBrands(result.data);
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
  const openEdit = (b: any) => {
    setEditing(b);
    setForm({
      name: b.name, code: b.code || '', description: b.description || '',
      website: b.website || '', logoUrl: b.logoUrl || '', status: b.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner brand?')) return;
    try {
      await deletePartnerBrand(id);
      showToast('Partner brand deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete brand', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePartnerBrand(editing.id, form);
        showToast('Partner brand updated successfully', 'success');
      } else {
        await createPartnerBrand(form);
        showToast('Partner brand created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getPartnerBrands(params);
    const data = result.data;
    const cols = ['name', 'code', 'description', 'website', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'partner-brands.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (b: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {b.logoUrl && <img src={b.logoUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />}
        <span className="font-medium">{b.name}</span>
      </div>
    )},
    { key: 'code', label: 'Code', render: (b: any) => <span className="text-muted">{b.code || '-'}</span> },
    { key: 'website', label: 'Website', render: (b: any) => b.website ? <a href={b.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>{b.website}</a> : '-' },
    { key: 'status', label: 'Status', render: (b: any) => (
      <span className={`status-badge ${(b.status || 'ACTIVE').toLowerCase()}`}>{b.status || 'ACTIVE'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (b: any) => (
      <>
        <button onClick={() => router.push(`/partner-brands/${b.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(b)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(b.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Partner Brands"
          subtitle="Manage coalition loyalty partner brands"
          actions={<button onClick={openCreate} className="btn-primary">+ New Brand</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <input type="text" placeholder="Search brands..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} brands?`)) return;
            for (const id of selectedIds) await deletePartnerBrand(id);
            showToast(`Deleted ${selectedIds.length} brands`, 'success');
            setSelectedIds([]); load();
          }}
          onExport={() => {
            const cols = ['name', 'code', 'description', 'website', 'status'];
            const rows = brands.filter(b => selectedIds.includes(b.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
            const a = document.createElement('a'); a.href = url; a.download = 'selected-brands.csv'; a.click(); URL.revokeObjectURL(url);
          }} />
        <DataTable columns={columns} data={brands} emptyMessage="No partner brands found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Partner Brand' : 'New Partner Brand'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Brand Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="Code" value={form.code} onChange={v => setForm({ ...form, code: v })} placeholder="e.g. BRAND-001" />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Website" value={form.website} onChange={v => setForm({ ...form, website: v })} placeholder="https://..." />
              <FormInput label="Logo URL" value={form.logoUrl} onChange={v => setForm({ ...form, logoUrl: v })} placeholder="https://..." />
            </div>
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="partnership/brands" entityLabel="partner brands" onImportComplete={load} />
      </main>
    </div>
  );
}
