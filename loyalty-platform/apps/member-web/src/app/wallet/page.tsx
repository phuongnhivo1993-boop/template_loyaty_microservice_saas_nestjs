'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getWallet, getTransactions } from '@/lib/api';

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    Promise.all([
      getWallet().then(setWallet).catch(() => {}),
      getTransactions({ limit: 50 }).then((res: any) => setTxs(res?.data || res || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  return (
    <MemberLayout>
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

      <div className="card" style={{ fontWeight: 600, marginBottom: '12px' }}>Recent Transactions</div>
      {txs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No transactions yet</div>
        </div>
      ) : (
        <div className="card" style={{ padding: '0 20px' }}>
          {txs.map((tx: any) => (
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
      )}
    </MemberLayout>
  );
}
