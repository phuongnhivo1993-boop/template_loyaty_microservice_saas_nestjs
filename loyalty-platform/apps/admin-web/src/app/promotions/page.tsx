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
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '@/lib/api';

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
  const [filterStatus, setFilterStatus] = useState('');
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const result = await getPromotions(params);
      setPromotions(result.data);
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
      await deletePromotion(id);
      showToast('Promotion rule deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete promotion rule', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name, description: form.description, priority: Number(form.priority),
        conditions: JSON.parse(form.conditions), actions: JSON.parse(form.actions), status: form.status,
      };
      if (editing) {
        await updatePromotion(editing.id, body);
      } else {
        await createPromotion(body);
      }
      showToast(editing ? 'Promotion rule updated successfully' : 'Promotion rule created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Invalid JSON in Conditions or Actions fields', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getPromotions(params);
    const data = result.data;
    const cols = ['name', 'priority', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'promotions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (p: any) => <span className="font-medium">{p.name}</span> },
    { key: 'priority', label: 'Priority', render: (p: any) => <span className="status-badge">{p.priority || 0}</span> },
    { key: 'conditions', label: 'Conditions', render: (p: any) => <span className="text-muted" style={{ fontFamily: 'monospace', fontSize: '13px' }}>{p.conditions ? JSON.stringify(p.conditions).slice(0, 35) + '...' : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (p: any) => <span className="text-muted" style={{ fontFamily: 'monospace', fontSize: '13px' }}>{p.actions ? JSON.stringify(p.actions).slice(0, 35) + '...' : '-'}</span> },
    { key: 'status', label: 'Status', render: (p: any) => <span className={`status-badge ${(p.status || 'DRAFT').toLowerCase()}`}>{p.status || 'DRAFT'}</span> },
    { key: 'actionsBtn', label: 'Actions', render: (p: any) => (
      <>
        <button onClick={() => router.push(`/promotions/${p.id}`)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(p)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Promotions"
          subtitle="IF-THEN promotion rules engine"
          actions={<button onClick={openCreate} className="btn-primary">+ New Rule</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search promotions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="filter-select">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <DataTable columns={columns} data={promotions} emptyMessage="No promotion rules found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Rule' : 'New Rule'} onClose={() => setShowModal(false)} width={560}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Priority" type="number" value={form.priority} onChange={v => setForm({ ...form, priority: v })} />
              <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]} />
            </div>
            <FormTextarea label="Conditions (JSON)" value={form.conditions} onChange={v => setForm({ ...form, conditions: v })} />
            <FormTextarea label="Actions (JSON)" value={form.actions} onChange={v => setForm({ ...form, actions: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="promotions" entityLabel="promotions" onImportComplete={load} />
      </main>
    </div>
  );
}
