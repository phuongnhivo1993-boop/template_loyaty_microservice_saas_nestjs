'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getRewards, redeemReward } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

const typeOptions = ['All', 'product', 'discount', 'shipping', 'gift'];

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const loadData = () => {
    setError('');
    getRewards()
      .then((res: any) => setRewards(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    let items = rewards;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(r => (r.name || '').toLowerCase().includes(q));
    }
    if (typeFilter !== 'All') {
      items = items.filter(r => r.type === typeFilter);
    }
    return items;
  }, [rewards, search, typeFilter]);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">🎁 Rewards Catalog</div>
          <div className="header-subtitle">{filtered.length} reward{filtered.length !== 1 ? 's' : ''} available</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search rewards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '8px' }}
      />

      <div className="tab-bar" style={{ overflowX: 'auto', flexWrap: 'wrap', marginBottom: '12px' }}>
        {typeOptions.map(t => (
          <button key={t} className={`tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <div className="empty-text">{search || typeFilter !== 'All' ? 'No rewards match your filters' : 'No rewards available'}</div>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map((r: any) => (
            <div
              key={r.id}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--primary)' }}
              onClick={() => router.push(`/rewards/${r.id}`)}
            >
              <div style={{ height: 100, background: 'var(--bg-secondary, #f1f5f9)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '12px' }}>
                {r.imageUrl ? <img src={r.imageUrl} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : '🎁'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span className="badge" style={{ background: 'var(--badge-bg, #f5f3ff)', color: 'var(--badge-color, #7c3aed)' }}>{r.type}</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>🪙 {r.pointsRequired?.toLocaleString()}</span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirm(`Redeem ${r.name} for ${r.pointsRequired?.toLocaleString()} points?`)) return;
                    redeemReward(r.id).then(() => { alert('Reward redeemed!'); loadData(); }).catch((err: any) => alert(err.message));
                  }}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
