'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getRewards, redeemReward } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { showToast } from '@/components/Toast';

const typeOptions = ['All', 'product', 'discount', 'shipping', 'gift'];

export default function RewardsPage() {
  const { t } = useTranslation();
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
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>{t('common.retry')}</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">{t('rewards.rewardsCatalog')}</div>
          <div className="header-subtitle">{filtered.length} {t('rewards.rewardsCatalog').toLowerCase()}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder={t('rewards.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '8px' }}
      />

      <div className="tab-bar" style={{ overflowX: 'auto', flexWrap: 'wrap', marginBottom: '12px' }}>
        {typeOptions.map(opt => (
          <button key={opt} className={`tab ${typeFilter === opt ? 'active' : ''}`} onClick={() => setTypeFilter(opt)}>
            {opt === 'All' ? t('common.all') : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🎁" title={search || typeFilter !== 'All' ? t('rewards.noRewardsMatch') : t('rewards.noRewards')} action={{ label: t('rewards.checkBackLater'), onClick: () => {} }} />
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
                    if (typeof window !== 'undefined' && !window.confirm(`${t('rewards.redeem')} ${r.name} ${t('common.for')} ${r.pointsRequired?.toLocaleString()} ${t('common.points')}?`)) return;
                    redeemReward(r.id).then(() => { showToast(t('rewards.redeem') + '!', 'success'); loadData(); }).catch((err: any) => showToast(err.message, 'error'));
                  }}
                >
                  {t('rewards.redeem')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
