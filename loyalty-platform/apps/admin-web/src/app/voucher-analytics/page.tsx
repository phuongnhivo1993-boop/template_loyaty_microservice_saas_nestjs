'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';

export default function VoucherAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch('/api/analytics/voucher-analytics?days=30', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(res => setData(res.data ?? res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;

  const maxTrend = data?.dailyTrend?.length ? Math.max(...data.dailyTrend.map((d: any) => d.count), 1) : 1;
  const maxPopular = data?.popular?.length ? Math.max(...data.popular.map((d: any) => d.count), 1) : 1;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Voucher Analytics" subtitle="Redemption trends, popular vouchers & type distribution" />

        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Redemptions (30d)', value: String(data?.totalRedemptions ?? 0), color: '#3b82f6', icon: '🎟️' },
            { label: 'Daily Avg', value: data?.dailyTrend?.length ? (data.totalRedemptions / data.dailyTrend.length).toFixed(1) : '0', color: '#10b981', icon: '📊' },
            { label: 'Unique Vouchers Used', value: String(data?.popular?.length ?? 0), color: '#8b5cf6', icon: '🎫' },
            { label: 'Types', value: String(data?.byType?.length ?? 0), color: '#f59e0b', icon: '🏷️' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {data?.dailyTrend && data.dailyTrend.length > 0 && (
            <div className="card">
              <h2 className="card-title">Daily Redemption Trend (30 days)</h2>
              <div className="chart-bars">
                {data.dailyTrend.map((p: any, i: number) => (
                  <div key={i} className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${Math.max(4, (p.count || 0) / maxTrend * 120)}px`, background: '#3b82f6' }} />
                  </div>
                ))}
              </div>
              <div className="chart-legend"><span style={{ color: '#3b82f6' }}>■</span> Redemptions</div>
            </div>
          )}

          {data?.byType && data.byType.length > 0 && (
            <div className="card">
              <h2 className="card-title">By Voucher Type</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
                {data.byType.map((t: any) => (
                  <div key={t.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>{t.type}</span>
                      <span style={{ color: '#64748b' }}>{t.count}</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(t.count / data.totalRedemptions) * 100}%`, background: '#8b5cf6', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {data?.popular && data.popular.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <h2 className="card-title">Most Redeemed Vouchers</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Rank</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Code</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Value</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Redemptions</th>
                </tr>
              </thead>
              <tbody>
                {data.popular.map((v: any, i: number) => (
                  <tr key={v.code} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: i < 3 ? '#f59e0b' : '#64748b' }}>#{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '14px' }}>{v.code}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>{v.value?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span className="status-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>{v.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
