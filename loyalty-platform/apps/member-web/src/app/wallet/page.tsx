'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import MemberLayout from '../member-layout';
import { getWallet, getTransactions } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const PAGE_SIZE = 10;

const typeFilters = ['All', 'Earned', 'Burned'] as const;
const typeFilterLabels: Record<string, string> = { All: 'wallet.all', Earned: 'wallet.earned', Burned: 'wallet.burned' };
type TypeFilter = (typeof typeFilters)[number];

export default function WalletPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [page, setPage] = useState(1);

  const loadData = () => {
    setError('');
    Promise.all([
      getWallet().then(setWallet).catch((e) => setError(e?.message || 'Failed to load data')),
      getTransactions({ limit: 50 }).then((res: any) => setTxs(res?.data || res || [])).catch((e) => setError(e?.message || 'Failed to load data')),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const filtered = useMemo(() => {
    let result = txs;
    if (typeFilter === 'Earned') result = result.filter(tx => tx.amount > 0);
    else if (typeFilter === 'Burned') result = result.filter(tx => tx.amount < 0);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(tx => (tx.reason || tx.type || '').toLowerCase().includes(q));
    }
    return result;
  }, [txs, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTypeFilter = (f: TypeFilter) => {
    setTypeFilter(f);
    setPage(1);
  };

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
          <div className="header-title">{t('wallet.title')}</div>
          <div className="header-subtitle">{t('wallet.balance')} & {t('wallet.transactions')}</div>
        </div>
      </div>

      <div className="card points-display">
        <div className="points-value">{(wallet?.availablePoints ?? 0).toLocaleString()}</div>
        <div className="points-label">{t('wallet.availableBalance')}</div>
      </div>

      <div className="grid-2">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{(wallet?.totalEarned ?? 0).toLocaleString()}</div>
          <div className="stat-label">{t('wallet.totalEarned')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--error)' }}>{(wallet?.totalBurned ?? 0).toLocaleString()}</div>
          <div className="stat-label">{t('wallet.totalUsed')}</div>
        </div>
      </div>

      <div className="tab-bar">
        {typeFilters.map(f => (
          <button key={f} className={`tab ${typeFilter === f ? 'active' : ''}`} onClick={() => handleTypeFilter(f)}>
            {t(typeFilterLabels[f])}
          </button>
        ))}
      </div>

      <input type="text" placeholder={t('wallet.search')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ marginBottom: '12px' }} />

      <div className="card" style={{ fontWeight: 600, marginBottom: '12px' }}>{t('wallet.recentTransactions')}</div>
      {filtered.length === 0 ? (
        <EmptyState icon="📭" title={t('wallet.noTransactions')} action={{ label: t('wallet.earnFirstPoints'), onClick: () => router.push('/rewards') }} />
      ) : (
        <>
          <div className="card" style={{ padding: '0 20px' }}>
            {paginated.map((tx: any) => (
              <div key={tx.id} className="tx-item" style={{ cursor: 'pointer' }} onClick={() => router.push(`/transactions/${tx.id}`)}>
                <div className="tx-left">
                  <div className="tx-reason">{tx.reason || tx.type}</div>
                  <div className="tx-date">{formatDate(tx.createdAt)}</div>
                </div>
                <div className={`tx-amount ${tx.amount > 0 ? 'tx-earn' : 'tx-burn'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                className="btn btn-sm btn-outline"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{ width: 'auto', opacity: page <= 1 ? 0.5 : 1 }}
              >
                {t('wallet.previous')}
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                style={{ width: 'auto', opacity: page >= totalPages ? 0.5 : 1 }}
              >
                {t('wallet.next')}
              </button>
            </div>
          )}
        </>
      )}
    </MemberLayout>
  );
}
