'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign, getCampaignPerf, bulkDeleteCampaigns, bulkActivateCampaigns, restoreItem, duplicateEntity } from '@/lib/api';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { validateForm } from '@/lib/validation';
import type { ValidationSchema } from '@/lib/validation';

interface CampaignForm {
  name: string; description: string; startDate: string; endDate: string; budget: string; status: string;
}

const emptyForm: CampaignForm = { name: '', description: '', startDate: '', endDate: '', budget: '', status: 'DRAFT' };

const formSchema: ValidationSchema = {
  name: { required: true, minLength: 2, maxLength: 200 },
  startDate: { required: true, custom: (v) => v && isNaN(Date.parse(v)) ? 'Enter a valid date' : null },
  endDate: { required: true, custom: (v) => v && isNaN(Date.parse(v)) ? 'Enter a valid date' : null },
};

export default function CampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [performances, setPerformances] = useState<Record<string, any>>({});
  const [showDeleted, setShowDeleted] = useState(searchParams.get('deleted') === 'true');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateUrl = useCallback((params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'ALL' && v !== 'false') sp.set(k, v);
      else sp.delete(k);
    });
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const { confirmDelete: confirmDeleteCampaign, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Campaign',
    message: 'Delete this campaign?',
    onConfirm: async () => {
      if (!deletingId) return;
      try {
        await deleteCampaign(deletingId);
        showToast('Campaign deleted successfully', 'success');
        load();
      } catch { showToast('Network error', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const result = await getCampaigns({ page, limit, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined, includeDeleted: showDeleted || undefined });
      setCampaigns(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      const perfs: Record<string, any> = {};
      const ids = result.data.map((c: any) => c.id);
      await Promise.all(ids.map(async (id: string) => {
        try {
          perfs[id] = await getCampaignPerf(id);
        } catch {}
      }));
      setPerformances(perfs);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter, showDeleted]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '', startDate: c.startDate?.slice(0, 10) || '',
      endDate: c.endDate?.slice(0, 10) || '', budget: c.budget?.toString() || '', status: c.status || 'DRAFT',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteCampaign();
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreItem('campaigns', id);
      showToast('Campaign restored successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(form, formSchema);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const body = { ...form, budget: form.budget ? Number(form.budget) : undefined };
      if (editing) {
        await updateCampaign(editing.id, body);
        showToast('Campaign updated successfully', 'success');
      } else {
        await createCampaign(body);
        showToast('Campaign created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const result = await getCampaigns({ page: 1, limit: 10000, search: search || undefined, status: statusFilter !== 'ALL' ? statusFilter : undefined });
    const data = result.data;
    const cols = ['name', 'startDate', 'endDate', 'budget', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'campaigns.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span style={{ fontWeight: 500 }}>{c.name}</span> },
    { key: 'startDate', label: 'Start', render: (c: any) => <span className="text-muted">{new Date(c.startDate).toLocaleDateString()}</span> },
    { key: 'endDate', label: 'End', render: (c: any) => <span className="text-muted">{new Date(c.endDate).toLocaleDateString()}</span> },
    { key: 'budget', label: 'Budget', render: (c: any) => c.budget ? `${c.budget.toLocaleString()} VND` : '-' },
    { key: 'performance', label: 'Performance', render: (c: any) => {
      const p = performances[c.id];
      if (!p) return <span className="text-muted" style={{ fontSize: '12px' }}>—</span>;
      return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {p.pointsDistributed > 0 && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>🪙 {p.pointsDistributed.toLocaleString()}</span>}
          {p.membersEnrolled > 0 && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>👤 {p.membersEnrolled.toLocaleString()}</span>}
          {p.vouchersRedeemed > 0 && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: '#2563eb' }}>🎟️ {p.vouchersRedeemed.toLocaleString()}</span>}
        </div>
      );
    }},
    { key: 'status', label: 'Status', render: (c: any) => (
      <span className={`status-badge ${(c.status || 'DRAFT').toLowerCase()}`}>{c.status || 'DRAFT'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('campaigns', c.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/campaigns/${c.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        {c.deletedAt ? (
          <button onClick={() => handleRestore(c.id)} className="btn-secondary btn-sm" style={{ borderColor: '#16a34a', color: '#16a34a' }}>Restore</button>
        ) : (
          <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
        )}
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={6} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Campaigns"
          subtitle="Manage marketing campaigns"
          actions={<button onClick={openCreate} className="btn-primary">+ New Campaign</button>}
        />

        <div className="toolbar">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); updateUrl({ status: e.target.value, search, deleted: showDeleted ? 'true' : undefined }); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="ENDED">Ended</option>
            <option value="DRAFT">Draft</option>
          </select>
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); updateUrl({ search: e.target.value, status: statusFilter, deleted: showDeleted ? 'true' : undefined }); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDeleted} onChange={e => { setShowDeleted(e.target.checked); setPage(1); updateUrl({ deleted: e.target.checked ? 'true' : undefined, search, status: statusFilter }); }} />
            Show deleted
          </label>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xóa', variant: 'danger', icon: '🗑️',
              confirmMessage: 'Xóa chiến dịch',
              onClick: async (ids) => { await bulkDeleteCampaigns(ids); },
            },
            {
              label: 'Kích hoạt', variant: 'primary', icon: '✅',
              onClick: async (ids) => { await bulkActivateCampaigns(ids); },
            },
            {
              label: 'Vô hiệu hóa', variant: 'warning', icon: '⏸️',
              onClick: async (ids) => {
                for (const id of ids) await updateCampaign(id, { status: 'PAUSED' });
              },
            },
            {
              label: 'Xuất CSV', variant: 'primary', icon: '📥',
              onClick: async () => {
                const cols = ['name', 'startDate', 'endDate', 'budget', 'status'];
                const rows = campaigns.filter(c => selectedIds.includes(c.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
                const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
                const a = document.createElement('a'); a.href = url; a.download = 'selected-campaigns.csv'; a.click(); URL.revokeObjectURL(url);
              },
            },
          ]} />
        <DataTable columns={columns} data={campaigns} emptyMessage="No campaigns found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Campaign' : 'New Campaign'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required error={formErrors.name} />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Start Date" type="date" value={form.startDate} onChange={v => setForm({ ...form, startDate: v })} required error={formErrors.startDate} />
              <FormInput label="End Date" type="date" value={form.endDate} onChange={v => setForm({ ...form, endDate: v })} required error={formErrors.endDate} helpText="The date until which the campaign can be joined" />
            </div>
            <FormInput label="Budget (VND)" type="number" value={form.budget} onChange={v => setForm({ ...form, budget: v })} />
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PAUSED', label: 'Paused' },
              { value: 'COMPLETED', label: 'Completed' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="campaigns" entityLabel="campaigns" onImportComplete={load} />
        {deleteModal}
      </main>
    </div>
  );
}
