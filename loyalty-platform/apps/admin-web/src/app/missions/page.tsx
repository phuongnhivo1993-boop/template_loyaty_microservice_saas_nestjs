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

interface MissionForm {
  name: string; description: string; pointsReward: string; criteria: string; startDate: string; endDate: string;
}

const emptyForm: MissionForm = { name: '', description: '', pointsReward: '', criteria: '{}', startDate: '', endDate: '' };

export default function MissionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<MissionForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/missions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const payload = result.data ?? result;
      setMissions(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '',
      pointsReward: c.pointsReward?.toString() || '',
      criteria: typeof c.criteria === 'object' ? JSON.stringify(c.criteria, null, 2) : c.criteria || '{}',
      startDate: c.startDate?.slice(0, 10) || '',
      endDate: c.endDate?.slice(0, 10) || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mission?')) return;
    try {
      const res = await fetch(`/api/missions/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete mission', 'error'); return; }
      showToast('Mission deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let criteria = form.criteria;
    try { criteria = JSON.parse(form.criteria); } catch { criteria = form.criteria; }
    try {
      const body = { ...form, pointsReward: form.pointsReward ? Number(form.pointsReward) : 0, criteria };
      const url = editing ? `/api/missions/${editing.id}` : '/api/missions';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Mission updated successfully' : 'Mission created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/missions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
    const cols = ['name', 'pointsReward', 'startDate', 'endDate', 'criteria'];
    const header = cols.join(',');
    const rows = data.map((item: any) => cols.map((col: string) => { const v = typeof item[col] === 'object' ? JSON.stringify(item[col]) : (item[col]?.toString() || ''); return v.includes(',') ? `"${v}"` : v; }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'missions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span className="font-medium">{c.name}</span> },
    { key: 'pointsReward', label: 'Points', render: (c: any) => <span style={{ fontWeight: 600, color: '#16a34a' }}>+{c.pointsReward?.toLocaleString() || 0}</span> },
    { key: 'startDate', label: 'Start', render: (c: any) => <span className="text-muted">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '-'}</span> },
    { key: 'endDate', label: 'End', render: (c: any) => <span className="text-muted">{c.endDate ? new Date(c.endDate).toLocaleDateString() : '-'}</span> },
    { key: 'criteria', label: 'Criteria', render: (c: any) => <span className="text-muted" style={{ fontSize: '12px', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{typeof c.criteria === 'object' ? JSON.stringify(c.criteria) : c.criteria || '{}'}</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => router.push(`/missions/${c.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Missions"
          subtitle="Manage missions and tasks"
          actions={<button onClick={openCreate} className="btn-primary">+ New Mission</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input" />
          {total > 0 && <span className="text-muted" style={{ fontSize: '14px' }}>{total} results</span>}
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <DataTable columns={columns} data={missions} emptyMessage="No missions found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Mission' : 'New Mission'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormInput label="Points Reward" type="number" value={form.pointsReward} onChange={v => setForm({ ...form, pointsReward: v })} required />
            <FormTextarea label="Criteria (JSON)" value={form.criteria} onChange={v => setForm({ ...form, criteria: v })} />
            <div className="grid-2">
              <FormInput label="Start Date" type="date" value={form.startDate} onChange={v => setForm({ ...form, startDate: v })} required />
              <FormInput label="End Date" type="date" value={form.endDate} onChange={v => setForm({ ...form, endDate: v })} required />
            </div>
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="missions" entityLabel="missions" onImportComplete={load} />
      </main>
    </div>
  );
}
