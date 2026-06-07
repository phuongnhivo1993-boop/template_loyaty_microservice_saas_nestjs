'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getMyCashback, getCashbackTransactions } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const typeFilters = ['All', 'Earned', 'Burned'] as const;
type TypeFilter = (typeof typeFilters)[number];

export default function CashbackPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [cashback, setCashback] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');

  const loadData = () => {
    setError('');
    Promise.all([
      getMyCashback().then(setCashback).catch(() => {}),
      getCashbackTransactions({ limit: 50 }).then((res: any) => setTxs(res?.data || res || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (typeFilter === 'All') return txs;
    if (typeFilter === 'Earned') return txs.filter(tx => tx.amount > 0);
    return txs.filter(tx => tx.amount < 0);
  }, [txs, typeFilter]);

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
          <div className="header-title">{t('cashback.title')}</div>
          <div className="header-subtitle">{t('cashback.cashbackBalance')} & {t('cashback.transactionHistory').toLowerCase()}</div>
        </div>
      </div>

      <div className="card points-display">
        <div className="points-value">{(cashback?.balance ?? 0).toLocaleString()} {cashback?.currency || 'VND'}</div>
        <div className="points-label">{t('cashback.cashbackBalance')}</div>
      </div>

      <div className="grid-2">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>+{(cashback?.totalEarned ?? 0).toLocaleString()}</div>
          <div className="stat-label">{t('cashback.totalEarned')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--error)' }}>-{(cashback?.totalBurned ?? 0).toLocaleString()}</div>
          <div className="stat-label">{t('cashback.totalUsed')}</div>
        </div>
      </div>

      <div className="tab-bar">
        {typeFilters.map(f => (
          <button key={f} className={`tab ${typeFilter === f ? 'active' : ''}`} onClick={() => setTypeFilter(f)}>
            {f === 'All' ? t('common.all') : f === 'Earned' ? t('cashback.earned') : t('cashback.burned')}
          </button>
        ))}
      </div>

      <div style={{ fontWeight: 600, marginBottom: '12px' }}>{t('cashback.transactionHistory')}</div>

      {filtered.length === 0 ? (
        <EmptyState icon="📭" title={t('cashback.noTransactions')} action={{ label: t('cashback.earnCashback'), onClick: () => {} }} />
      ) : (
        <div className="card" style={{ padding: '0 20px' }}>
          {filtered.map((tx: any) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-reason">{tx.reason || tx.type || tx.description}</div>
                <div className="tx-date">{new Date(tx.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className={`tx-amount ${tx.amount > 0 ? 'tx-earn' : 'tx-burn'}`}>
                {tx.amount > 0 ? '+' : ''}{(tx.amount ?? 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
