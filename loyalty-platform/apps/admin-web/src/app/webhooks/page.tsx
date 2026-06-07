'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { getWebhookEndpoints, createWebhookEndpoint, updateWebhookEndpoint, deleteWebhookEndpoint, testWebhookEndpoint, getWebhookLogs, duplicateEntity, api } from '@/lib/api';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import type { BulkAction } from '@/components/BulkActionsToolbar';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface WebhookForm {
  name: string; url: string; events: string; secret: string; active: string;
}

const emptyForm: WebhookForm = { name: '', url: '', events: '', secret: '', active: 'true' };

export default function WebhooksPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<WebhookForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { confirmDelete: confirmDeleteWebhook, modal: deleteModal } = useConfirmDelete({
    title: 'Delete Webhook',
    message: 'Delete this webhook endpoint?',
    onConfirm: async () => {
      if (!deletingId) return;
      try { await deleteWebhookEndpoint(deletingId); showToast('Webhook deleted', 'success'); load(); }
      catch { showToast('Network error', 'error'); }
    },
  });
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      const result = await getWebhookEndpoints(params);
      setWebhooks(result.data);
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
  const openEdit = (w: any) => {
    setEditing(w);
    setForm({
      name: w.name, url: w.url, events: (w.events || []).join(', '),
      secret: w.secret || '', active: w.active !== false ? 'true' : 'false',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    confirmDeleteWebhook();
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      await testWebhookEndpoint(id);
      showToast('Test event sent successfully', 'success');
    } catch { showToast('Test failed', 'error'); }
    setTestingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, events: form.events.split(',').map(s => s.trim()).filter(Boolean), active: form.active === 'true' };
      if (editing) {
        await updateWebhookEndpoint(editing.id, body);
        showToast('Webhook endpoint updated successfully', 'success');
      } else {
        await createWebhookEndpoint(body);
        showToast('Webhook endpoint created successfully', 'success');
      }
      setShowModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const result = await getWebhookLogs({ page: 1, limit: 50 });
      setLogs(result.data || []);
      setShowLogs(true);
    } catch { showToast('Failed to load logs', 'error'); }
    setLogsLoading(false);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (w: any) => <span className="font-medium">{w.name}</span> },
    { key: 'url', label: 'URL', render: (w: any) => <span style={{ color: '#2563eb', fontSize: '13px', maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</span> },
    { key: 'events', label: 'Events', render: (w: any) => {
      const evts = w.events || [];
      return (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {evts.slice(0, 2).map((e: string, i: number) => (
            <span key={i} style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#eff6ff', color: '#2563eb' }}>{e}</span>
          ))}
          {evts.length > 2 && <span className="text-muted" style={{ fontSize: '11px' }}>+{evts.length - 2}</span>}
        </div>
      );
    }},
    { key: 'active', label: 'Active', render: (w: any) => (
      <span className={`status-badge ${w.active ? 'active' : 'inactive'}`}>{w.active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (w: any) => (
      <>
        <button onClick={async () => { try { await duplicateEntity('webhooks/endpoints', w.id); showToast('Duplicated', 'success'); load(); } catch { showToast('Network error', 'error'); }}} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>📋</button>
        <button onClick={() => openEdit(w)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleTest(w.id)} disabled={testingId === w.id} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>
          {testingId === w.id ? 'Testing...' : 'Test'}
        </button>
        <button onClick={() => handleDelete(w.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  const logColumns = [
    { key: 'event', label: 'Event', render: (l: any) => <span className="font-medium">{l.event}</span> },
    { key: 'status', label: 'Status', render: (l: any) => (
      <span className={`status-badge ${l.success ? 'active' : 'inactive'}`}>{l.success ? 'Success' : 'Failed'}</span>
    )},
    { key: 'response', label: 'Response', render: (l: any) => <span className="text-muted">{l.responseStatus || '-'}</span> },
    { key: 'createdAt', label: 'Time', render: (l: any) => <span className="text-muted" style={{ fontSize: '13px' }}>{new Date(l.createdAt).toLocaleString()}</span> },
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Webhook Endpoints"
          subtitle="Manage outgoing webhook configurations"
          actions={<button onClick={openCreate} className="btn-primary">+ New Webhook</button>}
        />

        <div className="toolbar">
          <input type="text" placeholder="Search webhooks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          <span className="text-muted">{total > 0 ? `${total} results` : ''}</span>
          <button onClick={loadLogs} className="btn-secondary">View Event Logs</button>
        </div>

        <BulkActionsToolbar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onSuccess={load}
          actions={[
            {
              label: 'Xóa', variant: 'danger', icon: '🗑️',
              confirmMessage: 'Xóa webhooks',
              onClick: async (ids) => { for (const id of ids) await deleteWebhookEndpoint(id); },
            },
          ]} />
        <DataTable columns={columns} data={webhooks} emptyMessage="No webhook endpoints found" selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal open={showModal} title={editing ? 'Edit Webhook Endpoint' : 'New Webhook Endpoint'} onClose={() => setShowModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="URL" value={form.url} onChange={v => setForm({ ...form, url: v })} required placeholder="https://..." />
            <FormInput label="Events (comma-separated)" value={form.events} onChange={v => setForm({ ...form, events: v })} placeholder="member.created, point.earned" />
            <FormInput label="Secret (optional)" value={form.secret} onChange={v => setForm({ ...form, secret: v })} />
            <FormSelect label="Active" value={form.active} onChange={v => setForm({ ...form, active: v })} options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>

        <Modal open={showLogs} title="Webhook Event Logs" onClose={() => setShowLogs(false)} width={720}>
          {logsLoading ? <p className="text-muted">Loading logs...</p> : (
            <DataTable columns={logColumns} data={logs} emptyMessage="No logs found" />
          )}
        </Modal>
        {deleteModal}
      </main>
    </div>
  );
}
