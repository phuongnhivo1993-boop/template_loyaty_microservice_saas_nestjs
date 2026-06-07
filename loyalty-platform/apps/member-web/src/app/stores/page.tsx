'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getStores } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getStores()
      .then((res: any) => setStores(res?.data || res || []))
      .catch((e) => setError(e?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  if (loading) {
    return <MemberLayout><CardSkeleton /></MemberLayout>;
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
          <div className="header-title">🏪 Stores</div>
          <div className="header-subtitle">{stores.length} store{stores.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {stores.length === 0 ? (
        <EmptyState icon="🏪" title="No stores available" />
      ) : (
        stores.map((s: any) => (
          <div key={s.id} className="card">
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{s.name}</div>
            {s.address && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 2 }}>📍 {s.address}</div>}
            {s.phone && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📞 {s.phone}</div>}
            {s.distance != null && (
              <div style={{ marginTop: 8, fontSize: '12px', color: 'var(--primary)' }}>
                📏 {s.distance} km
              </div>
            )}
          </div>
        ))
      )}
    </MemberLayout>
  );
}
