'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getTierProgress } from '@/lib/api';

export default function TierProgressPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getTierProgress()
      .then(setData)
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  if (loading) {
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">🏆 Tier Progress</div>
          <div className="header-subtitle">Track your membership tier journey</div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Tier</div>
        <div style={{
          fontSize: '22px', fontWeight: 700, color: data?.currentTier?.color || '#64748b',
        }}>{data?.currentTier?.name || 'Member'}</div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span>Progress to {data?.nextTier?.name || 'Max'}</span>
          <span style={{ fontWeight: 600 }}>{data?.progress || 100}%</span>
        </div>
        <div style={{
          height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${data?.progress || 0}%`, background: 'linear-gradient(90deg, #7c3aed, #2563eb)',
            borderRadius: '6px', transition: 'width 0.5s ease',
          }} />
        </div>
        {data?.nextTier ? (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            {data.pointsToNext.toLocaleString()} more points to reach <span style={{ color: data.nextTier.color, fontWeight: 600 }}>{data.nextTier.name}</span>
          </div>
        ) : (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: 'var(--success)' }}>
            You've reached the highest tier!
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>Points</div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
          {data?.currentPoints?.toLocaleString() || 0}
        </div>
        <div className="text-muted" style={{ fontSize: '13px' }}>Available Points</div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>All Tiers</div>
        {data?.allTiers?.map((tier: any) => {
          const isCurrent = data?.currentTier?.id === tier.id;
          const isReached = data?.allTiers?.findIndex((t: any) => t.id === tier.id) <= data?.allTiers?.findIndex((t: any) => t.id === data?.currentTier?.id);
          return (
            <div key={tier.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', marginBottom: '8px', borderRadius: '8px',
              background: isCurrent ? `${tier.color}10` : '#f8fafc',
              border: isCurrent ? `1px solid ${tier.color}40` : '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: `${tier.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>{isReached ? '⭐' : '🔒'}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: tier.color }}>{tier.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tier.minPoints.toLocaleString()} points</div>
                </div>
              </div>
              {isCurrent && <span className="badge" style={{ background: `${tier.color}20`, color: tier.color }}>Current</span>}
            </div>
          );
        })}
      </div>
    </MemberLayout>
  );
}
