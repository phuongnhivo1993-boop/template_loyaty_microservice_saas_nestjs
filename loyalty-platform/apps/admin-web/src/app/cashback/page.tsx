'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getCashbackConfigs, createCashbackConfig, updateCashbackConfig, deleteCashbackConfig } from '@/lib/api';

interface ConfigForm {
  name: string; description: string; rate: string; minAmount: string; maxAmount: string; status: string;
}

const emptyForm: ConfigForm = { name: '', description: '', rate: '', minAmount: '', maxAmount: '', status: 'ACTIVE' };

export default function CashbackPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<ConfigForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const result = await getCashbackConfigs(params);
      setConfigs(result.data);
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
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '', rate: c.rate?.toString() || '',
      minAmount: c.minAmount?.toString() || '', maxAmount: c.maxAmount?.toString() || '', status: c.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this cashback config?')) return;
    try {
      await deleteCashbackConfig(id);
      showToast('Cashback config deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete config', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, rate: Number(form.rate), minAmount: form.minAmount ? Number(form.minAmount) : undefined, maxAmount: form.maxAmount ? Number(form.maxAmount) : undefined };
      if (editing) {
        await updateCashbackConfig(editing.id, body);
        showToast('Cashback config updated successfully', 'success');
      } else {
        await createCashbackConfig(body);
        showToast('Cashback config created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span className="font-medium">{c.name}</span> },
    { key: 'rate', label: 'Rate', render: (c: any) => <span style={{ fontWeight: 600, color: '#2563eb' }}>{c.rate}%</span> },
    { key: 'minAmount', label: 'Min Amount', render: (c: any) => <span>{c.minAmount != null ? `${Number(c.minAmount).toLocaleString()} VND` : '-'}</span> },
    { key: 'maxAmount', label: 'Max Amount', render: (c: any) => <span>{c.maxAmount != null ? `${Number(c.maxAmount).toLocaleString()} VND` : '-'}</span> },
    { key: 'status', label: 'Status', render: (c: any) => (
      <span className={`status-badge ${(c.status || 'ACTIVE').toLowerCase()}`}>{c.status || 'ACTIVE'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Cashback Configuration"
          subtitle="Manage cashback reward rules"
          actions={<button onClick={openCreate} className="btn-primary">+ New Config</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <input type="text" placeholder="Search configs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
        </div>

        <DataTable columns={columns} data={configs} emptyMessage="No cashback configs found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Cashback Config' : 'New Cashback Config'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormInput label="Cashback Rate (%)" type="number" value={form.rate} onChange={v => setForm({ ...form, rate: v })} required />
            <div className="grid-2">
              <FormInput label="Min Amount (VND)" type="number" value={form.minAmount} onChange={v => setForm({ ...form, minAmount: v })} />
              <FormInput label="Max Amount (VND)" type="number" value={form.maxAmount} onChange={v => setForm({ ...form, maxAmount: v })} />
            </div>
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
      </main>
    </div>
  );
}
