'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getWallet, getTransactions } from '@/lib/api';

const PAGE_SIZE = 10;

const typeFilters = ['All', 'Earned', 'Burned'] as const;
type TypeFilter = (typeof typeFilters)[number];

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (typeFilter === 'All') return txs;
    if (typeFilter === 'Earned') return txs.filter(tx => tx.amount > 0);
    return txs.filter(tx => tx.amount < 0);
  }, [txs, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTypeFilter = (f: TypeFilter) => {
    setTypeFilter(f);
    setPage(1);
  };

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
          <div className="header-title">💰 Wallet</div>
          <div className="header-subtitle">Points & transaction history</div>
        </div>
      </div>

      <div className="card points-display">
        <div className="points-value">{(wallet?.availablePoints ?? 0).toLocaleString()}</div>
        <div className="points-label">Available Balance</div>
      </div>

      <div className="grid-2">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{(wallet?.totalEarned ?? 0).toLocaleString()}</div>
          <div className="stat-label">Total Earned</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--error)' }}>{(wallet?.totalBurned ?? 0).toLocaleString()}</div>
          <div className="stat-label">Total Used</div>
        </div>
      </div>

      <div className="tab-bar">
        {typeFilters.map(f => (
          <button key={f} className={`tab ${typeFilter === f ? 'active' : ''}`} onClick={() => handleTypeFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="card" style={{ fontWeight: 600, marginBottom: '12px' }}>Recent Transactions</div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No transactions yet</div>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: '0 20px' }}>
            {paginated.map((tx: any) => (
              <div key={tx.id} className="tx-item">
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
                Previous
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
                Next
              </button>
            </div>
          )}
        </>
      )}
    </MemberLayout>
  );
}
