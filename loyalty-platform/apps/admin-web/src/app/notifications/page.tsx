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

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadTemplates = async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (filterType) params.set('type', filterType);
    const r = await fetch(`/api/notifications/templates?${params}`, { headers });
    const res = await r.json();
    setTemplates(Array.isArray(res) ? res : res.data || []);
    setTotalPages(res.totalPages || 1);
    setTotal(res.total || 0);
    setLoading(false);
  };

  const loadLogs = async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (filterStatus) params.set('status', filterStatus);
    const r = await fetch(`/api/notifications/logs?${params}`, { headers });
    const res = await r.json();
    setLogs(Array.isArray(res) ? res : res.data || []);
    setTotalPages(res.totalPages || 1);
    setTotal(res.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
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
      const res = await fetch(`/api/notifications/templates/${id}`, { method: 'DELETE', headers });
      if (!res.ok) { showToast('Failed to delete template', 'error'); return; }
      showToast('Template deleted successfully', 'success');
      loadTemplates();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(form.variables); } catch { showToast('Invalid JSON in Variables', 'error'); return; }
    try {
      const body = { ...form, variables };
      const url = editing ? `/api/notifications/templates/${editing.id}` : '/api/notifications/templates';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { showToast('Operation failed', 'error'); return; }
      showToast(editing ? 'Template updated successfully' : 'Template created successfully', 'success');
      setShowModal(false);
      loadTemplates();
    } catch { showToast('Network error', 'error'); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(sendForm.variables); } catch { showToast('Invalid JSON in Variables', 'error'); return; }
    try {
      const res = await fetch('/api/notifications/send', { method: 'POST', headers, body: JSON.stringify({ ...sendForm, variables }) });
      if (!res.ok) { showToast('Failed to send notification', 'error'); return; }
      showToast('Notification sent successfully', 'success');
      setShowSendModal(false);
      setTab('logs');
      setPage(1);
      loadLogs();
    } catch { showToast('Network error', 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams({ page: '1', limit: '10000' });
    if (search) params.set('search', search);
    if (tab === 'templates') {
      const r = await fetch(`/api/notifications/templates?${params}`, { headers });
      const res = await r.json();
      const data = Array.isArray(res) ? res : res.data || [];
      const cols = ['name', 'type', 'subject', 'content'];
      const header = cols.join(',');
      const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'notification-templates.csv'; a.click(); URL.revokeObjectURL(url);
    } else {
      const r = await fetch(`/api/notifications/logs?${params}`, { headers });
      const res = await r.json();
      const data = Array.isArray(res) ? res : res.data || [];
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
    { key: 'name', label: 'Name', render: (t: any) => <span style={{ fontWeight: 500 }}>{t.name}</span> },
    { key: 'type', label: 'Type', render: (t: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{t.type}</span> },
    { key: 'subject', label: 'Subject', render: (t: any) => <span style={{ color: '#64748b' }}>{t.subject || '-'}</span> },
    { key: 'actions', label: 'Actions', render: (t: any) => (
      <>
        <button onClick={() => router.push(`/notifications/${t.id}`)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>View</button>
        <button onClick={() => openEdit(t)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
        <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </>
    )},
  ];

  const logColumns = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'channel', label: 'Channel', render: (l: any) => <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{l.channel}</span> },
    { key: 'subject', label: 'Subject', render: (l: any) => <span style={{ color: '#64748b' }}>{l.subject || '-'}</span> },
    { key: 'status', label: 'Status', render: (l: any) => (
      <span style={{
        padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
        background: l.status === 'SENT' ? '#dcfce7' : l.status === 'FAILED' ? '#fef2f2' : '#fef9c3',
        color: l.status === 'SENT' ? '#16a34a' : l.status === 'FAILED' ? '#dc2626' : '#ca8a04',
      }}>{l.status}</span>
    )},
    { key: 'sentAt', label: 'Sent At', render: (l: any) => <span style={{ color: '#64748b' }}>{l.sentAt ? new Date(l.sentAt).toLocaleString() : '-'}</span> },
    { key: 'actions', label: '', render: (l: any) => <button onClick={() => router.push(`/notifications/logs/${l.id}`)} style={{ padding: '6px 14px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View</button> },
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Notifications"
          subtitle="Manage templates and view delivery logs"
          actions={tab === 'templates' ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowSendModal(true)}
                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>Send Now</button>
              <button onClick={openCreate}
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Template</button>
            </div>
          ) : undefined}
        />

        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', background: '#f1f5f9', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
          <button onClick={() => { setTab('templates'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'templates' ? 'white' : 'transparent', color: tab === 'templates' ? '#2563eb' : '#64748b', boxShadow: tab === 'templates' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Templates</button>
          <button onClick={() => { setTab('logs'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'logs' ? 'white' : 'transparent', color: tab === 'logs' ? '#2563eb' : '#64748b', boxShadow: tab === 'logs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Delivery Logs</button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {tab === 'templates' && (
            <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
              <option value="">All Types</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">Push</option>
            </select>
          )}
          {tab === 'logs' && (
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
              <option value="">All Status</option>
              <option value="SENT">Sent</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          )}
          <input type="text" placeholder={tab === 'templates' ? 'Search templates...' : 'Search logs...'}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
          {tab === 'templates' && (
            <button onClick={() => setShowImport(true)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Import</button>
          )}
          <button onClick={exportCsv} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
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
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">Push</option>
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Subject</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Content (HTML / plain text)</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Variables (JSON)</label>
              <textarea value={form.variables} onChange={e => setForm({ ...form, variables: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace', resize: 'vertical' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>e.g. {"{\"name\":\"string\",\"points\":\"number\"}"}</span>
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

        <ImportModal open={showImport} onClose={() => setShowImport(false)} entity="notification_templates" entityLabel="templates" onImportComplete={loadTemplates} />

        <Modal open={showSendModal} title="Send Notification" onClose={() => setShowSendModal(false)}>
          <form onSubmit={handleSend}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Template</label>
              <select value={sendForm.templateId} onChange={e => setSendForm({ ...sendForm, templateId: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="">Select template...</option>
                {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Recipient</label>
              <input value={sendForm.recipient} onChange={e => setSendForm({ ...sendForm, recipient: e.target.value })} required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Channel</label>
              <select value={sendForm.channel} onChange={e => setSendForm({ ...sendForm, channel: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">Push</option>
              </select>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Variables (JSON)</label>
              <textarea value={sendForm.variables} onChange={e => setSendForm({ ...sendForm, variables: e.target.value })} rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowSendModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button type="submit"
                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Send</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
