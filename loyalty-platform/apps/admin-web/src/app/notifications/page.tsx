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
import { getNotificationTemplates, getNotificationLogs, createTemplate, updateTemplate, deleteTemplate, sendNotification } from '@/lib/api';

interface TemplateForm { name: string; type: string; subject: string; content: string; variables: string; }

const emptyForm: TemplateForm = { name: '', type: 'EMAIL', subject: '', content: '', variables: '{}' };

export default function NotificationsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [sendForm, setSendForm] = useState({ templateId: '', recipient: '', channel: 'EMAIL', variables: '{}' });
  const [showSendModal, setShowSendModal] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (filterType) params.type = filterType;
      const result = await getNotificationTemplates(params);
      setTemplates(result.data);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      const result = await getNotificationLogs(params);
      setLogs(result.data);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    if (tab === 'templates') loadTemplates();
    else loadLogs();
  }, [tab, search, page, filterType, filterStatus]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, type: t.type || 'EMAIL', subject: t.subject || '', content: t.content || '', variables: t.variables ? JSON.stringify(t.variables) : '{}' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      await deleteTemplate(id);
      showToast('Template deleted successfully', 'success');
      loadTemplates();
    } catch { showToast('Failed to delete template', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(form.variables); } catch { showToast('Invalid JSON in Variables', 'error'); return; }
    try {
      const body = { ...form, variables };
      if (editing) {
        await updateTemplate(editing.id, body);
        showToast('Template updated successfully', 'success');
      } else {
        await createTemplate(body);
        showToast('Template created successfully', 'success');
      }
      setShowModal(false);
      loadTemplates();
    } catch { showToast('Operation failed', 'error'); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(sendForm.variables); } catch { showToast('Invalid JSON in Variables', 'error'); return; }
    try {
      await sendNotification({ ...sendForm, variables });
      showToast('Notification sent successfully', 'success');
      setShowSendModal(false);
      setTab('logs');
      setPage(1);
      loadLogs();
    } catch { showToast('Failed to send notification', 'error'); }
  };

  const exportCsv = async () => {
    const params: Record<string, any> = { page: 1, limit: 10000 };
    if (search) params.search = search;
    if (tab === 'templates') {
      const result = await getNotificationTemplates(params);
      const data = result.data;
      const cols = ['name', 'type', 'subject', 'content'];
      const header = cols.join(',');
      const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'notification-templates.csv'; a.click(); URL.revokeObjectURL(url);
    } else {
      const result = await getNotificationLogs(params);
      const data = result.data;
      const cols = ['recipient', 'channel', 'subject', 'status', 'sentAt'];
      const header = cols.join(',');
      const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'notification-logs.csv'; a.click(); URL.revokeObjectURL(url);
    }
  };

  const templateColumns = [
    { key: 'name', label: 'Name', render: (t: any) => <span className="font-medium">{t.name}</span> },
    { key: 'type', label: 'Type', render: (t: any) => <span className="status-badge">{t.type}</span> },
    { key: 'subject', label: 'Subject', render: (t: any) => <span className="text-muted">{t.subject || '-'}</span> },
    { key: 'actions', label: 'Actions', render: (t: any) => (
      <>
        <button onClick={() => router.push(`/notifications/${t.id}`)} className="btn-primary btn-sm" style={{ marginRight: '8px' }}>View</button>
        <button onClick={() => openEdit(t)} className="btn-secondary btn-sm" style={{ marginRight: '8px' }}>Edit</button>
        <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Delete</button>
      </>
    )},
  ];

  const logColumns = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'channel', label: 'Channel', render: (l: any) => <span className="status-badge">{l.channel}</span> },
    { key: 'subject', label: 'Subject', render: (l: any) => <span className="text-muted">{l.subject || '-'}</span> },
    { key: 'status', label: 'Status', render: (l: any) => (
      <span className={`status-badge ${l.status === 'SENT' ? 'status-badge--success' : l.status === 'FAILED' ? 'status-badge--danger' : 'status-badge--warning'}`}>{l.status}</span>
    )},
    { key: 'sentAt', label: 'Sent At', render: (l: any) => <span className="text-muted">{l.sentAt ? new Date(l.sentAt).toLocaleString() : '-'}</span> },
    { key: 'actions', label: '', render: (l: any) => <button onClick={() => router.push(`/notifications/logs/${l.id}`)} className="btn-primary btn-sm">View</button> },
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Notifications"
          subtitle="Manage templates and view delivery logs"
          actions={tab === 'templates' ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowSendModal(true)} className="btn-primary">Send Now</button>
              <button onClick={openCreate} className="btn-primary">+ New Template</button>
            </div>
          ) : undefined}
        />

        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', background: '#f1f5f9', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
          <button onClick={() => { setTab('templates'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'templates' ? 'white' : 'transparent', color: tab === 'templates' ? '#2563eb' : '#64748b', boxShadow: tab === 'templates' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Templates</button>
          <button onClick={() => { setTab('logs'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'logs' ? 'white' : 'transparent', color: tab === 'logs' ? '#2563eb' : '#64748b', boxShadow: tab === 'logs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Delivery Logs</button>
        </div>

        <div className="toolbar">
          {tab === 'templates' && (
            <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Types</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">Push</option>
            </select>
          )}
          {tab === 'logs' && (
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="filter-select">
              <option value="">All Status</option>
              <option value="SENT">Sent</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          )}
          <input type="text" placeholder={tab === 'templates' ? 'Search templates...' : 'Search logs...'}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="search-input" />
          {total > 0 && <span className="text-muted">{total} results</span>}
          {tab === 'templates' && (
            <button onClick={() => setShowImport(true)} className="btn-secondary">Import</button>
          )}
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
        </div>

        {tab === 'templates' ? (
          <>
            <DataTable columns={templateColumns} data={templates} emptyMessage="No templates found" />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <>
            <DataTable columns={logColumns} data={logs} emptyMessage="No logs found" />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}

        <Modal open={showModal} title={editing ? 'Edit Template' : 'New Template'} onClose={() => setShowModal(false)} width={540}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormSelect label="Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[{ value: 'EMAIL', label: 'Email' }, { value: 'SMS', label: 'SMS' }, { value: 'PUSH', label: 'Push' }]} />
            <FormInput label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} />
            <FormTextarea label="Content (HTML / plain text)" value={form.content} onChange={v => setForm({ ...form, content: v })} rows={5} />
            <FormTextarea label="Variables (JSON)" value={form.variables} onChange={v => setForm({ ...form, variables: v })} rows={3} />
            <span className="text-muted" style={{ fontSize: '11px' }}>e.g. {"{\"name\":\"string\",\"points\":\"number\"}"}</span>
            <FormActions onCancel={() => setShowModal(false)} loading={false} submitLabel={editing ? 'Save' : 'Create'} />
          </form>
        </Modal>

        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="notification_templates" entityLabel="templates" onImportComplete={loadTemplates} />

        <Modal open={showSendModal} title="Send Notification" onClose={() => setShowSendModal(false)}>
          <form onSubmit={handleSend}>
            <FormSelect label="Template" value={sendForm.templateId} onChange={v => setSendForm({ ...sendForm, templateId: v })} required placeholder="Select template..." options={templates.map((t: any) => ({ value: t.id, label: t.name }))} />
            <FormInput label="Recipient" value={sendForm.recipient} onChange={v => setSendForm({ ...sendForm, recipient: v })} required />
            <FormSelect label="Channel" value={sendForm.channel} onChange={v => setSendForm({ ...sendForm, channel: v })} options={[{ value: 'EMAIL', label: 'Email' }, { value: 'SMS', label: 'SMS' }, { value: 'PUSH', label: 'Push' }]} />
            <FormTextarea label="Variables (JSON)" value={sendForm.variables} onChange={v => setSendForm({ ...sendForm, variables: v })} rows={3} />
            <FormActions onCancel={() => setShowSendModal(false)} loading={false} submitLabel="Send" cancelLabel="Cancel" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
