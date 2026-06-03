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
import { getBadges, createBadge, updateBadge, deleteBadge } from '@/lib/api';

interface BadgeForm {
  name: string; description: string; iconUrl: string; criteria: string;
}

const emptyForm: BadgeForm = { name: '', description: '', iconUrl: '', criteria: '{}' };

export default function BadgesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<BadgeForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getBadges({ page, limit, search: search || undefined });
      setBadges(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description || '', iconUrl: c.iconUrl || '',
      criteria: typeof c.criteria === 'object' ? JSON.stringify(c.criteria, null, 2) : c.criteria || '{}',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this badge?')) return;
    try {
      await deleteBadge(id);
      showToast('Badge deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let criteria = form.criteria;
    try { criteria = JSON.parse(form.criteria); } catch { criteria = form.criteria; }
    try {
      const body = { ...form, criteria };
      if (editing) {
        await updateBadge(editing.id, body);
      } else {
        await createBadge(body);
      }
      showToast(editing ? 'Badge updated successfully' : 'Badge created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const result = await getBadges({ page: 1, limit: 10000, search: search || undefined });
    const data = result.data;
    const cols = ['name', 'description', 'iconUrl', 'criteria'];
    const header = cols.join(',');
    const rows = data.map((item: any) => cols.map((col: string) => { const v = typeof item[col] === 'object' ? JSON.stringify(item[col]) : (item[col]?.toString() || ''); return v.includes(',') ? `"${v}"` : v; }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'badges.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span className="font-medium">{c.name}</span> },
    { key: 'icon', label: 'Icon', render: (c: any) => c.iconUrl ? <img src={c.iconUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px' }} /> : <span style={{ color: '#94a3b8' }}>-</span> },
    { key: 'description', label: 'Description', render: (c: any) => <span className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{c.description || '-'}</span> },
    { key: 'criteria', label: 'Criteria', render: (c: any) => <span className="text-muted" style={{ fontSize: '12px', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{typeof c.criteria === 'object' ? JSON.stringify(c.criteria) : c.criteria || '{}'}</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => router.push(`/badges/${c.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
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
          title="Badges"
          subtitle="Manage achievement badges"
          actions={<button onClick={openCreate} className="btn-primary">+ New Badge</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input" />
          {total > 0 && <span className="text-muted" style={{ fontSize: '14px' }}>{total} results</span>}
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <DataTable columns={columns} data={badges} emptyMessage="No badges found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Badge' : 'New Badge'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormTextarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <FormInput label="Icon URL" value={form.iconUrl} onChange={v => setForm({ ...form, iconUrl: v })} />
            <FormTextarea label="Criteria (JSON)" value={form.criteria} onChange={v => setForm({ ...form, criteria: v })} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="badges" entityLabel="badges" onImportComplete={load} />
      </main>
    </div>
  );
}
