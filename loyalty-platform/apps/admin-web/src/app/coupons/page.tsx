'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { api, duplicateEntity } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import ConfirmModal from '@/components/ConfirmModal';

const typeColors: Record<string, string> = {
  PERCENTAGE: '#7c3aed', FIXED: '#0891b2',
};
const statusColors: Record<string, string> = {
  ACTIVE: '#16a34a', DISABLED: '#dc2626', EXPIRED: '#94a3b8',
};

interface CouponForm {
  code: string; type: string; value: string;
  minAmount: string; maxDiscount: string; maxUsage: string;
  maxUsagePerMember: string; description: string;
  startDate: string; endDate: string; status: string; tenantId: string;
}

const emptyForm: CouponForm = {
  code: '', type: 'PERCENTAGE', value: '0',
  minAmount: '', maxDiscount: '', maxUsage: '',
  maxUsagePerMember: '1', description: '',
  startDate: '', endDate: '', status: 'ACTIVE', tenantId: '',
};

export default function CouponsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('token');
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter) q.set('status', statusFilter);
      const res = await fetch(`/api/export/coupons?${q}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `coupons.csv`; a.click();
      URL.revokeObjectURL(url);
      showToast('CSV exported', 'success');
    } catch { showToast('Export failed', 'error'); }
  };

  const load = async () => {
    setLoading(true);
    try {
      const result = await api.getList('/coupons', {
        page, limit, search: search || undefined,
        status: statusFilter || undefined,
      });
      setCoupons(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch { showToast('Network error', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, tenantId: '' });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      code: c.code, type: c.type, value: c.value.toString(),
      minAmount: c.minAmount?.toString() || '',
      maxDiscount: c.maxDiscount?.toString() || '',
      maxUsage: c.maxUsage?.toString() || '',
      maxUsagePerMember: (c.maxUsagePerMember ?? 1).toString(),
      description: c.description || '',
      startDate: c.startDate ? c.startDate.slice(0, 16) : '',
      endDate: c.endDate ? c.endDate.slice(0, 16) : '',
      status: c.status, tenantId: c.tenantId,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/coupons/${confirmDeleteId}`);
      showToast('Coupon deleted', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
    setConfirmDeleteId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data: any = {
        code: form.code, type: form.type, value: Number(form.value),
        minAmount: form.minAmount ? Number(form.minAmount) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined,
        maxUsagePerMember: Number(form.maxUsagePerMember),
        description: form.description || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        status: form.status,
      };
      if (editing) {
        await api.update(`/coupons/${editing.id}`, data);
        showToast('Coupon updated', 'success');
      } else {
        data.tenantId = form.tenantId;
        await api.create('/coupons', data);
        showToast('Coupon created', 'success');
      }
      setShowModal(false);
      load();
    } catch (err: any) { showToast(err.message || 'Error', 'error'); }
    setSubmitting(false);
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : '—';

  const columns = [
    { key: 'code', label: 'Code', render: (c: any) => (
      <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '14px', color: typeColors[c.type] || '#1e293b' }}>{c.code}</span>
    )},
    { key: 'type', label: 'Type', render: (c: any) => (
      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: `${typeColors[c.type] || '#94a3b8'}20`, color: typeColors[c.type] || '#64748b' }}>{c.type}</span>
    )},
    { key: 'value', label: 'Value', render: (c: any) => (
      <span style={{ fontWeight: 600 }}>{c.type === 'PERCENTAGE' ? `${c.value}%` : `${c.value?.toLocaleString()} VND`}</span>
    )},
    { key: 'usedCount', label: 'Usage', render: (c: any) => (
      <span>{c.usedCount}{c.maxUsage ? ` / ${c.maxUsage}` : ''}</span>
    )},
    { key: 'minAmount', label: 'Min Order', render: (c: any) => <span className="text-muted">{c.minAmount ? `${c.minAmount.toLocaleString()} VND` : '—'}</span> },
    { key: 'startDate', label: 'Valid', render: (c: any) => (
      <span className="text-muted" style={{ fontSize: '12px' }}>
        {formatDate(c.startDate)} — {formatDate(c.endDate)}
      </span>
    )},
    { key: 'status', label: 'Status', render: (c: any) => (
      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${statusColors[c.status] || '#94a3b8'}20`, color: statusColors[c.status] || '#64748b' }}>{c.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('coupons', c.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm">Edit</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={7} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Coupons"
          subtitle="Manage discount coupon codes"
          actions={<button onClick={openCreate} className="btn-primary">+ New Coupon</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <input type="text" placeholder="Search by code..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} coupons` : ''}</span>
          <button onClick={handleExportCsv} className="btn-secondary btn-sm">📥 Export CSV</button>
        </div>

        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xóa', variant: 'danger', icon: '🗑️',
              confirmMessage: 'Xóa coupons',
              onClick: async (ids) => { for (const id of ids) await api.delete(`/coupons/${id}`); },
            },
          ]} />
        <DataTable columns={columns} data={coupons} emptyMessage="No coupons found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Coupon' : 'New Coupon'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Coupon Code" value={form.code} onChange={(v: string) => setForm({ ...form, code: v })} required placeholder="e.g. SUMMER20" />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormSelect
                  label="Type"
                  value={form.type}
                  onChange={(v: string) => setForm({ ...form, type: v })}
                  options={[
                    { value: 'PERCENTAGE', label: 'Percentage (%)' },
                    { value: 'FIXED', label: 'Fixed Amount (VND)' },
                  ]}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label={form.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (VND)'} type="number" value={form.value} onChange={(v: string) => setForm({ ...form, value: v })} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Min Amount (VND)" type="number" value={form.minAmount} onChange={(v: string) => setForm({ ...form, minAmount: v })} />
              </div>
              <div style={{ flex: 1 }}>
                {form.type === 'PERCENTAGE' && (
                  <FormInput label="Max Discount (VND)" type="number" value={form.maxDiscount} onChange={(v: string) => setForm({ ...form, maxDiscount: v })} />
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Max Uses" type="number" value={form.maxUsage} onChange={(v: string) => setForm({ ...form, maxUsage: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label="Max/Member" type="number" value={form.maxUsagePerMember} onChange={(v: string) => setForm({ ...form, maxUsagePerMember: v })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <FormInput label="Start Date" type="datetime-local" value={form.startDate} onChange={(v: string) => setForm({ ...form, startDate: v })} />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput label="End Date" type="datetime-local" value={form.endDate} onChange={(v: string) => setForm({ ...form, endDate: v })} />
              </div>
            </div>
            {!editing && (
              <FormInput label="Tenant ID" value={form.tenantId} onChange={(v: string) => setForm({ ...form, tenantId: v })} required />
            )}
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-input" rows={2} />
            </div>
            <FormActions onCancel={() => setShowModal(false)} loading={submitting} submitLabel={editing ? 'Update' : 'Create'} />
          </form>
        </Modal>
        <ConfirmModal open={!!confirmDeleteId} title="Delete Coupon" message="Delete this coupon?" onConfirm={handleConfirmDelete} onCancel={() => setConfirmDeleteId(null)} confirmText="Delete" />
      </main>
    </div>
  );
}
