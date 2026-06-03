'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import { getBadge } from '@/lib/api';

export default function BadgeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [badge, setBadge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    setLoading(true);
    getBadge(id as string).then(setBadge).catch(() => showToast('Failed to load badge', 'error')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!badge) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Badge not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {badge.iconUrl ? (
              <img src={badge.iconUrl} alt={badge.name} style={{ width: '64px', height: '64px', borderRadius: '12px' }} />
            ) : (
              <span style={{ fontSize: '48px' }}>🏅</span>
            )}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{badge.name}</h1>
              <p style={{ color: '#64748b' }}>{badge.description || 'No description'}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Badge Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: badge.id },
                { label: 'Name', value: badge.name },
                { label: 'Description', value: badge.description || '-' },
                { label: 'Icon URL', value: badge.iconUrl || '-' },
                { label: 'Tenant ID', value: badge.tenantId },
                { label: 'Created At', value: new Date(badge.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(badge.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '200px' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {badge.criteria && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Criteria</h2>
            <pre style={{ fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>{JSON.stringify(badge.criteria, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
