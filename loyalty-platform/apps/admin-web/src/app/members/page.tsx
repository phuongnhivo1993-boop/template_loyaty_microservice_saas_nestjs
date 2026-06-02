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

interface MemberForm {
  fullName: string; email: string; phone: string; status: string;
}

const emptyForm: MemberForm = { fullName: '', email: '', phone: '', status: 'ACTIVE' };

export default function MembersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [tierOptions, setTierOptions] = useState<any[]>([]);
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
      if (tierFilter) params.set('tierId', tierFilter);
      const res = await fetch(`/api/members?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setMembers(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    fetch('/api/tiers', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(res => setTierOptions(Array.isArray(res) ? res : res.data || [])).catch(() => {});
  }, [search, page, tierFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: any) => { setEditing(m); setForm({ fullName: m.fullName, email: m.email, phone: m.phone || '', status: m.status }); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete member', 'error'); return; }
      showToast('Member deleted successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/members/${editing.id}` : '/api/members';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Member updated successfully' : 'Member created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    if (tierFilter) params.set('tierId', tierFilter);
    const res = await fetch(`/api/members?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data || [];
    const cols = ['fullName', 'email', 'availablePoints', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'members.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'fullName', label: 'Name', render: (m: any) => <a href={`/members/${m.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{m.fullName}</a> },
    { key: 'email', label: 'Email', render: (m: any) => <span style={{ color: '#64748b' }}>{m.email}</span> },
    { key: 'tier', label: 'Tier', render: (m: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: m.tier?.color ? m.tier.color + '22' : '#f1f5f9', color: m.tier?.color || '#64748b' }}>{m.tier?.name || 'N/A'}</span> },
    { key: 'availablePoints', label: 'Points', render: (m: any) => <span style={{ fontWeight: 600 }}>{m.availablePoints?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (m: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: m.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2', color: m.status === 'ACTIVE' ? '#16a34a' : '#dc2626' }}>{m.status}</span> },
    { key: 'kycVerified', label: 'KYC', render: (m: any) => m.kycVerified ? '✅ Verified' : '❌ Pending' },
    { key: 'actions', label: 'Actions', render: (m: any) => (
      <>
        <button onClick={() => openEdit(m)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(m.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Members"
          subtitle="Manage loyalty program members"
          actions={<button onClick={openCreate} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Member</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">ALL TIERS</option>
            {tierOptions.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import CSV</button>
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <BulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}
          onDelete={async () => {
            if (!confirm(`Delete ${selectedIds.length} members?`)) return;
            for (const id of selectedIds) await fetch(`/api/members/${id}`, { method: 'DELETE', headers });
            showToast(`Deleted ${selectedIds.length} members`, 'success');
            setSelectedIds([]); load();
          }}
          onExport={() => {
            const cols = ['fullName', 'email', 'availablePoints', 'status'];
            const rows = members.filter(m => selectedIds.includes(m.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
            const a = document.createElement('a'); a.href = url; a.download = 'selected-members.csv'; a.click(); URL.revokeObjectURL(url);
          }} />
        <DataTable columns={columns} data={members} emptyMessage="No members found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Member' : 'New Member'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            {(['fullName', 'email', 'phone'] as const).map(f => (
              <div key={f} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>
                  {f === 'fullName' ? 'Full Name' : f.charAt(0).toUpperCase() + f.slice(1)}
                </label>
                <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required={f !== 'phone'}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
              </div>
            ))}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="LOCKED">Locked</option>
              </select>
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
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="members" entityLabel="members" onImportComplete={load} />
      </main>
    </div>
  );
}
