'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getMyGiftCards } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const statusColors: Record<string, string> = {
  ACTIVE: '#10b981',
  EXPIRED: '#ef4444',
  USED: '#64748b',
  PENDING: '#f59e0b',
};

export default function GiftCardsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadData = () => {
    setError('');
    getMyGiftCards()
      .then((res: any) => setCards(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(c =>
      (c.code || '').toLowerCase().includes(q) ||
      (c.status || '').toLowerCase().includes(q)
    );
  }, [cards, search]);

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
          <div className="header-title">{t('giftCards.title')}</div>
          <div className="header-subtitle">{filtered.length} {t('giftCards.title').toLowerCase()}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder={t('giftCards.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      {filtered.length === 0 ? (
        <EmptyState icon="🎴" title={search ? t('giftCards.noGiftCardsMatch') : t('giftCards.noGiftCardsYet')} action={{ label: t('giftCards.earnPointsToGet'), onClick: () => router.push('/wallet') }} />
      ) : (
        filtered.map((c: any) => (
          <div key={c.id} className="card" style={{ borderLeft: `4px solid ${statusColors[c.status] || '#94a3b8'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'monospace', letterSpacing: '2px' }}>{c.code}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {t('giftCards.initial')}: {c.initialValue?.toLocaleString()} {c.currency || 'VND'}
                </div>
              </div>
              <span className="badge" style={{
                background: `${statusColors[c.status] || '#94a3b8'}20`,
                color: statusColors[c.status] || '#64748b',
              }}>
                {c.status}
              </span>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary)' }}>
                  {(c.balance ?? c.remainingBalance ?? 0).toLocaleString()}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>{c.currency || 'VND'}</span>
              </div>
            </div>
            {c.expiryDate && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                {t('giftCards.expires')}: {new Date(c.expiryDate).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        ))
      )}
    </MemberLayout>
  );
}
