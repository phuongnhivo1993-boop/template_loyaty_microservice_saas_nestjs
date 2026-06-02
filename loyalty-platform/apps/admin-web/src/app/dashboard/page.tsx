'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsTrend, setPointsTrend] = useState<any[]>([]);
  const [memberGrowth, setMemberGrowth] = useState<any[]>([]);
  const [topMembers, setTopMembers] = useState<any[]>([]);
  const [voucherStats, setVoucherStats] = useState<any>(null);
  const [expiringPoints, setExpiringPoints] = useState<any[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }

    Promise.all([
      fetch('/api/dashboard', { headers }).then(r => r.json()),
      fetch('/api/analytics/points-trend?days=14', { headers }).then(r => r.json()),
      fetch('/api/analytics/member-growth?days=14', { headers }).then(r => r.json()),
      fetch('/api/analytics/top-members?limit=5', { headers }).then(r => r.json()),
      fetch('/api/analytics/voucher-stats', { headers }).then(r => r.json()),
      fetch('/api/analytics/expiring-points', { headers }).then(r => r.json()),
    ])
      .then(([dashRes, trendRes, growthRes, topRes, vStatsRes, expiringRes]) => {
        const data = dashRes.data ?? dashRes;
        const trend = trendRes.data ?? trendRes;
        const growth = growthRes.data ?? growthRes;
        const top = topRes.data ?? topRes;
        const vStats = vStatsRes.data ?? vStatsRes;
        const expiring = expiringRes.data ?? expiringRes;
        setStats(data);
        if (data.tiers) setTiers(data.tiers);
        if (Array.isArray(trend)) setPointsTrend(trend);
        if (Array.isArray(growth)) setMemberGrowth(growth);
        if (Array.isArray(top)) setTopMembers(top);
        if (vStats) setVoucherStats(vStats);
        if (Array.isArray(expiring)) setExpiringPoints(expiring);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxTrend = Math.max(1, ...pointsTrend.map((p: any) => p.earned || 0));
  const maxGrowth = Math.max(1, ...memberGrowth.map((g: any) => g.totalMembers || 0));
  const statusColors: Record<string, string> = { ACTIVE: '#16a34a', INACTIVE: '#94a3b8', LOCKED: '#dc2626', PENDING_KYC: '#f59e0b' };

  const statCards = [
    { label: 'Total Members', value: String(stats.members || '--'), color: '#3b82f6', icon: '👥' },
    { label: 'Active Tenants', value: String(stats.tenants || '--'), color: '#10b981', icon: '🏢' },
    { label: 'Campaigns Running', value: String(stats.activeCampaigns || '--'), color: '#f59e0b', icon: '📢' },
    { label: 'Total Points', value: (stats.totalPoints || 0).toLocaleString(), color: '#8b5cf6', icon: '⭐' },
    { label: 'Vouchers', value: String(stats.vouchers || '--'), color: '#ec4899', icon: '🎟️' },
    { label: 'Active Vouchers', value: String(stats.activeVouchers || '--'), color: '#06b6d4', icon: '✅' },
    { label: 'KYC Rate', value: `${stats.kycRate || 0}%`, color: '#f97316', icon: '🪪' },
    { label: 'Referrals', value: String(stats.referrals || '--'), color: '#6366f1', icon: '🔗' },
  ];

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <PageHeader title="Dashboard" subtitle="Welcome to Loyalty Platform Admin" />
          <div className="stats-grid">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
          <div className="grid-2" style={{ marginTop: '24px' }}>
            <div className="skeleton-card" style={{ height: '200px' }} />
            <div className="skeleton-card" style={{ height: '200px' }} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Dashboard" subtitle="Welcome to Loyalty Platform Admin" />

        <div className="stats-grid">
          {statCards.map((stat) => (
            <div key={stat.label} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {stats.today && (
          <div className="today-metrics" style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
            {[
              { label: 'Earned Today', value: stats.today.earned?.toLocaleString(), color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Burned Today', value: stats.today.burned?.toLocaleString(), color: '#dc2626', bg: '#fef2f2' },
              { label: 'New Members Today', value: String(stats.today.newMembers || 0), color: '#2563eb', bg: '#eff6ff' },
              { label: 'Redemptions Today', value: String(stats.today.redemptions || 0), color: '#d97706', bg: '#fffbeb' },
            ].map((m) => (
              <div key={m.label} style={{ flex: 1, background: m.bg, borderRadius: '10px', padding: '14px 18px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>{m.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: m.color }}>{m.value || 0}</div>
              </div>
            ))}
          </div>
        )}

        <div className="charts-grid">
          {pointsTrend.length > 0 && (
            <div className="card">
              <h2 className="card-title">Points Trend (14 days)</h2>
              <div className="chart-bars">
                {pointsTrend.map((p: any, i: number) => (
                  <div key={i} className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${Math.max(4, (p.earned || 0) / maxTrend * 100)}px`, background: '#3b82f6' }} />
                    <div className="chart-bar" style={{ height: `${Math.max(2, (p.burned || 0) / maxTrend * 60)}px`, background: '#ef4444' }} />
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span><span style={{ color: '#3b82f6' }}>■</span> Earned</span>
                <span><span style={{ color: '#ef4444' }}>■</span> Burned</span>
              </div>
            </div>
          )}

          {memberGrowth.length > 0 && (
            <div className="card">
              <h2 className="card-title">Member Growth (14 days)</h2>
              <div className="chart-bars">
                {memberGrowth.map((g: any, i: number) => (
                  <div key={i} className="chart-bar-group">
                    <div className="chart-bar" style={{ height: `${Math.max(4, (g.totalMembers || 0) / maxGrowth * 100)}px`, background: '#10b981' }} />
                  </div>
                ))}
              </div>
              <div className="chart-legend"><span style={{ color: '#10b981' }}>■</span> Total Members</div>
            </div>
          )}
        </div>

        {stats.membersByStatus && Object.keys(stats.membersByStatus).length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <h2 className="card-title">Member Status Distribution</h2>
            <div className="status-distribution">
              {Object.entries(stats.membersByStatus).map(([status, count]) => (
                <div key={status} className="status-box" style={{ borderColor: statusColors[status] || '#e2e8f0', background: (statusColors[status] || '#f1f5f9') + '18' }}>
                  <div className="status-count" style={{ color: statusColors[status] || '#475569' }}>{String(count)}</div>
                  <div className="status-label">{status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="charts-grid" style={{ marginTop: '24px' }}>
          {topMembers.length > 0 && (
            <div className="card">
              <h2 className="card-title">Top Members</h2>
              {topMembers.slice(0, 5).map((m: any, i: number) => (
                <div key={m.id} className="top-member-row">
                  <div className="top-member-rank">{i + 1}</div>
                  <div className="top-member-info">
                    <div className="font-medium">{m.fullName}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{m.email}</div>
                  </div>
                  <div className="top-member-points">
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '16px' }}>{m.totalPoints?.toLocaleString()}</div>
                    {m.tier && <div style={{ fontSize: '11px', color: m.tier.color || '#64748b' }}>{m.tier.name}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {voucherStats && (
            <div className="card">
              <h2 className="card-title">Voucher Usage</h2>
              <div className="voucher-stats-container">
                <div className="donut-chart">
                  <div className="donut-ring" style={{ background: `conic-gradient(#3b82f6 0deg ${(voucherStats.usageRate || 0) * 3.6}deg, #f1f5f9 ${(voucherStats.usageRate || 0) * 3.6}deg 360deg)` }} />
                  <div className="donut-center">
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{voucherStats.usageRate || 0}%</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>used</span>
                  </div>
                </div>
                <div className="voucher-numbers">
                  <div><span className="text-muted">Total</span><span className="font-medium" style={{ fontSize: '22px' }}>{voucherStats.total || 0}</span></div>
                  <div><span className="text-muted">Used</span><span style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626' }}>{voucherStats.used || 0}</span></div>
                  <div><span className="text-muted">Remaining</span><span style={{ fontSize: '22px', fontWeight: 700, color: '#16a34a' }}>{voucherStats.remaining || 0}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {tiers.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <h2 className="card-title">Members by Tier</h2>
            <div className="status-distribution">
              {tiers.map((t: any) => (
                <div key={t.name} className="status-box" style={{ borderColor: t.color || '#e2e8f0', background: t.color ? t.color + '18' : '#f8fafc' }}>
                  <div className="status-count" style={{ color: t.color || '#475569' }}>{t.memberCount}</div>
                  <div className="status-label">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expiringPoints.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <h2 className="card-title" style={{ color: '#d97706' }}>⚠️ Points Nearing Expiry</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Member</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Available Points</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Oldest Earn</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Days Ago</th>
                </tr>
              </thead>
              <tbody>
                {expiringPoints.map((m: any) => (
                  <tr key={m.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <a href={`/members/${m.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{m.fullName}</a>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#d97706' }}>{m.availablePoints?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '14px' }}>{m.oldestEarnDate ? new Date(m.oldestEarnDate).toLocaleDateString('vi-VN') : '-'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>
                        {m.daysSinceOldestEarn}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card" style={{ marginTop: '24px' }}>
          <h2 className="card-title">Quick Actions</h2>
          <div className="quick-actions">
            {[
              { label: 'Manage Tenants', href: '/tenants', color: '#3b82f6' },
              { label: 'View Members', href: '/members', color: '#10b981' },
              { label: 'Campaigns', href: '/campaigns', color: '#f59e0b' },
              { label: 'Rewards Catalog', href: '/rewards', color: '#8b5cf6' },
              { label: 'Vouchers', href: '/vouchers', color: '#ec4899' },
              { label: 'Promotions', href: '/promotions', color: '#06b6d4' },
              { label: 'Notifications', href: '/notifications', color: '#f97316' },
              { label: 'Audit Log', href: '/audit-log', color: '#6366f1' },
            ].map((action) => (
              <button key={action.label} onClick={() => router.push(action.href)} className="quick-action-btn" style={{ background: action.color }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
