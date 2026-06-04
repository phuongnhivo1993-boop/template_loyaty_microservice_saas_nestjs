'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getMissions } from '@/lib/api';

export default function MissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getMissions()
      .then((res: any) => setMissions(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

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
          <div className="header-title">🎯 Missions</div>
          <div className="header-subtitle">Complete tasks to earn rewards</div>
        </div>
      </div>

      {missions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No missions available</div>
        </div>
      ) : (
        missions.map((m: any) => {
          const progress = m.currentProgress ?? m.progress ?? 0;
          const target = m.target ?? 1;
          const pct = Math.min(100, Math.round((progress / target) * 100));
          return (
            <div key={m.id} className="card" style={{ borderLeft: `4px solid ${m.completed ? 'var(--success)' : 'var(--primary)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{m.icon || '🎯'} {m.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.description}</div>
                </div>
                <span className="badge" style={{
                  background: m.completed ? '#dcfce7' : '#f1f5f9',
                  color: m.completed ? 'var(--success)' : 'var(--text-muted)',
                }}>
                  {m.completed ? '✅ Done' : `${progress}/${target}`}
                </span>
              </div>
              {!m.completed && (
                <div className="progress-bar" style={{ marginTop: '12px' }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              )}
              {m.reward && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  🏆 Reward: {m.reward}
                </div>
              )}
            </div>
          );
        })
      )}
    </MemberLayout>
  );
}
