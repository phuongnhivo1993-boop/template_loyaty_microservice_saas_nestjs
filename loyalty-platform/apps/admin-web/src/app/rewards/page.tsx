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
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { getRewards, createReward, updateReward, deleteReward, duplicateEntity } from '@/lib/api';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteReward, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Reward',
    message: 'Delete this reward?',
    onConfirm: async () => {
      if (!deletingId) return;
      try {
        await deleteReward(deletingId);
        showToast('Reward deleted successfully', 'success');
        load();
      } catch { showToast('Failed to delete reward', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (typeFilter !== 'ALL') params.type = typeFilter;
      const result = await getRewards(params);
      setRewards(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, typeFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: any) => {
    setEditing(r);
    setForm({ name: r.name, description: r.description || '', type: r.type, pointsRequired: r.pointsRequired?.toString() || '', quantity: r.quantity?.toString() || '', imageUrl: r.imageUrl || '' });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteReward();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, pointsRequired: Number(form.pointsRequired), quantity: form.quantity ? Number(form.quantity) : undefined };
      if (editing) {
        await updateReward(editing.id, body);
      } else {
        await createReward(body);
      }
      showToast(editing ? 'Reward updated successfully' : 'Reward created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getRewards(params);
    const data = result.data;
    const cols = ['name', 'type', 'pointsRequired', 'quantity', 'description'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'rewards.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r: any) => <span className="font-medium">{r.name}</span> },
    { key: 'type', label: 'Type', render: (r: any) => <span className="status-badge">{r.type}</span> },
    { key: 'pointsRequired', label: 'Points Required', render: (r: any) => <span style={{ fontWeight: 600, color: '#2563eb' }}>{r.pointsRequired?.toLocaleString()} pts</span> },
    { key: 'quantity', label: 'Stock', render: (r: any) => <span style={{ color: r.quantity > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{r.quantity}</span> },
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('rewards', r.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/rewards/${r.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(r)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(r.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Rewards"
          subtitle="Manage redeemable rewards"
          actions={<button onClick={openCreate} className="btn-primary">+ New Reward</button>}
        />

        <div className="toolbar">
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Types</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
            <option value="GIFT_CARD">Gift Card</option>
            <option value="DISCOUNT">Discount</option>
          </select>
          <input type="text" placeholder="Search rewards..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionsToolbar selectedIds={selectedIds} onClear={() => setSelectedIds([])}
          actions={[
            { label: 'Delete Selected', variant: 'danger', confirmMessage: 'Xác nhận xóa', onClick: async (ids) => { for (const id of ids) await deleteReward(id); } },
            { label: 'Export CSV', onClick: async (ids) => {
              const cols = ['name', 'type', 'pointsRequired', 'quantity'];
              const rows = rewards.filter(r => ids.includes(r.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
              const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
              const a = document.createElement('a'); a.href = url; a.download = 'selected-rewards.csv'; a.click(); URL.revokeObjectURL(url);
            }},
          ]} onSuccess={load} />
        <DataTable columns={columns} data={rewards} emptyMessage="No rewards found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Reward' : 'New Reward'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormSelect label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[
              { value: 'PHYSICAL', label: 'Physical' },
              { value: 'DIGITAL', label: 'Digital' },
              { value: 'GIFT_CARD', label: 'Gift Card' },
              { value: 'DISCOUNT', label: 'Discount' },
            ]} />
            <div className="grid-2">
              <FormInput label="Points Required" type="number" value={form.pointsRequired} onChange={v => setForm({ ...form, pointsRequired: v })} required />
              <FormInput label="Stock Quantity" type="number" value={form.quantity} onChange={v => setForm({ ...form, quantity: v })} />
            </div>
            <FormInput label="Image URL" value={form.imageUrl} onChange={v => setForm({ ...form, imageUrl: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="rewards" entityLabel="rewards" onImportComplete={load} />
        {deleteModal}
      </main>
    </div>
  );
}
