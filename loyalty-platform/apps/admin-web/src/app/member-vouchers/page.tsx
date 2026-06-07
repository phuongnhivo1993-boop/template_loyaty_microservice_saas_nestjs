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
import { getMemberVouchers, assignVoucher, deleteMemberVoucher, duplicateEntity, api } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface AssignForm { memberId: string; voucherId: string; }

export default function MemberVouchersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteMemberVoucher, modal: deleteModal } = useConfirmDelete({
    title: 'Remove Assignment',
    message: 'Remove this voucher assignment?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await deleteMemberVoucher(deletingId); showToast('Assignment removed', 'success'); load(); }
      catch { showToast('Network error', 'error'); }
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState<AssignForm>({ memberId: '', voucherId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      const result = await getMemberVouchers(params);
      setAssignments(result.data);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, [search, page]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignVoucher(form);
      showToast('Voucher assigned successfully', 'success');
      setShowModal(false);
      setForm({ memberId: '', voucherId: '' });
      load();
    } catch { showToast('Failed to assign voucher', 'error'); }
  };

  const handleUnassign = (id: string) => {
    setDeletingId(id);
    confirmDeleteMemberVoucher();
  };

  const exportCsv = async () => {
    const params: Record<string, any> = { page: 1, limit: 10000 };
    const result = await getMemberVouchers(params);
    const data = result.data;
    const cols = ['memberId', 'voucherId', 'redeemed', 'redeemedAt', 'createdAt'];
    const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
    const url = URL.createObjectURL(new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'member-vouchers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'member', label: 'Member', render: (a: any) => <span className="font-medium">{a.member?.fullName || a.memberId?.slice(0, 12) || '-'}</span> },
    { key: 'voucher', label: 'Voucher', render: (a: any) => <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{a.voucher?.code || a.voucherId?.slice(0, 12) || '-'}</span> },
    { key: 'redeemed', label: 'Redeemed', render: (a: any) => (
      <span className={`status-badge ${a.redeemed ? 'status-badge--success' : 'status-badge--default'}`}>{a.redeemed ? 'Yes' : 'No'}</span>
    )},
    { key: 'redeemedAt', label: 'Redeemed At', render: (a: any) => <span className="text-muted">{a.redeemedAt ? new Date(a.redeemedAt).toLocaleString() : '-'}</span> },
    { key: 'createdAt', label: 'Assigned', render: (a: any) => <span className="text-muted">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</span> },
    { key: 'actions', label: 'Actions', render: (a: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('member-vouchers', a.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => router.push(`/member-vouchers/${a.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        {!a.redeemed && (
          <button onClick={() => handleUnassign(a.id)} className="btn-danger btn-sm">Unassign</button>
        )}
      </>
    )},
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Member Vouchers"
          subtitle="Assign and manage vouchers for members"
          actions={<button onClick={() => setShowModal(true)} className="btn-primary">+ Assign Voucher</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search by member name or email..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
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
              confirmMessage: 'Xóa assignments',
              onClick: async (ids) => { for (const id of ids) await deleteMemberVoucher(id); },
            },
          ]} />
        <DataTable columns={columns} data={assignments} emptyMessage="No member voucher assignments found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="member_vouchers" entityLabel="member vouchers" onImportComplete={load} />

        <Modal open={showModal} title="Assign Voucher" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAssign}>
            <FormInput label="Member ID" value={form.memberId} onChange={v => setForm({ ...form, memberId: v })} required />
            <FormInput label="Voucher ID" value={form.voucherId} onChange={v => setForm({ ...form, voucherId: v })} required />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel="Assign" />
          </form>
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
