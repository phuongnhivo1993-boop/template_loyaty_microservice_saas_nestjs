'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function TierDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [tier, setTier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tiers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setTier(data);
    } catch { showToast('Failed to load tier', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const statusStyle = tier?.status === 'ACTIVE'
    ? { color: '#16a34a', bg: '#dcfce7' }
    : { color: '#dc2626', bg: '#fef2f2' };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;
  if (!tier) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Tier not found</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.back()} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{tier.name}</h1>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>{tier.status}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ display: 'inline-block', width: '40px', height: '40px', borderRadius: '8px', background: tier.color || '#6366f1' }} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>Color: {tier.color || '#6366f1'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Min Points', value: tier.minPoints?.toLocaleString(), color: '#2563eb', bg: '#eff6ff' },
            { label: 'Max Points', value: tier.maxPoints?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Benefits', value: tier.benefits || 'None', color: '#d97706', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Tier Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: tier.id },
                { label: 'Name', value: tier.name },
                { label: 'Min Points', value: tier.minPoints?.toLocaleString() },
                { label: 'Max Points', value: tier.maxPoints?.toLocaleString() },
                { label: 'Benefits', value: tier.benefits || '-' },
                { label: 'Color', value: tier.color || '-' },
                { label: 'Status', value: tier.status },
                { label: 'Tenant ID', value: tier.tenantId },
                { label: 'Created At', value: new Date(tier.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(tier.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '200px' }}>{row.label}</td>
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
