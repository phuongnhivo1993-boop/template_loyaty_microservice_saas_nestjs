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
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { getGiftCards, createGiftCard, updateGiftCard, assignGiftCard, getMembers, duplicateEntity } from '@/lib/api';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface GiftCardForm {
  code: string; initialValue: string; type: string; expiryDate: string; status: string;
}

const emptyForm: GiftCardForm = { code: '', initialValue: '', type: 'PHYSICAL', expiryDate: '', status: 'ACTIVE' };

export default function GiftCardsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCardId, setAssignCardId] = useState<string | null>(null);
  const [assignMemberId, setAssignMemberId] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<GiftCardForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [showImport, setShowImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteGiftCard, modal: deleteModal } = useConfirmDelete({
    title: 'Deactivate Gift Card',
    message: 'Deactivate this gift card?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await updateGiftCard(deletingId, { status: 'INACTIVE' }); showToast('Gift card deactivated', 'success'); load(); }
      catch { showToast('Operation failed', 'error'); }
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const result = await getGiftCards(params);
      setCards(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page, typeFilter, statusFilter]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      code: c.code || '', initialValue: c.initialValue?.toString() || '',
      type: c.type || 'PHYSICAL', expiryDate: c.expiryDate?.slice(0, 10) || '', status: c.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const openAssign = async (cardId: string) => {
    setAssignCardId(cardId);
    setAssignMemberId('');
    try {
      const result = await getMembers({ page: 1, limit: 200 });
      setMembers(result.data || []);
    } catch { showToast('Failed to load members', 'error'); }
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!assignCardId || !assignMemberId) return;
    try {
      await assignGiftCard(assignCardId, assignMemberId);
      showToast('Gift card assigned successfully', 'success');
      setShowAssignModal(false);
      load();
    } catch { showToast('Failed to assign gift card', 'error'); }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteGiftCard();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, initialValue: Number(form.initialValue), expiryDate: form.expiryDate || undefined };
      if (editing) {
        await updateGiftCard(editing.id, body);
        showToast('Gift card updated successfully', 'success');
      } else {
        await createGiftCard(body);
        showToast('Gift card created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const exportCsv = async () => {
    const params: any = { page: 1, limit: 10000 };
    if (search) params.search = search;
    const result = await getGiftCards(params);
    const data = result.data;
    const cols = ['code', 'initialValue', 'balance', 'type', 'status', 'expiryDate'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'gift-cards.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'code', label: 'Code', render: (c: any) => <span className="font-medium" style={{ fontFamily: 'monospace' }}>{c.code || c.id.slice(0, 8)}</span> },
    { key: 'initialValue', label: 'Initial Value', render: (c: any) => <span style={{ fontWeight: 600 }}>{Number(c.initialValue || 0).toLocaleString()} VND</span> },
    { key: 'balance', label: 'Balance', render: (c: any) => {
      const bal = Number(c.balance || 0);
      const init = Number(c.initialValue || 0);
      const pct = init > 0 ? Math.round(bal / init * 100) : 100;
      return <span style={{ color: bal > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{bal.toLocaleString()} VND ({pct}%)</span>;
    }},
    { key: 'type', label: 'Type', render: (c: any) => <span className="status-badge">{c.type}</span> },
    { key: 'status', label: 'Status', render: (c: any) => (
      <span className={`status-badge ${(c.status || 'ACTIVE').toLowerCase()}`}>{c.status || 'ACTIVE'}</span>
    )},
    { key: 'expiryDate', label: 'Expiry', render: (c: any) => c.expiryDate ? <span className="text-muted" style={{ fontSize: '13px' }}>{new Date(c.expiryDate).toLocaleDateString()}</span> : <span className="text-muted">-</span> },
    { key: 'actions', label: 'Actions', render: (c: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('gift-cards', c.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => openEdit(c)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => openAssign(c.id)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Assign</button>
        <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Deactivate</button>
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={6} cols={7} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Gift Cards"
          subtitle="Manage gift card inventory"
          actions={<button onClick={openCreate} className="btn-primary">+ New Gift Card</button>}
        />

        <div className="toolbar">
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Types</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="REDEEMED">Redeemed</option>
          </select>
          <input type="text" placeholder="Search gift cards..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={() => setShowImport(true)} className="btn-secondary">Import CSV</button>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        <BulkActionsToolbar selectedIds={selectedIds} onClear={() => setSelectedIds([])}
          actions={[
            { label: 'Deactivate Selected', variant: 'danger', confirmMessage: 'Xác nhận hủy kích hoạt', onClick: async (ids) => { for (const id of ids) await updateGiftCard(id, { status: 'INACTIVE' }); } },
            { label: 'Export CSV', onClick: async (ids) => {
              const cols = ['code', 'initialValue', 'balance', 'type', 'status', 'expiryDate'];
              const rows = cards.filter(c => ids.includes(c.id)).map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
              const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
              const a = document.createElement('a'); a.href = url; a.download = 'selected-gift-cards.csv'; a.click(); URL.revokeObjectURL(url);
            }},
          ]} onSuccess={load} />
        <DataTable columns={columns} data={cards} emptyMessage="No gift cards found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Gift Card' : 'New Gift Card'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Code (leave empty for auto-generate)" value={form.code} onChange={v => setForm({ ...form, code: v })} />
            <FormInput label="Initial Value (VND)" type="number" value={form.initialValue} onChange={v => setForm({ ...form, initialValue: v })} required />
            <FormSelect label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[
              { value: 'PHYSICAL', label: 'Physical' },
              { value: 'DIGITAL', label: 'Digital' },
            ]} />
            <FormInput label="Expiry Date" type="date" value={form.expiryDate} onChange={v => setForm({ ...form, expiryDate: v })} />
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>

        <Modal open={showAssignModal} title="Assign Gift Card to Member" onClose={() => setShowAssignModal(false)} width={440}>
          <FormSelect label="Select Member" value={assignMemberId} onChange={setAssignMemberId} options={members.map((m: any) => ({ value: m.id, label: `${m.fullName || m.email || m.id}` }))} placeholder="Choose a member..." />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" onClick={() => setShowAssignModal(false)}
              style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
            <button type="button" onClick={handleAssign} disabled={!assignMemberId}
              style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: assignMemberId ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '14px', opacity: assignMemberId ? 1 : 0.6 }}>
              Assign to Member
            </button>
          </div>
        </Modal>

        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="gift-cards" entityLabel="gift cards" onImportComplete={load} />
        {deleteModal}
      </main>
    </div>
  );
}
