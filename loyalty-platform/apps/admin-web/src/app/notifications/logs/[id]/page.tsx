'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';

export default function NotificationLogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    (async () => {
      try {
        const res = await fetch(`/api/notifications/logs/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setLoading(false); return; }
        const result = await res.json();
        const data = result.data ?? result;
        setLog(data);
      } catch {}
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!log) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Notification log not found</p></main></div>;

  const statusColor: Record<string, { bg: string; color: string }> = {
    SENT: { bg: '#dcfce7', color: '#16a34a' },
    PENDING: { bg: '#fef9c3', color: '#ca8a04' },
    FAILED: { bg: '#fef2f2', color: '#dc2626' },
  };
  const sc = statusColor[log.status] || { bg: '#f1f5f9', color: '#64748b' };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content" style={{ background: '#f8fafc' }}>
        <PageHeader title="Notification Log Detail" subtitle={`Log #${log.id?.slice(0, 8)}`} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Status</div>
            <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>{log.status}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Channel</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{log.channel}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Recipient</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{log.recipient}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Sent At</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}</div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Log ID', log.id],
                ['Template ID', log.templateId || '-'],
                ['Recipient', log.recipient],
                ['Channel', log.channel],
                ['Subject', log.subject || '-'],
                ['Status', log.status],
                ['Sent At', log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'],
                ['Created At', log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'],
              ].map(([label, value]) => (
                <tr key={String(label)} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px', color: '#64748b', fontWeight: 500, fontSize: '14px', width: '180px' }}>{label}</td>
                  <td style={{ padding: '10px 16px', fontSize: '14px' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {log.content && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Content</h3>
            <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#334155', maxHeight: '400px', overflow: 'auto' }}>{log.content}</pre>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <button onClick={() => router.back()} className="btn-secondary">← Back</button>
        </div>
      </main>
    </div>
  );
}
