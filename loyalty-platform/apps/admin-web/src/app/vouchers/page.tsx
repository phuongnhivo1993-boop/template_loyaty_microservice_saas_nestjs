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
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { getVouchers, createVoucher, updateVoucher, deleteVoucher, api, bulkDeleteVouchers, bulkVouchersExpire, duplicateEntity } from '@/lib/api';

interface VoucherForm {
  code: string; type: string; value: string; maxUsage: string; expiresAt: string; description: string;
}

const emptyForm: VoucherForm = { code: '', type: 'DISCOUNT', value: '', maxUsage: '', expiresAt: '', description: '' };
const TYPES = ['DISCOUNT', 'GIFT', 'FREE_SHIPPING', 'PERCENTAGE'];

export default function VouchersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<VoucherForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchForm, setBatchForm] = useState({ prefix: '', count: '10', type: 'DISCOUNT', value: '', maxUsage: '', expiresAt: '' });
  const [batchResult, setBatchResult] = useState<string[] | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const result = await getVouchers(params);
      setVouchers(result.data);
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
  const openEdit = (v: any) => {
    setEditing(v);
    setForm({
      code: v.code, type: v.type, value: v.value?.toString() || '', maxUsage: v.maxUsage?.toString() || '',
      expiresAt: v.expiresAt?.slice(0, 10) || '', description: v.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this voucher?')) return;
    try {
      await deleteVoucher(id);
      showToast('Voucher deleted successfully', 'success');
      load();
    } catch { showToast('Failed to delete voucher', 'error'); }
  };

  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await api.post('/vouchers/batch-generate', {
        ...batchForm, count: Number(batchForm.count), value: Number(batchForm.value), maxUsage: batchForm.maxUsage ? Number(batchForm.maxUsage) : undefined, tenantId: localStorage.getItem('tenantId'),
      });
      setBatchResult(result.codes || []);
      showToast(`Generated ${result.generated || 0} vouchers`, 'success');
      load();
    } catch { showToast('Batch generation failed', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, value: Number(form.value), maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined };
      if (editing) {
        await updateVoucher(editing.id, body);
      } else {
        await createVoucher(body);
      }
      showToast(editing ? 'Voucher updated successfully' : 'Voucher created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    if (statusFilter !== 'ALL') params.status = statusFilter;
    const result = await getVouchers(params);
    const data = result.data;
    const cols = ['code', 'type', 'value', 'usedCount', 'maxUsage', 'expiresAt', 'description'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'vouchers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'code', label: 'Code', render: (v: any) => <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{v.code}</span> },
    { key: 'type', label: 'Type', render: (v: any) => <span className="status-badge">{v.type}</span> },
    { key: 'value', label: 'Value', render: (v: any) => <span className="font-medium">{v.value.toLocaleString()}</span> },
    { key: 'used', label: 'Used', render: (v: any) => v.usedCount > 0 ? <span style={{ color: '#dc2626', fontWeight: 600 }}>{v.usedCount}/{v.maxUsage || '∞'}</span> : <span className="text-muted">0/{v.maxUsage || '∞'}</span> },
    { key: 'expiresAt', label: 'Expires', render: (v: any) => <span className="text-muted">{v.expiresAt ? new Date(v.expiresAt).toLocaleDateString() : 'No expiry'}</span> },
    { key: 'actions', label: 'Actions', render: (v: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('vouchers', v.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/vouchers/${v.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(v)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(v.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Vouchers"
          subtitle="Manage discount and gift vouchers"
          actions={<button onClick={openCreate} className="btn-primary">+ New Voucher</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="REDEEMED">Redeemed</option>
          </select>
          <input type="text" placeholder="Search vouchers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={() => { setBatchResult(null); setShowBatch(true); }} className="btn-secondary">Batch Generate</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} vouchers?`)) return;
            for (const id of selectedIds) await deleteVoucher(id);
            showToast(`Deleted ${selectedIds.length} vouchers`, 'success');
            setSelectedIds([]); load();
          }}
          onExport={() => {
            const cols = ['code', 'type', 'value', 'usedCount', 'maxUsage'];
            const rows = vouchers.filter(v => selectedIds.includes(v.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
            const a = document.createElement('a'); a.href = url; a.download = 'selected-vouchers.csv'; a.click(); URL.revokeObjectURL(url);
          }} />
        <DataTable columns={columns} data={vouchers} emptyMessage="No vouchers found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Voucher' : 'New Voucher'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Code" value={form.code} onChange={v => setForm({ ...form, code: v })} required />
            <FormSelect label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={TYPES.map(t => ({ value: t, label: t }))} />
            <div className="grid-2">
              <FormInput label="Value" type="number" value={form.value} onChange={v => setForm({ ...form, value: v })} required />
              <FormInput label="Max Usage" type="number" value={form.maxUsage} onChange={v => setForm({ ...form, maxUsage: v })} />
            </div>
            <FormInput label="Expires At" type="date" value={form.expiresAt} onChange={v => setForm({ ...form, expiresAt: v })} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="vouchers" entityLabel="vouchers" onImportComplete={load} />

        <Modal open={showBatch} title="Batch Generate Vouchers" onClose={() => { setShowBatch(false); setBatchResult(null); }}>
          {batchResult ? (
            <div>
              <p style={{ marginBottom: '12px', color: '#16a34a', fontWeight: 600 }}>✅ Generated {batchResult.length} vouchers</p>
              <div style={{ maxHeight: '300px', overflow: 'auto', background: '#f8fafc', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}>
                {batchResult.map((code, i) => <div key={i}>{code}</div>)}
              </div>
              <button onClick={() => { setShowBatch(false); setBatchResult(null); }} className="btn-primary" style={{ marginTop: '16px' }}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleBatchGenerate}>
              <div className="grid-2">
                <FormInput label="Prefix" value={batchForm.prefix} onChange={v => setBatchForm({ ...batchForm, prefix: v })} required placeholder="e.g. TET2024" />
                <FormInput label="Count" type="number" value={batchForm.count} onChange={v => setBatchForm({ ...batchForm, count: v })} required />
              </div>
              <FormSelect label="Type" value={batchForm.type} onChange={v => setBatchForm({ ...batchForm, type: v })} options={TYPES.map(t => ({ value: t, label: t }))} />
              <div className="grid-2">
                <FormInput label="Value" type="number" value={batchForm.value} onChange={v => setBatchForm({ ...batchForm, value: v })} required />
                <FormInput label="Max Usage" type="number" value={batchForm.maxUsage} onChange={v => setBatchForm({ ...batchForm, maxUsage: v })} />
              </div>
              <FormInput label="Expires At" type="date" value={batchForm.expiresAt} onChange={v => setBatchForm({ ...batchForm, expiresAt: v })} />
              <FormActions onCancel={() => { setShowBatch(false); setBatchResult(null); }} loading={false} submitLabel={`Generate ${batchForm.count || 10} Vouchers`} />
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
}
