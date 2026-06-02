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
    ])
      .then(([data, trend, growth, top, vStats]) => {
        setStats(data);
        if (data.tiers) setTiers(data.tiers);
        if (Array.isArray(trend)) setPointsTrend(trend);
        if (Array.isArray(growth)) setMemberGrowth(growth);
        if (Array.isArray(top)) setTopMembers(top);
        if (vStats) setVoucherStats(vStats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxTrend = Math.max(1, ...pointsTrend.map((p: any) => p.earned || 0));
  const maxGrowth = Math.max(1, ...memberGrowth.map((g: any) => g.totalMembers || 0));
  const statusColors: Record<string, string> = { ACTIVE: '#16a34a', INACTIVE: '#94a3b8', LOCKED: '#dc2626', PENDING_KYC: '#f59e0b' };

  const statCards = [
    { label: 'Total Members', value: String(stats.members || '--'), icon: '👥' },
    { label: 'Active Tenants', value: String(stats.tenants || '--'), icon: '🏢' },
    { label: 'Campaigns Running', value: String(stats.activeCampaigns || '--'), icon: '📢' },
    { label: 'Total Rewards', value: String(stats.rewards || '--'), icon: '🎁' },
    { label: 'Vouchers', value: String(stats.vouchers || '--'), icon: '🎟️' },
    { label: 'Active Vouchers', value: String(stats.activeVouchers || '--'), icon: '✅' },
    { label: 'Total Points', value: (stats.totalPoints || 0).toLocaleString(), icon: '⭐' },
    { label: 'KYC Rate', value: `${stats.kycRate || 0}%`, icon: '🪪' },
    { label: 'Promotions', value: String(stats.promotions || '--'), icon: '⚡' },
    { label: 'Badges', value: String(stats.badges || '--'), icon: '🏅' },
    { label: 'Missions', value: String(stats.missions || '--'), icon: '🎯' },
    { label: 'Referrals', value: String(stats.referrals || '--'), icon: '🔗' },
  ];

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <PageHeader title="Dashboard" subtitle="Welcome to Loyalty Platform Admin" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '28px' }}>{stat.icon}</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>{stat.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '2px' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {pointsTrend.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Points Trend (14 days)</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {pointsTrend.map((p: any, i: number) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '100%', height: `${Math.max(4, (p.earned || 0) / maxTrend * 100)}px`, background: '#3b82f6', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                    <div style={{ width: '100%', height: `${Math.max(2, (p.burned || 0) / maxTrend * 60)}px`, background: '#ef4444', borderRadius: '4px 4px 0 0', minHeight: '2px' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                <span><span style={{ color: '#3b82f6' }}>■</span> Earned</span>
                <span><span style={{ color: '#ef4444' }}>■</span> Burned</span>
              </div>
            </div>
          )}

          {memberGrowth.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Member Growth (14 days)</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {memberGrowth.map((g: any, i: number) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${Math.max(4, (g.totalMembers || 0) / maxGrowth * 100)}px`, background: '#10b981', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}><span style={{ color: '#10b981' }}>■</span> Total Members</div>
            </div>
          )}
        </div>

        {stats.membersByStatus && Object.keys(stats.membersByStatus).length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Member Status Distribution</h2>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {Object.entries(stats.membersByStatus).map(([status, count]) => (
                <div key={status} style={{ padding: '16px', borderRadius: '8px', background: (statusColors[status] || '#f1f5f9') + '18', border: `1px solid ${statusColors[status] || '#e2e8f0'}`, minWidth: '120px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: statusColors[status] || '#475569' }}>{String(count)}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {topMembers.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Top Members</h2>
              <div>
                {topMembers.slice(0, 5).map((m: any, i: number) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>{m.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{m.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '16px' }}>{m.totalPoints?.toLocaleString()}</div>
                      {m.tier && <div style={{ fontSize: '11px', color: m.tier.color || '#64748b' }}>{m.tier.name}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {voucherStats && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Voucher Usage</h2>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#3b82f6 0% ${voucherStats.usageRate || 0}%, #f1f5f9 ${voucherStats.usageRate || 0}% 100%)` }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{voucherStats.usageRate || 0}%</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>used</span>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '12px' }}><div style={{ fontSize: '13px', color: '#64748b' }}>Total</div><div style={{ fontSize: '22px', fontWeight: 700 }}>{voucherStats.total || 0}</div></div>
                  <div style={{ marginBottom: '12px' }}><div style={{ fontSize: '13px', color: '#64748b' }}>Used</div><div style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626' }}>{voucherStats.used || 0}</div></div>
                  <div><div style={{ fontSize: '13px', color: '#64748b' }}>Remaining</div><div style={{ fontSize: '22px', fontWeight: 700, color: '#16a34a' }}>{voucherStats.remaining || 0}</div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {tiers.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Members by Tier</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {tiers.map((t: any) => (
                <div key={t.name} style={{ padding: '16px', borderRadius: '8px', background: t.color ? t.color + '18' : '#f8fafc', border: `1px solid ${t.color || '#e2e8f0'}`, minWidth: '140px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: t.color || '#475569' }}>{t.memberCount}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              <button key={action.label} onClick={() => router.push(action.href)} style={{ padding: '10px 20px', background: action.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
