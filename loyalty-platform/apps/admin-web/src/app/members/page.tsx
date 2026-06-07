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
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { getMembers, createMember, updateMember, deleteMember, getTiers, bulkDeleteMembers, bulkActivateMembers, bulkDeactivateMembers, restoreItem } from '@/lib/api';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { validateForm } from '@/lib/validation';
import type { ValidationSchema } from '@/lib/validation';

interface MemberForm {
  fullName: string; email: string; phone: string; birthday: string; status: string;
}

const emptyForm: MemberForm = { fullName: '', email: '', phone: '', birthday: '', status: 'ACTIVE' };

const formSchema: ValidationSchema = {
  fullName: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMessage: 'Enter a valid email address' },
  phone: { pattern: /^[+]?[\d\s()-]{7,20}$/, patternMessage: 'Enter a valid phone number' },
};

export default function MembersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [tierOptions, setTierOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagAction, setTagAction] = useState<'add' | 'remove'>('add');
  const [tagInput, setTagInput] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteMember, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Member',
    message: 'Delete this member? This action cannot be undone.',
    onConfirm: async () => {
      if (!deletingId) return;
      try {
        await deleteMember(deletingId);
        showToast('Member deleted successfully', 'success');
        load();
      } catch { showToast('Network error', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const result = await getMembers({ page, limit, search: search || undefined, tierId: tierFilter || undefined, tags: tagFilter || undefined, includeDeleted: showDeleted || undefined });
      setMembers(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    load();
    getTiers().then(result => { setTierOptions(result.data); }).catch(() => {});
  }, [search, page, tierFilter, tagFilter, showDeleted]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setShowModal(true); };
  const openEdit = (m: any) => { setEditing(m); setForm({ fullName: m.fullName, email: m.email, phone: m.phone || '', birthday: m.birthday ? m.birthday.slice(0, 10) : '', status: m.status }); setFormErrors({}); setShowModal(true); };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteMember();
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreItem('members', id);
      showToast('Member restored successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(form, formSchema);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateMember(editing.id, form);
        showToast('Member updated successfully', 'success');
      } else {
        await createMember(form);
        showToast('Member created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Network error', 'error'); }
    setSubmitting(false);
  };

  const exportCsv = async () => {
    const result = await getMembers({ page: 1, limit: 10000, search: search || undefined, tierId: tierFilter || undefined });
    const data = result.data;
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
    { key: 'tags', label: 'Tags', render: (m: any) => m.tags?.length > 0 ? m.tags.slice(0, 3).map((t: string) => (
      <span key={t} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: '#2563eb', marginRight: '4px', marginBottom: '2px' }}>{t}</span>
    )) : <span className="text-muted" style={{ fontSize: '12px' }}>—</span> },
    { key: 'actions', label: 'Actions', render: (m: any) => (
      <>
        <button onClick={() => openEdit(m)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        {m.deletedAt ? (
          <button onClick={() => handleRestore(m.id)} className="btn-secondary btn-sm" style={{ borderColor: '#16a34a', color: '#16a34a' }}>Restore</button>
        ) : (
          <button onClick={() => handleDelete(m.id)} className="btn-danger btn-sm">Delete</button>
        )}
      </>
    )},
  ];

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <TableSkeleton rows={6} cols={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
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
          <select value={tagFilter} onChange={(e) => { setTagFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="">ALL TAGS</option>
            <option value="VIP">VIP</option>
            <option value="NEW">NEW</option>
            <option value="HIGH_SPENDER">HIGH_SPENDER</option>
            <option value="AT_RISK">AT_RISK</option>
          </select>
          <input type="text" placeholder="Search name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span style={{ color: '#64748b', fontSize: '14px', whiteSpace: 'nowrap' }}>{total > 0 ? `${total} results` : ''}</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={showDeleted} onChange={e => { setShowDeleted(e.target.checked); setPage(1); }} />
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
              confirmMessage: 'Xóa thành viên',
              onClick: async (ids) => { await bulkDeleteMembers(ids); },
            },
            {
              label: 'Kích hoạt', variant: 'primary', icon: '✅',
              onClick: async (ids) => { await bulkActivateMembers(ids); },
            },
            {
              label: 'Vô hiệu hóa', variant: 'warning', icon: '⏸️',
              onClick: async (ids) => { await bulkDeactivateMembers(ids); },
            },
            {
              label: 'Thêm tag', variant: 'primary', icon: '🏷️',
              onClick: async () => { setTagAction('add'); setTagInput(''); setShowTagModal(true); },
            },
            {
              label: 'Xóa tag', variant: 'warning', icon: '🏷️',
              onClick: async () => { setTagAction('remove'); setTagInput(''); setShowTagModal(true); },
            },
            {
              label: 'Xuất CSV', variant: 'primary', icon: '📥',
              onClick: async () => {
                const cols = ['fullName', 'email', 'availablePoints', 'status'];
                const rows = members.filter(m => selectedIds.includes(m.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
                const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
                const a = document.createElement('a'); a.href = url; a.download = 'selected-members.csv'; a.click(); URL.revokeObjectURL(url);
              },
            },
          ]} />
        <DataTable columns={columns} data={members} emptyMessage="No members found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Member' : 'New Member'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Full Name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} required error={formErrors.fullName} />
            <FormInput label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} required type="email" error={formErrors.email} />
            <FormInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} type="tel" error={formErrors.phone} />
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

        <Modal open={showTagModal} title={`${tagAction === 'add' ? 'Add' : 'Remove'} Tags (${selectedIds.length} members)`} onClose={() => setShowTagModal(false)} width={420}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Tags (comma-separated)</label>
            <input type="text" className="search-input" placeholder="e.g. VIP, PREMIUM" value={tagInput} onChange={e => setTagInput(e.target.value)} style={{ maxWidth: 'none', padding: '10px 14px', fontSize: '14px' }} />
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>
              {tagAction === 'add' ? 'These tags will be added to all selected members' : 'These tags will be removed from all selected members'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowTagModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={async () => {
              const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
              if (tags.length === 0) return;
              let updated = 0;
              for (const id of selectedIds) {
                const m = members.find(m => m.id === id);
                if (!m) continue;
                const newTags = tagAction === 'add'
                  ? Array.from(new Set([...(m.tags || []), ...tags]))
                  : (m.tags || []).filter((t: string) => !tags.includes(t));
                try { await updateMember(id, { tags: newTags }); updated++; } catch {}
              }
              showToast(`Updated tags for ${updated} members`, 'success');
              setShowTagModal(false);
              setSelectedIds([]);
              load();
            }} className="btn-primary">{tagAction === 'add' ? 'Add Tags' : 'Remove Tags'}</button>
          </div>
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
