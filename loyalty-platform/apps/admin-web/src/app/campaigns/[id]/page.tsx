'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setCampaign(data);
    } catch { showToast('Failed to load campaign', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const statusColors: Record<string, { color: string; bg: string }> = {
    ACTIVE: { color: '#16a34a', bg: '#dcfce7' },
    DRAFT: { color: '#d97706', bg: '#fffbeb' },
    COMPLETED: { color: '#475569', bg: '#f1f5f9' },
    PAUSED: { color: '#dc2626', bg: '#fef2f2' },
  };

  const statusStyle = statusColors[campaign?.status] || { color: '#475569', bg: '#f1f5f9' };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;
  if (!campaign) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Campaign not found</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.back()} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{campaign.name}</h1>
            <p style={{ color: '#64748b' }}>{campaign.description || 'No description'}</p>
          </div>
          <span style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            background: statusStyle.bg, color: statusStyle.color,
          }}>{campaign.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Budget', value: campaign.budget != null ? `$${Number(campaign.budget).toLocaleString()}` : 'N/A', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Start Date', value: new Date(campaign.startDate).toLocaleDateString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'End Date', value: new Date(campaign.endDate).toLocaleDateString(), color: '#d97706', bg: '#fffbeb' },
            { label: 'Status', value: campaign.status, color: statusStyle.color, bg: statusStyle.bg },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Campaign Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: campaign.id },
                { label: 'Name', value: campaign.name },
                { label: 'Description', value: campaign.description || 'N/A' },
                { label: 'Status', value: campaign.status },
                { label: 'Budget', value: campaign.budget != null ? `$${Number(campaign.budget).toLocaleString()}` : 'N/A' },
                { label: 'Start Date', value: new Date(campaign.startDate).toLocaleString() },
                { label: 'End Date', value: new Date(campaign.endDate).toLocaleString() },
                { label: 'Tenant ID', value: campaign.tenantId },
                { label: 'Created At', value: new Date(campaign.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(campaign.updatedAt).toLocaleString() },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#475569', width: '180px' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
