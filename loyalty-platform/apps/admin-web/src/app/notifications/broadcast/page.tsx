'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/Toast';
import { FormInput, FormSelect, FormTextarea, FormActions } from '@/components/FormField';
import { getNotificationTemplates, api } from '@/lib/api';

export default function BroadcastPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ templateId: '', channel: 'EMAIL', variables: '{}', tenantId: '' });
  const [result, setResult] = useState<{ sent: number; total: number; message: string } | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    const loadTemplates = async () => {
      const result = await getNotificationTemplates({ limit: 1000 });
      setTemplates(result.data);
      setLoading(false);
    };
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
      const data: any = await api.post('/notifications/broadcast', { ...form, variables });
      setResult(data);
      showToast(`Notification sent to ${data.sent} members`, 'success');
    } catch {
      showToast('Failed to send broadcast', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={4} cols={3} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader
          title="Broadcast Notification"
          subtitle="Send a notification to all active members"
        />

        <div style={{ maxWidth: '600px' }}>
          <form onSubmit={handleBroadcast}>
            <FormSelect
              label="Template"
              value={form.templateId}
              onChange={v => setForm({ ...form, templateId: v })}
              required
              placeholder="Select template..."
              options={templates.map((t: any) => ({ value: t.id, label: `${t.name} (${t.type})` }))}
            />

            <FormSelect
              label="Channel"
              value={form.channel}
              onChange={v => setForm({ ...form, channel: v })}
              required
              options={[
                { value: 'EMAIL', label: 'Email' },
                { value: 'SMS', label: 'SMS' },
                { value: 'PUSH', label: 'Push' },
              ]}
            />

            <FormInput
              label="Tenant ID"
              value={form.tenantId}
              onChange={v => setForm({ ...form, tenantId: v })}
              required
              placeholder="Enter tenant ID"
            />

            <FormTextarea
              label="Variables (JSON)"
              value={form.variables}
              onChange={v => setForm({ ...form, variables: v })}
              rows={4}
            />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>e.g. {"{\"name\":\"string\",\"points\":\"100\"}"}</span>

            <FormActions
              onCancel={() => router.back()}
              loading={sending}
              submitLabel="Send to All Members"
              cancelLabel="Cancel"
            />
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
