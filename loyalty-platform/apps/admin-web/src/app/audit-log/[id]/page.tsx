'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function AuditLogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setLog(data);
    } catch { showToast('Failed to load audit log', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const actionColors: Record<string, { bg: string; color: string }> = {
    CREATE: { bg: '#dcfce7', color: '#16a34a' },
    UPDATE: { bg: '#e0e7ff', color: '#4f46e5' },
    DELETE: { bg: '#fef2f2', color: '#dc2626' },
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!log) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Audit log not found</p></main></div>;

  const ac = actionColors[log.action] || { bg: '#f1f5f9', color: '#64748b' };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
          Audit Log Detail
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Log ID: {log.id}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Entity', value: log.entityType, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Action', value: log.action, color: ac.color, bg: ac.bg },
            { label: 'User', value: log.userEmail || 'System', color: '#475569', bg: '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Changes</h2>
          {log.oldValue && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>Old Value</h3>
              <pre style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(typeof log.oldValue === 'object' ? log.oldValue : JSON.parse(log.oldValue || '{}'), null, 2)}
              </pre>
            </div>
          )}
          {log.newValue && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', marginBottom: '8px' }}>New Value</h3>
              <pre style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(typeof log.newValue === 'object' ? log.newValue : JSON.parse(log.newValue || '{}'), null, 2)}
              </pre>
            </div>
          )}
          {!log.oldValue && !log.newValue && (
            <p style={{ color: '#94a3b8' }}>No change data available</p>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Metadata</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: log.id },
                { label: 'Entity Type', value: log.entityType },
                { label: 'Entity ID', value: log.entityId },
                { label: 'Action', value: log.action },
                { label: 'User ID', value: log.userId || '-' },
                { label: 'User Email', value: log.userEmail || '-' },
                { label: 'IP Address', value: log.ipAddress || '-' },
                { label: 'Timestamp', value: new Date(log.createdAt).toLocaleString() },
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
