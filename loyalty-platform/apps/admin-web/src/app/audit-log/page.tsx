'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AuditLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    const r = await fetch(`/api/audit-logs?${params}`, { headers });
    const res = await r.json();
    setLogs(Array.isArray(res) ? res : res.data || []);
    setTotalPages(res.totalPages || 1);
    setTotal(res.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [search, page]);

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Audit Log</h1>
          <p style={{ color: '#64748b' }}>Track all changes made in the system</p>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search by entity type or user email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '420px' }} />
          {total > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>{total} results</span>}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Entity</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Action</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>User</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Entity ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No audit logs found</td></tr>
              ) : logs.map((l: any) => (
                <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>{new Date(l.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{l.entityType}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: l.action === 'CREATE' ? '#dcfce7' : l.action === 'DELETE' ? '#fef2f2' : '#e0e7ff',
                      color: l.action === 'CREATE' ? '#16a34a' : l.action === 'DELETE' ? '#dc2626' : '#4f46e5',
                    }}>{l.action}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{l.userEmail || '-'}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>{l.entityId?.slice(0, 12)}...</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>{l.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </main>
    </div>
  );
}
