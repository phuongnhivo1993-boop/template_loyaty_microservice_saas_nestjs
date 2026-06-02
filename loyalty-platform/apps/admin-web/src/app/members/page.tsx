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
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';

interface MemberForm {
  fullName: string; email: string; phone: string; birthday: string; status: string;
}

const emptyForm: MemberForm = { fullName: '', email: '', phone: '', birthday: '', status: 'ACTIVE' };

export default function MembersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      const payload = result.data ?? result;
      setMembers(Array.isArray(payload) ? payload : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.totalItems || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    fetch('/api/tiers', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(res => { const p = res.data ?? res; setTierOptions(Array.isArray(p) ? p : []); }).catch(() => {});
  }, [search, page, tierFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: any) => { setEditing(m); setForm({ fullName: m.fullName, email: m.email, phone: m.phone || '', birthday: m.birthday ? m.birthday.slice(0, 10) : '', status: m.status }); setShowModal(true); };

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
    setSubmitting(true);
    try {
      const url = editing ? `/api/members/${editing.id}` : '/api/members';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Member updated successfully' : 'Member created successfully', 'success');
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
    setSubmitting(false);
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    if (tierFilter) params.set('tierId', tierFilter);
    const res = await fetch(`/api/members?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const data = result.data ?? result;
    const cols = ['fullName', 'email', 'availablePoints', 'status'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'members.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'fullName', label: 'Name', render: (m: any) => <a href={`/members/${m.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{m.fullName}</a> },
    { key: 'email', label: 'Email', render: (m: any) => <span style={{ color: '#64748b' }}>{m.email}</span> },
    { key: 'tier', label: 'Tier', render: (m: any) => (
      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: m.tier?.color ? m.tier.color + '22' : '#f1f5f9', color: m.tier?.color || '#64748b' }}>{m.tier?.name || 'N/A'}</span>
    )},
    { key: 'availablePoints', label: 'Points', render: (m: any) => <span style={{ fontWeight: 600 }}>{m.availablePoints?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (m: any) => {
      const colors: Record<string, string> = { ACTIVE: '#16a34a', INACTIVE: '#94a3b8', LOCKED: '#dc2626' };
      const bg: Record<string, string> = { ACTIVE: '#dcfce7', INACTIVE: '#f1f5f9', LOCKED: '#fef2f2' };
      return <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: bg[m.status] || '#f1f5f9', color: colors[m.status] || '#64748b' }}>{m.status}</span>;
    }},
    { key: 'kycVerified', label: 'KYC', render: (m: any) => m.kycVerified ? '✅ Verified' : '❌ Pending' },
    { key: 'actions', label: 'Actions', render: (m: any) => (
      <>
        <button onClick={() => openEdit(m)} className="btn-secondary btn-sm">Edit</button>
        <button onClick={() => handleDelete(m.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
          <TableSkeleton rows={6} cols={6} />
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Members"
          subtitle="Manage loyalty program members"
          actions={<button onClick={openCreate} className="btn-primary">+ New Member</button>}
        />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="">ALL TIERS</option>
            {tierOptions.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="text" placeholder="Search name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px', whiteSpace: 'nowrap' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
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
            <FormInput label="Full Name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} required />
            <FormInput label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} required type="email" />
            <FormInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} type="tel" />
            <FormInput label="Birthday" value={form.birthday} onChange={v => setForm({ ...form, birthday: v })} type="date" />
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'LOCKED', label: 'Locked' },
              ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={submitting} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>
        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="members" entityLabel="members" onImportComplete={load} />
      </main>
    </div>
  );
}
