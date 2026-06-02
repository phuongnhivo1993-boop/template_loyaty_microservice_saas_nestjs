'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';

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

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/missions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setMissions(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
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
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['name', 'pointsReward', 'startDate', 'endDate', 'criteria'];
    const header = cols.join(',');
    const rows = data.map((item: any) => cols.map((col: string) => { const v = typeof item[col] === 'object' ? JSON.stringify(item[col]) : (item[col]?.toString() || ''); return v.includes(',') ? `"${v}"` : v; }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'missions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: any) => <span style={{ fontWeight: 500 }}>{c.name}</span> },
    { key: 'pointsReward', label: 'Points', render: (c: any) => <span style={{ fontWeight: 600, color: '#16a34a' }}>+{c.pointsReward?.toLocaleString() || 0}</span> },
    { key: 'startDate', label: 'Start', render: (c: any) => <span style={{ color: '#64748b' }}>{c.startDate ? new Date(c.startDate).toLocaleDateString() : '-'}</span> },
    { key: 'endDate', label: 'End', render: (c: any) => <span style={{ color: '#64748b' }}>{c.endDate ? new Date(c.endDate).toLocaleDateString() : '-'}</span> },
    { key: 'criteria', label: 'Criteria', render: (c: any) => <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{typeof c.criteria === 'object' ? JSON.stringify(c.criteria) : c.criteria || '{}'}</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={() => openEdit(c)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Missions"
          subtitle="Manage missions and tasks"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Mission</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <DataTable columns={columns} data={missions} emptyMessage="No missions found" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Mission' : 'New Mission'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Points Reward</label>
              <input type="number" value={form.pointsReward} onChange={e => setForm({ ...form, pointsReward: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Criteria (JSON)</label>
              <textarea value={form.criteria} onChange={e => setForm({ ...form, criteria: e.target.value })} rows={5}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div style={{ flex: 1, marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>End Date</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button type="submit"
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {editing ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
