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

interface CampaignForm {
  name: string; description: string; startDate: string; endDate: string; budget: string; status: string;
}

const emptyForm: CampaignForm = { name: '', description: '', startDate: '', endDate: '', budget: '', status: 'DRAFT' };

export default function CampaignsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const res = await fetch(`/api/campaigns?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const payload = result.data ?? result;
      setCampaigns(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, statusFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '', startDate: c.startDate?.slice(0, 10) || '',
      endDate: c.endDate?.slice(0, 10) || '', budget: c.budget?.toString() || '', status: c.status || 'DRAFT',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete campaign', 'error'); return; }
      showToast('Campaign deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, budget: form.budget ? Number(form.budget) : undefined };
      const url = editing ? `/api/campaigns/${editing.id}` : '/api/campaigns';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Campaign updated successfully' : 'Campaign created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    const res = await fetch(`/api/campaigns?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
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
    { key: 'status', label: 'Status', render: (c: any) => (
      <span className={`status-badge ${(c.status || 'DRAFT').toLowerCase()}`}>{c.status || 'DRAFT'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => router.push(`/campaigns/${c.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm">Edit</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
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
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="ENDED">Ended</option>
            <option value="DRAFT">Draft</option>
          </select>
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} campaigns?`)) return;
            for (const id of selectedIds) await fetch(`/api/campaigns/${id}`, { method: 'DELETE', headers });
            showToast(`Deleted ${selectedIds.length} campaigns`, 'success');
            setSelectedIds([]); load();
          }}
          onExport={() => {
            const cols = ['name', 'startDate', 'endDate', 'budget', 'status'];
            const rows = campaigns.filter(c => selectedIds.includes(c.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
            const a = document.createElement('a'); a.href = url; a.download = 'selected-campaigns.csv'; a.click(); URL.revokeObjectURL(url);
          }} />
        <DataTable columns={columns} data={campaigns} emptyMessage="No campaigns found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Campaign' : 'New Campaign'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <div className="grid-2">
              <FormInput label="Start Date" type="date" value={form.startDate} onChange={v => setForm({ ...form, startDate: v })} required />
              <FormInput label="End Date" type="date" value={form.endDate} onChange={v => setForm({ ...form, endDate: v })} required />
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
      </main>
    </div>
  );
}
