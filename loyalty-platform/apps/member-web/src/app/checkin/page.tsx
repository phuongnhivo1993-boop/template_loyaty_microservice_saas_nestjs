'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getCheckinStatus, doCheckin } from '@/lib/api';

export default function CheckinPage() {
  const router = useRouter();
  const [checkin, setCheckin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getCheckinStatus()
      .then((res: any) => setCheckin(res?.data || res))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
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
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  const canCheckin = checkin?.canCheckin ?? true;
  const streak = checkin?.currentStreak ?? 0;
  const totalCheckins = checkin?.totalCheckins ?? 0;
  const longestStreak = checkin?.longestStreak ?? 0;
  const history = checkin?.history || checkin?.checkIns || [];
  const todayLabel = checkin?.todayLabel || new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
          <div className="header-title">✅ Daily Check-in</div>
          <div className="header-subtitle">{todayLabel}</div>
        </div>
      </div>

      <div className="card points-display" style={{ padding: '32px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>📅</div>
        <div className="points-value" style={{ fontSize: '36px' }}>{streak}</div>
        <div className="points-label">Day Streak</div>
      </div>

      {canCheckin ? (
        <button
          className="btn btn-success"
          onClick={handleCheckin}
          disabled={checkinLoading}
          style={{ marginBottom: '12px' }}
        >
          {checkinLoading ? 'Checking in...' : `✅ Check in now${streak > 0 ? ` (${streak} day streak!)` : ''}`}
        </button>
      ) : (
        <div className="card" style={{ textAlign: 'center', background: 'var(--success-bg, #f0fdf4)', borderColor: 'var(--success-border, #bbf7d0)' }}>
          ✅ Checked in today{streak > 0 ? ` — ${streak} day streak!` : ''}
        </div>
      )}

      <div className="grid-2" style={{ marginTop: '12px' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{totalCheckins}</div>
          <div className="stat-label">Total Check-ins</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--info, #0891b2)' }}>{longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Check-in History</div>
          {history.slice(0, 30).map((h: any, i: number) => (
            <div key={h.id || i} className="tx-item">
              <div className="tx-left">
                <div className="tx-reason">
                  {new Date(h.checkinDate || h.createdAt).toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="tx-date">
                  {h.pointsEarned ? `+${h.pointsEarned} pts` : 'Checked in'}
                </div>
              </div>
              {h.streak && (
                <span className="badge" style={{ background: 'var(--badge-bg, #f5f3ff)', color: 'var(--badge-color, #7c3aed)' }}>
                  🔥 {h.streak}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
