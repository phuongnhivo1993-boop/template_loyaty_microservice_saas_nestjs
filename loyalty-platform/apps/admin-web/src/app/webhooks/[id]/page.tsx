'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import DataTable from '@/components/DataTable';
import { FormInput, FormSelect, FormActions } from '@/components/FormField';
import { getWebhookEndpoint, updateWebhookEndpoint, deleteWebhookEndpoint, testWebhookEndpoint, getWebhookLogs } from '@/lib/api';

export default function WebhookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [webhook, setWebhook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const load = () => {
    getWebhookEndpoint(params.id)
      .then(data => setWebhook(data))
      .catch(() => showToast('Failed to load webhook', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/login'); return; }
    load();
  }, [params.id]);

  const openEdit = () => {
    if (!webhook) return;
    setForm({
      name: webhook.name,
      url: webhook.url,
      events: (webhook.events || []).join(', '),
      secret: webhook.secret || '',
      active: webhook.active !== false ? 'true' : 'false',
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this webhook endpoint?')) return;
    try {
      await deleteWebhookEndpoint(params.id);
      showToast('Webhook endpoint deleted', 'success');
      router.push('/webhooks');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      await testWebhookEndpoint(params.id);
      showToast('Test event sent successfully', 'success');
    } catch { showToast('Test failed', 'error'); }
    setTesting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...form, events: form.events.split(',').map((s: string) => s.trim()).filter(Boolean), active: form.active === 'true' };
      await updateWebhookEndpoint(params.id, body);
      showToast('Webhook endpoint updated', 'success');
      setShowEditModal(false);
      load();
    } catch { showToast('Operation failed', 'error'); }
    setSubmitting(false);
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const result = await getWebhookLogs({ page: 1, limit: 50 });
      const filtered = (result.data || []).filter((l: any) => l.webhookEndpointId === params.id);
      setLogs(filtered);
      setShowLogs(true);
    } catch { showToast('Failed to load logs', 'error'); }
    setLogsLoading(false);
  };

  const logColumns = [
    { key: 'event', label: 'Event', render: (l: any) => <span className="font-medium">{l.event}</span> },
    { key: 'status', label: 'Status', render: (l: any) => (
      <span className={`status-badge ${l.success ? 'active' : 'inactive'}`}>{l.success ? 'Success' : 'Failed'}</span>
    )},
    { key: 'response', label: 'Response', render: (l: any) => <span className="text-muted">{l.responseStatus || '-'}</span> },
    { key: 'createdAt', label: 'Time', render: (l: any) => <span className="text-muted" style={{ fontSize: '13px' }}>{new Date(l.createdAt).toLocaleString()}</span> },
  ];

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.push('/webhooks')} className="btn-secondary">← Back to Webhooks</button>

        {webhook ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{webhook.name}</h1>
                <p style={{ color: '#2563eb', fontSize: '14px', marginTop: '4px' }}>{webhook.url}</p>
              </div>
              <span className={`status-badge ${webhook.active ? 'active' : 'inactive'}`}>{webhook.active ? 'Active' : 'Inactive'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={openEdit} className="btn-primary">Edit Webhook</button>
              <button onClick={handleTest} disabled={testing} className="btn-secondary">
                {testing ? 'Testing...' : 'Test Webhook'}
              </button>
              <button onClick={handleDelete} className="btn-danger">Delete Webhook</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Endpoint Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Name:</strong> {webhook.name}</div>
                <div style={{ marginBottom: '12px' }}><strong>URL:</strong> <span style={{ color: '#2563eb' }}>{webhook.url}</span></div>
                <div style={{ marginBottom: '12px' }}><strong>Active:</strong> {webhook.active ? 'Yes' : 'No'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Last Triggered At:</strong> {webhook.lastTriggeredAt ? new Date(webhook.lastTriggeredAt).toLocaleString() : '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Failure Count:</strong> {webhook.failureCount ?? 0}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Events</h2>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {(webhook.events || []).map((e: string, i: number) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: '#eff6ff', color: '#2563eb' }}>{e}</span>
                  ))}
                  {(!webhook.events || webhook.events.length === 0) && <span className="text-muted">No events configured</span>}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button onClick={loadLogs} className="btn-secondary">View Recent Event Logs</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Webhook endpoint not found</p>
        )}

        <Modal open={showEditModal} title="Edit Webhook Endpoint" onClose={() => setShowEditModal(false)} width={520}>
          <form onSubmit={handleSubmit}>
            <FormInput label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
            <FormInput label="URL" value={form.url} onChange={v => setForm({ ...form, url: v })} required placeholder="https://..." />
            <FormInput label="Events (comma-separated)" value={form.events} onChange={v => setForm({ ...form, events: v })} placeholder="member.created, point.earned" />
            <FormInput label="Secret (optional)" value={form.secret} onChange={v => setForm({ ...form, secret: v })} />
            <FormSelect label="Active" value={form.active} onChange={v => setForm({ ...form, active: v })} options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]} />
            <FormActions onCancel={() => setShowEditModal(false)} loading={submitting} submitLabel="Save" />
          </form>
        </Modal>

        <Modal open={showLogs} title="Recent Event Logs" onClose={() => setShowLogs(false)} width={720}>
          {logsLoading ? <p className="text-muted">Loading logs...</p> : (
            <DataTable columns={logColumns} data={logs} emptyMessage="No logs found for this endpoint" />
          )}
        </Modal>
      </main>
    </div>
  );
}
