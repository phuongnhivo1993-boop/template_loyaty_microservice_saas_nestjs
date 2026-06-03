'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { getReward } from '@/lib/api';
import { api } from '@/lib/api';

export default function RewardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [reward, setReward] = useState<any>(null);
  const [redemptions, setRedemptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    setLoading(true);
    Promise.all([
      getReward(id as string),
      api.get(`/rewards/${id}/redemptions`),
    ]).then(([rwd, red]) => { setReward(rwd); setRedemptions(red); }).catch(() => showToast('Failed to load reward', 'error')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!reward) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Reward not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{reward.name}</h1>
            <p style={{ color: '#64748b' }}>{reward.description}</p>
          </div>
        </div>

        {reward.imageUrl && (
          <div style={{ marginBottom: '24px' }}>
            <img src={reward.imageUrl} alt={reward.name} style={{ maxWidth: '300px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
          </div>
        )}

        <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Points Required', value: reward.pointsRequired?.toLocaleString(), color: '#2563eb', bg: '#eff6ff' },
            { label: 'Quantity', value: reward.quantity?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Type', value: reward.type, color: '#d97706', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {redemptions && (
          <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Redemptions</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>{redemptions.totalRedemptions?.toLocaleString() || 0}</p>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Remaining Stock</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#d97706' }}>{(reward.quantity || 0).toLocaleString()}</p>
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Points Spent</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#7c3aed' }}>{((redemptions.totalRedemptions || 0) * (reward.pointsRequired || 0)).toLocaleString()}</p>
            </div>
          </div>
        )}

        {redemptions?.recentRedemptions?.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Recent Redemptions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Member</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Points Used</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.recentRedemptions.map((r: any, i: number) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.email}</div>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{r.pointsUsed?.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: reward.id },
                { label: 'Name', value: reward.name },
                { label: 'Description', value: reward.description || '-' },
                { label: 'Type', value: reward.type },
                { label: 'Points Required', value: reward.pointsRequired?.toLocaleString() },
                { label: 'Quantity', value: reward.quantity?.toLocaleString() },
                { label: 'Image URL', value: reward.imageUrl || '-' },
                { label: 'Tenant ID', value: reward.tenantId },
                { label: 'Created At', value: new Date(reward.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(reward.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
