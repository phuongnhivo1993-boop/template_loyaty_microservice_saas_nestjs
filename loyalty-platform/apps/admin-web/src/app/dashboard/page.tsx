'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    Promise.all([
      fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([data]) => {
        setStats([
          { label: 'Total Members', value: String(data.members || '--'), icon: '👥' },
          { label: 'Active Tenants', value: String(data.tenants || '--'), icon: '🏢' },
          { label: 'Campaigns Running', value: String(data.activeCampaigns || '--'), icon: '📢' },
          { label: 'Total Rewards', value: String(data.rewards || '--'), icon: '🎁' },
          { label: 'Vouchers', value: String(data.vouchers || '--'), icon: '🎟️' },
          { label: 'Total Points', value: (data.totalPoints || 0).toLocaleString(), icon: '⭐' },
          { label: 'Promotions', value: String(data.promotions || '--'), icon: '⚡' },
          { label: 'Badges', value: String(data.badges || '--'), icon: '🏅' },
          { label: 'Referrals', value: String(data.referrals || '--'), icon: '🔗' },
        ]);
        if (data.tiers) setTiers(data.tiers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Welcome to Loyalty Platform Admin
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <div style={{ fontSize: '28px' }}>{stat.icon}</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px' }}>{stat.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '2px' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {tiers.length > 0 && (
          <div style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
              Members by Tier
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {tiers.map((t: any) => (
                <div key={t.name} style={{
                  padding: '16px', borderRadius: '8px',
                  background: t.color ? t.color + '18' : '#f8fafc',
                  border: `1px solid ${t.color || '#e2e8f0'}`,
                  minWidth: '140px',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: t.color || '#475569' }}>{t.memberCount}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Manage Tenants', href: '/tenants', color: '#3b82f6' },
              { label: 'View Members', href: '/members', color: '#10b981' },
              { label: 'Campaigns', href: '/campaigns', color: '#f59e0b' },
              { label: 'Rewards Catalog', href: '/rewards', color: '#8b5cf6' },
              { label: 'Vouchers', href: '/vouchers', color: '#ec4899' },
              { label: 'Promotions', href: '/promotions', color: '#06b6d4' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                style={{
                  padding: '10px 20px', background: action.color, color: 'white',
                  border: 'none', borderRadius: '8px', fontWeight: 500,
                  cursor: 'pointer', fontSize: '14px',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
