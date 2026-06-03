'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import PageHeader from '@/components/PageHeader';

export default function CheckinAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch('/api/checkin/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(res => setData(res.data ?? res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Check-in Analytics" subtitle="Daily check-in engagement & member streaks" />

        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Checked In Today', value: String(data?.checkedInToday ?? 0), color: '#16a34a', icon: '📅' },
            { label: 'This Month', value: String(data?.totalThisMonth ?? 0), color: '#2563eb', icon: '📊' },
            { label: 'Active Streaks (7+ days)', value: String(data?.activeStreaks ?? 0), color: '#f59e0b', icon: '🔥' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {data?.topStreaks && data.topStreaks.length > 0 && (
            <div className="card">
              <h2 className="card-title">🔥 Top Streaks</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Member</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Streak</th>
                    <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Last Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topStreaks.map((s: any) => (
                    <tr key={s.memberId} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.email}</div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span className="status-badge" style={{ background: '#fef3c7', color: '#d97706' }}>{s.streak} days</span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                        {new Date(s.lastCheckin).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data?.recentActivity && data.recentActivity.length > 0 && (
            <div className="card">
              <h2 className="card-title">Recent Check-in Activity</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Member</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Streak</th>
                    <th style={{ textAlign: 'center', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Points</th>
                    <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentActivity.map((r: any) => (
                    <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.fullName}</div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600 }}>{r.streak}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>+{r.pointsAwarded}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                        {new Date(r.date).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(!data?.topStreaks?.length && !data?.recentActivity?.length) && (
          <div className="card" style={{ marginTop: '24px', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>No check-in data yet. Members need to check in first!</p>
          </div>
        )}
      </main>
    </div>
  );
}
