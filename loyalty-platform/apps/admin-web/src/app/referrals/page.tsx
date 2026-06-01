'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/referrals?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setReferrals(Array.isArray(result) ? result : result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch {}
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const res = await fetch('/api/referrals/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    loadStats();
  }, [search, page]);

  const handleConvert = async (id: string) => {
    if (!confirm('Convert this referral?')) return;
    setConverting(id);
    try {
      await fetch(`/api/referrals/${id}/convert`, { method: 'POST', headers });
      load();
      loadStats();
    } catch {}
    setConverting(null);
  };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  const statCards = stats ? [
    { label: 'Total Referrals', value: stats.totalReferrals ?? stats.total ?? 0 },
    { label: 'Converted', value: stats.convertedReferrals ?? stats.converted ?? 0 },
    { label: 'Pending', value: stats.pendingReferrals ?? stats.pending ?? 0 },
    { label: 'Conversion Rate', value: stats.conversionRate ? `${stats.conversionRate}%` : '0%' },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Referrals</h1>
            <p style={{ color: '#64748b' }}>Monitor and manage member referrals</p>
          </div>
        </div>

        {statCards.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {statCards.map(s => (
              <div key={s.label} style={{
                flex: 1, background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 6px 0' }}>{s.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: 1, maxWidth: '360px' }}
          />
          <span style={{ color: '#64748b', fontSize: '14px' }}>{total > 0 ? `${total} results` : ''}</span>
          <button onClick={async () => {
            const params = new URLSearchParams({ page: '1', limit: '10000' });
            if (search) params.set('search', search);
            const res = await fetch(`/api/referrals?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const result = await res.json();
            const data = Array.isArray(result) ? result : result.data || [];
            const cols = ['code', 'status', 'createdAt'];
            const header = cols.join(',');
            const rows = data.map((item: any) => cols.map((col: string) => { const v = item[col]?.toString() || ''; return v.includes(',') ? `"${v}"` : v; }).join(','));
            const csv = [header, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'referrals.csv'; a.click(); URL.revokeObjectURL(url);
          }} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Export CSV</button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Code</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Referrer</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Referee</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Created</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No referrals found</td></tr>
              ) : referrals.map((r: any) => (
                <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, fontFamily: 'monospace' }}>{r.code}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.referrer?.fullName || r.referrer?.email || r.referrerId || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.referee?.fullName || r.referee?.email || r.refereeId || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: r.status === 'CONVERTED' ? '#dcfce7' : r.status === 'PENDING' ? '#fef9c3' : '#f1f5f9',
                      color: r.status === 'CONVERTED' ? '#16a34a' : r.status === 'PENDING' ? '#a16207' : '#64748b',
                    }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.status !== 'CONVERTED' && (
                      <button onClick={() => handleConvert(r.id)} disabled={converting === r.id}
                        style={{
                          padding: '6px 14px', border: '1px solid #86efac', borderRadius: '6px',
                          background: converting === r.id ? '#f0fdf4' : '#f0fdf4',
                          color: '#16a34a', cursor: converting === r.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 500,
                        }}>
                        {converting === r.id ? 'Converting...' : 'Convert'}
                      </button>
                    )}
                  </td>
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
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', background: p === page ? '#2563eb' : 'white', color: p === page ? 'white' : '#475569', cursor: 'pointer', fontWeight: 600 }}>{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: page >= totalPages ? '#f1f5f9' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#94a3b8' : '#475569', fontWeight: 500 }}>Next</button>
          </div>
        )}
      </main>
    </div>
  );
}
