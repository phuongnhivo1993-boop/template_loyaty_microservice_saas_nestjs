'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';

export default function NotificationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    setLoading(true);
    api.get(`/notifications/templates/${id}`).then(setNotification).catch(() => showToast('Failed to load notification template', 'error')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!notification) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Notification template not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{notification.name}</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Template ID: {notification.id}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Type', value: notification.type, color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Subject', value: notification.subject || '-', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Variables', value: notification.variables ? Object.keys(notification.variables).join(', ') : 'None', color: '#d97706', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Content</h2>
          <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#475569', lineHeight: 1.6 }}>{notification.content}</pre>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: notification.id },
                { label: 'Name', value: notification.name },
                { label: 'Type', value: notification.type },
                { label: 'Subject', value: notification.subject || '-' },
                { label: 'Variables', value: notification.variables ? JSON.stringify(notification.variables) : '-' },
                { label: 'Tenant ID', value: notification.tenantId },
                { label: 'Created At', value: new Date(notification.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(notification.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '200px' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
