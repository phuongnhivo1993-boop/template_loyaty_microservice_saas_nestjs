'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setMission(data);
    } catch { showToast('Failed to load mission', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;
  if (!mission) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Mission not found</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.back()} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Back</button>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{mission.name}</h1>
          <p style={{ color: '#64748b' }}>{mission.description || 'No description'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Points Reward', value: `+${mission.pointsReward?.toLocaleString() || 0}`, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Start Date', value: mission.startDate ? new Date(mission.startDate).toLocaleDateString() : 'N/A', color: '#2563eb', bg: '#eff6ff' },
            { label: 'End Date', value: mission.endDate ? new Date(mission.endDate).toLocaleDateString() : 'N/A', color: '#d97706', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Mission Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: mission.id },
                { label: 'Name', value: mission.name },
                { label: 'Description', value: mission.description || '-' },
                { label: 'Points Reward', value: mission.pointsReward?.toLocaleString() },
                { label: 'Start Date', value: mission.startDate ? new Date(mission.startDate).toLocaleString() : '-' },
                { label: 'End Date', value: mission.endDate ? new Date(mission.endDate).toLocaleString() : '-' },
                { label: 'Tenant ID', value: mission.tenantId },
                { label: 'Created At', value: new Date(mission.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(mission.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '200px' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mission.criteria && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Criteria</h2>
            <pre style={{ fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>{JSON.stringify(mission.criteria, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
