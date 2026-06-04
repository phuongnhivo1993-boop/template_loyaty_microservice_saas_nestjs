'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getBadges } from '@/lib/api';

export default function BadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getBadges()
      .then((res: any) => setBadges(res?.data || res || []))
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
          <div className="header-title">🏆 Badges</div>
          <div className="header-subtitle">{badges.filter(b => b.earned).length} earned of {badges.length}</div>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏅</div>
          <div className="empty-text">No badges available</div>
        </div>
      ) : (
        <div className="grid-2">
          {badges.map((b: any) => (
            <div key={b.id} className={`card badge-card ${b.earned ? 'badge-earned' : 'badge-locked'}`} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px', filter: b.earned ? 'none' : 'grayscale(1)' }}>
                {b.icon || '🏅'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: b.earned ? 'inherit' : 'var(--text-muted)' }}>{b.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{b.description}</div>
              {b.earned && b.earnedAt && (
                <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px' }}>
                  Earned {new Date(b.earnedAt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
