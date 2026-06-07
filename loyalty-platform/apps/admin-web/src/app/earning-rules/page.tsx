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
import { getEarningRules, createEarningRule, updateEarningRule, deleteEarningRule, calculateEarningRule, duplicateEntity, api } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface RuleForm {
  name: string; description: string; pointsPerUnit: string; minAmount: string; maxAmount: string; category: string;
}

const emptyForm: RuleForm = { name: '', description: '', pointsPerUnit: '1', minAmount: '', maxAmount: '', category: '' };

export default function EarningRulesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteEarningRule, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Earning Rule',
    message: 'Delete this earning rule?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await deleteEarningRule(deletingId); showToast('Rule deleted', 'success'); load(); }
      catch { showToast('Network error', 'error'); }
    },
  });

  const [calcAmount, setCalcAmount] = useState('100000');
  const [calcResult, setCalcResult] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const result = await getEarningRules(params);
      setRules(result.data);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, categoryFilter]);

  const handleCalculate = async () => {
    try {
      const result = await calculateEarningRule({ tenantId: localStorage.getItem('tenantId') || '', amount: calcAmount, category: categoryFilter || undefined });
      setCalcResult(result);
    } catch { showToast('Calculation failed', 'error'); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: any) => { setEditing(r); setForm({ name: r.name, description: r.description || '', pointsPerUnit: String(r.pointsPerUnit), minAmount: r.minAmount ? String(r.minAmount) : '', maxAmount: r.maxAmount ? String(r.maxAmount) : '', category: r.category || '' }); setShowModal(true); };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteEarningRule();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, pointsPerUnit: Number(form.pointsPerUnit), minAmount: form.minAmount ? Number(form.minAmount) : undefined, maxAmount: form.maxAmount ? Number(form.maxAmount) : undefined, tenantId: localStorage.getItem('tenantId') };
      if (editing) {
        await updateEarningRule(editing.id, body);
        showToast('Rule updated', 'success');
      } else {
        await createEarningRule(body);
        showToast('Rule created', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r: any) => <a href={`/earning-rules/${r.id}`} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>{r.name}</a> },
    { key: 'pointsPerUnit', label: 'Points/Unit', render: (r: any) => <span className="font-medium">x{r.pointsPerUnit}</span> },
    { key: 'category', label: 'Category', render: (r: any) => r.category ? <span className="status-badge">{r.category}</span> : <span className="text-muted">All</span> },
    { key: 'minAmount', label: 'Min Amount', render: (r: any) => <span className="text-muted">{r.minAmount ? r.minAmount.toLocaleString() : '-'}</span> },
    { key: 'maxAmount', label: 'Max Amount', render: (r: any) => <span className="text-muted">{r.maxAmount ? r.maxAmount.toLocaleString() : '-'}</span> },
    { key: 'status', label: 'Status', render: (r: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: r.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9', color: r.status === 'ACTIVE' ? '#16a34a' : '#64748b' }}>{r.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r: any) => (
      <><button onClick={async () => { try { await duplicateEntity('earning-rules', r.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button><button onClick={() => openEdit(r)} className="btn-secondary btn-sm">Edit</button><button onClick={() => handleDelete(r.id)} className="btn-danger btn-sm">Delete</button></>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Earning Rules" subtitle="Configure points earning rates" actions={<button onClick={openCreate} className="btn-primary">+ New Rule</button>} />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search rules..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <input type="text" placeholder="Category filter" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="filter-select" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
        </div>

        <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>🧮 Points Calculator</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="number" value={calcAmount} onChange={e => setCalcAmount(e.target.value)} className="search-input" style={{ width: '150px' }} placeholder="Amount (VND)" />
            <button onClick={handleCalculate} className="btn-primary btn-sm">Calculate</button>
            {calcResult && (
              <span style={{ fontWeight: 600, color: calcResult.points > 0 ? '#16a34a' : '#64748b' }}>
                = {calcResult.points.toLocaleString()} points {calcResult.rule ? `(rule: ${calcResult.rule})` : '(no rule matched)'}
              </span>
            )}
          </div>
        </div>

        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xóa', variant: 'danger', icon: '🗑️',
              confirmMessage: 'Xóa earning rules',
              onClick: async (ids) => { for (const id of ids) await deleteEarningRule(id); },
            },
          ]} />
        <DataTable columns={columns} data={rules} emptyMessage="No earning rules configured" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Earning Rule' : 'New Earning Rule'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Rule Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Points Per Unit" type="number" value={form.pointsPerUnit} onChange={v => setForm({ ...form, pointsPerUnit: v })} required />
              <FormInput label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="e.g. Food, Retail" />
            </div>
            <div className="grid-2">
              <FormInput label="Min Amount (VND)" type="number" value={form.minAmount} onChange={v => setForm({ ...form, minAmount: v })} />
              <FormInput label="Max Amount (VND)" type="number" value={form.maxAmount} onChange={v => setForm({ ...form, maxAmount: v })} />
            </div>
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
