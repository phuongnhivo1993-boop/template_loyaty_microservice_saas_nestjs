'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface TemplateForm { name: string; type: string; subject: string; content: string; variables: string; }

const emptyForm: TemplateForm = { name: '', type: 'EMAIL', subject: '', content: '', variables: '{}' };

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [sendForm, setSendForm] = useState({ templateId: '', recipient: '', channel: 'EMAIL', variables: '{}' });
  const [showSendModal, setShowSendModal] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadTemplates = async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
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
  }, [tab, search, page]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, type: t.type || 'EMAIL', subject: t.subject || '', content: t.content || '', variables: t.variables ? JSON.stringify(t.variables) : '{}' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/notifications/templates/${id}`, { method: 'DELETE', headers });
    loadTemplates();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(form.variables); } catch { alert('Invalid JSON in Variables'); return; }
    const body = { ...form, variables };
    const url = editing ? `/api/notifications/templates/${editing.id}` : '/api/notifications/templates';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers, body: JSON.stringify(body) });
    setShowModal(false);
    loadTemplates();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    let variables: any = {};
    try { variables = JSON.parse(sendForm.variables); } catch { alert('Invalid JSON in Variables'); return; }
    await fetch('/api/notifications/send', { method: 'POST', headers, body: JSON.stringify({ ...sendForm, variables }) });
    setShowSendModal(false);
    setTab('logs');
    setPage(1);
    loadLogs();
  };

  const modal = showModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={() => setShowModal(false)}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '540px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>{editing ? 'Edit Template' : 'New Template'}</h2>
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
      </div>
    </div>
  );

  const sendModal = showSendModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={() => setShowSendModal(false)}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '480px' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Send Notification</h2>
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
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Notifications</h1>
            <p style={{ color: '#64748b' }}>Manage templates and view delivery logs</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {tab === 'templates' && <>
              <button onClick={() => setShowSendModal(true)}
                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>Send Now</button>
              <button onClick={openCreate}
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>+ New Template</button>
            </>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', background: '#f1f5f9', borderRadius: '8px', padding: '4px', width: 'fit-content' }}>
          <button onClick={() => { setTab('templates'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'templates' ? 'white' : 'transparent', color: tab === 'templates' ? '#2563eb' : '#64748b', boxShadow: tab === 'templates' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Templates</button>
          <button onClick={() => { setTab('logs'); setPage(1); setSearch(''); }}
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', background: tab === 'logs' ? 'white' : 'transparent', color: tab === 'logs' ? '#2563eb' : '#64748b', boxShadow: tab === 'logs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Delivery Logs</button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder={tab === 'templates' ? 'Search templates...' : 'Search logs...'}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
          <button onClick={async () => {
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
          }} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        {tab === 'templates' ? (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Subject</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No templates found</td></tr>
                ) : templates.map((t: any) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{t.name}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{t.type}</span></td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{t.subject || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => openEdit(t)} style={{ marginRight: '8px', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                      <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Recipient</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Channel</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Subject</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No logs found</td></tr>
                ) : logs.map((l: any) => (
                  <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>{l.recipient}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{l.channel}</span></td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{l.subject || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                        background: l.status === 'SENT' ? '#dcfce7' : l.status === 'FAILED' ? '#fef2f2' : '#fef9c3',
                        color: l.status === 'SENT' ? '#16a34a' : l.status === 'FAILED' ? '#dc2626' : '#ca8a04',
                      }}>{l.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{l.sentAt ? new Date(l.sentAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: page <= 1 ? '#f1f5f9' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#94a3b8' : '#475569', fontWeight: 500 }}>Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return <button key={p} onClick={() => setPage(p)} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: p === page ? '#2563eb' : 'white', color: p === page ? 'white' : '#475569', cursor: 'pointer', fontWeight: 600 }}>{p}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: page >= totalPages ? '#f1f5f9' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#94a3b8' : '#475569', fontWeight: 500 }}>Next</button>
          </div>
        )}
        {modal}{sendModal}
      </main>
    </div>
  );
}
