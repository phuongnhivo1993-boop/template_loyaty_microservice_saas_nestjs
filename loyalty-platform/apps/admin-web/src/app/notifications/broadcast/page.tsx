'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/Toast';

export default function BroadcastPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ templateId: '', channel: 'EMAIL', variables: '{}', tenantId: '' });
  const [result, setResult] = useState<{ sent: number; total: number; message: string } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    const loadTemplates = async () => {
      const r = await fetch('/api/notifications/templates?limit=1000', { headers });
      const res = await r.json();
      setTemplates(Array.isArray(res) ? res : res.data || []);
      setLoading(false);
    };
    // Try to get tenantId from user info
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userInfo) {
      try { const u = JSON.parse(userInfo); if (u.tenantId) setForm(f => ({ ...f, tenantId: u.tenantId })); } catch {}
    }
    loadTemplates();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.templateId || !form.tenantId) { showToast('Please fill all required fields', 'error'); return; }
    let variables: any = {};
    try { variables = JSON.parse(form.variables); } catch { showToast('Invalid JSON in Variables', 'error'); return; }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...form, variables }),
      });
      if (!res.ok) { showToast('Failed to send broadcast', 'error'); return; }
      const data = await res.json();
      setResult(data);
      showToast(`Notification sent to ${data.sent} members`, 'success');
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader
          title="Broadcast Notification"
          subtitle="Send a notification to all active members"
        />

        <div style={{ maxWidth: '600px' }}>
          <form onSubmit={handleBroadcast}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Template *</label>
              <select value={form.templateId} onChange={e => setForm({ ...form, templateId: e.target.value })} required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                <option value="">Select template...</option>
                {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Channel *</label>
              <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">Push</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Tenant ID *</label>
              <input value={form.tenantId} onChange={e => setForm({ ...form, tenantId: e.target.value })} required placeholder="Enter tenant ID"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Variables (JSON)</label>
              <textarea value={form.variables} onChange={e => setForm({ ...form, variables: e.target.value })} rows={4}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', resize: 'vertical' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>e.g. {"{\"name\":\"string\",\"points\":\"100\"}"}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '24px' }}>
              <button type="submit" style={{
                padding: '12px 32px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 600, fontSize: '15px', opacity: sending ? 0.6 : 1,
              }} disabled={sending}>
                {sending ? 'Sending...' : 'Send to All Members'}
              </button>
              <button type="button" onClick={() => router.back()} style={{
                padding: '12px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
            </div>
          </form>

          {result && (
            <div style={{ marginTop: '24px', padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
              <Text style={{ fontWeight: 600, color: '#16a34a', fontSize: '16px', marginBottom: '4px' }}>✓ Broadcast Complete</Text>
              <Text style={{ color: '#166534', fontSize: '14px' }}>{result.message}</Text>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Text({ children, style }: any) {
  return <p style={style}>{children}</p>;
}
