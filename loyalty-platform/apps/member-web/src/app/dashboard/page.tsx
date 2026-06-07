'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getProfile, getWallet, doCheckin, getCheckinStatus, getMissions, getTransactions } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [checkin, setCheckin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [error, setError] = useState('');
  const [missions, setMissions] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);

  const loadData = () => {
    setError('');
    Promise.all([
      getProfile().then(setProfile).catch(() => {}),
      getWallet().then(setWallet).catch(() => {}),
      getCheckinStatus().then(setCheckin).catch(() => {}),
      getMissions().then((res: any) => setMissions(res?.data || res || [])).catch(() => {}),
      getTransactions({ limit: 5 }).then((res: any) => setTxs(res?.data || res || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const handleCheckin = async () => {
    setCheckinLoading(true);
    try {
      const result = await doCheckin();
      setCheckin(result);
    } catch (e: any) { setError(e?.message || 'Check-in failed'); }
    setCheckinLoading(false);
  };

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
  }

  const canCheckin = checkin?.canCheckin ?? true;
  const streak = checkin?.currentStreak ?? 0;

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
          <div className="header-title">Hi, {profile?.fullName || 'Member'}! 👋</div>
          <div className="header-subtitle">{profile?.tier?.name || 'Member'} • {profile?.email}</div>
        </div>
      </div>

      <div className="card points-display">
        <div className="points-value">{(wallet?.availablePoints ?? profile?.availablePoints ?? 0).toLocaleString()}</div>
        <div className="points-label">Available Points</div>
      </div>

      <div className="grid-2">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{(wallet?.totalPoints ?? profile?.totalPoints ?? 0).toLocaleString()}</div>
          <div className="stat-label">Total Earned</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--info, #0891b2)' }}>{wallet?.transactionCount ?? 0}</div>
          <div className="stat-label">Transactions</div>
        </div>
      </div>

      {canCheckin ? (
        <button className="btn btn-success" onClick={handleCheckin} disabled={checkinLoading} style={{ marginBottom: '12px' }}>
          {checkinLoading ? 'Checking in...' : `✅ Daily Check-in${streak > 0 ? ` (${streak} day streak!)` : ''}`}
        </button>
      ) : (
        <div className="card" style={{ textAlign: 'center', background: 'var(--success-bg, #f0fdf4)', borderColor: 'var(--success-border, #bbf7d0)' }}>
          ✅ Checked in today{streak > 0 ? ` — ${streak} day streak!` : ''}
        </div>
      )}

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: '12px' }}>Quick Actions</div>
        <div className="grid-2">
          <button className="btn btn-outline btn-sm" onClick={() => router.push('/wallet')}>💰 Wallet</button>
          <button className="btn btn-outline btn-sm" onClick={() => router.push('/vouchers')}>🎟️ Vouchers</button>
          <button className="btn btn-outline btn-sm" onClick={() => router.push('/orders')}>🛒 Orders</button>
          <button className="btn btn-outline btn-sm" onClick={() => router.push('/referrals')}>🔗 Refer</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 600 }}>Badges</div>
          <button className="btn btn-sm btn-outline" onClick={() => router.push('/badges')}>See all</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(profile as any)?.badges?.slice(0, 4)?.map((b: any) => (
            <span key={b.id} className="badge" style={{ background: 'var(--badge-bg, #f5f3ff)', color: 'var(--badge-color, #7c3aed)' }}>{b.name}</span>
          )) || <span className="text-muted" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No badges yet</span>}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 600 }}>Missions</div>
          <button className="btn btn-sm btn-outline" onClick={() => router.push('/missions')}>View all</button>
        </div>
        {missions.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No missions available</div>
        ) : (
          missions.slice(0, 3).map((m: any) => {
            const progress = m.currentProgress ?? m.progress ?? 0;
            const target = m.target ?? 1;
            const pct = Math.min(100, Math.round((progress / target) * 100));
            return (
              <div key={m.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>{m.icon || '🎯'} {m.name}</span>
                  <span style={{ fontWeight: 600 }}>{m.completed ? '✅ Done' : `${progress}/${target}`}</span>
                </div>
                {!m.completed && (
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 600 }}>Recent Transactions</div>
          <button className="btn btn-sm btn-outline" onClick={() => router.push('/wallet')}>View all</button>
        </div>
        {txs.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No transactions yet</div>
        ) : (
          txs.slice(0, 3).map((tx: any) => (
            <div key={tx.id} className="tx-item" style={{ padding: '8px 0' }}>
              <div className="tx-left">
                <div className="tx-reason" style={{ fontSize: '13px' }}>{tx.reason || tx.type}</div>
                <div className="tx-date" style={{ fontSize: '11px' }}>{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className={`tx-amount ${tx.amount > 0 ? 'tx-earn' : 'tx-burn'}`} style={{ fontSize: '14px' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="btn btn-outline btn-sm" onClick={() => router.push('/tier-progress')} style={{ width: '100%' }}>
        🏆 View Tier Progress
      </button>
    </MemberLayout>
  );
}
