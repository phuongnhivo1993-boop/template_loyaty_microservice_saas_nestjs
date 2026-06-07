'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MemberLayout from '@/app/member-layout';
import { getTransaction } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getTransaction(params.id as string)
      .then((res: any) => setTx(res?.data || res))
      .catch((e) => setError(e?.message || 'Failed to load transaction'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  if (error) {
    return (
      <MemberLayout>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </MemberLayout>
    );
  }

  const isEarn = (tx?.amount ?? 0) > 0;

  return (
    <MemberLayout>
      <div className="header">
        <div>
          <div className="header-title">💳 Transaction Details</div>
          <div className="header-subtitle">{tx.reason || tx.type || 'Transaction'}</div>
        </div>
        <button className="btn btn-outline" onClick={() => router.push('/wallet')}>Back</button>
      </div>

      <div className="card" style={{ textAlign: 'center', borderLeft: `4px solid ${isEarn ? 'var(--success)' : 'var(--error)'}` }}>
        <div className={`tx-amount`} style={{
          fontSize: '36px', fontWeight: 700,
          color: isEarn ? 'var(--success)' : 'var(--error)',
          marginBottom: '8px',
        }}>
          {isEarn ? '+' : ''}{tx.amount?.toLocaleString()}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {isEarn ? 'Points Earned' : 'Points Used'}
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '16px' }}>Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Type</span>
            <span style={{ fontWeight: 500 }}>{tx.type || (isEarn ? 'EARN' : 'BURN')}</span>
          </div>
          {tx.balance != null && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Balance After</span>
              <span style={{ fontWeight: 500 }}>{tx.balance?.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reason</span>
            <span style={{ fontWeight: 500 }}>{tx.reason || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Date</span>
            <span style={{ fontWeight: 500 }}>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
          </div>
          {tx.reference && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Reference</span>
              <span style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '13px' }}>{tx.reference}</span>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
