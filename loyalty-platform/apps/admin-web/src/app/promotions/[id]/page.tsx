'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function PromotionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [promotion, setPromotion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/promotions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setPromotion(data);
    } catch { showToast('Failed to load promotion', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const statusColors: Record<string, { color: string; bg: string }> = {
    ACTIVE: { color: '#16a34a', bg: '#dcfce7' },
    DRAFT: { color: '#d97706', bg: '#fffbeb' },
    INACTIVE: { color: '#dc2626', bg: '#fef2f2' },
  };
  const s = statusColors[promotion?.status] || { color: '#475569', bg: '#f1f5f9' };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!promotion) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Promotion not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{promotion.name}</h1>
            <p style={{ color: '#64748b' }}>{promotion.description || 'No description'}</p>
          </div>
          <span className="status-badge" style={{ background: s.bg, color: s.color }}>{promotion.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Priority', value: promotion.priority ?? 0, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Status', value: promotion.status || 'DRAFT', color: s.color, bg: s.bg },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Conditions</h2>
            <pre style={{ fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '16px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px' }}>{JSON.stringify(promotion.conditions, null, 2)}</pre>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Actions</h2>
            <pre style={{ fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '16px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px' }}>{JSON.stringify(promotion.actions, null, 2)}</pre>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: promotion.id },
                { label: 'Name', value: promotion.name },
                { label: 'Description', value: promotion.description || '-' },
                { label: 'Priority', value: promotion.priority ?? 0 },
                { label: 'Status', value: promotion.status || 'DRAFT' },
                { label: 'Tenant ID', value: promotion.tenantId },
                { label: 'Created At', value: new Date(promotion.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(promotion.updatedAt).toLocaleString() },
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
