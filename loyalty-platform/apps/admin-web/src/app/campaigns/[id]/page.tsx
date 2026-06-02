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
  const [performance, setPerformance] = useState<any>(null);
  const [perfLoading, setPerfLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setCampaign(result.data ?? result);
    } catch { showToast('Failed to load campaign', 'error'); }
    setLoading(false);
  };

  const loadPerformance = async () => {
    setPerfLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/performance`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setPerformance(result.data ?? result);
    } catch {}
    setPerfLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    loadPerformance();
  }, [id]);

  const statusColors: Record<string, { color: string; bg: string }> = {
    ACTIVE: { color: '#16a34a', bg: '#dcfce7' },
    DRAFT: { color: '#d97706', bg: '#fffbeb' },
    ENDED: { color: '#475569', bg: '#f1f5f9' },
    PAUSED: { color: '#dc2626', bg: '#fef2f2' },
  };

  const statusStyle = statusColors[campaign?.status] || { color: '#475569', bg: '#f1f5f9' };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!campaign) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Campaign not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '24px 0' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{campaign.name}</h1>
            <p style={{ color: '#64748b' }}>{campaign.description || 'No description'}</p>
          </div>
          <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>{campaign.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Budget', value: campaign.budget != null ? `${Number(campaign.budget).toLocaleString()} VND` : 'N/A', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Start Date', value: new Date(campaign.startDate).toLocaleDateString('vi-VN'), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'End Date', value: new Date(campaign.endDate).toLocaleDateString('vi-VN'), color: '#d97706', bg: '#fffbeb' },
            { label: 'Status', value: campaign.status, color: statusStyle.color, bg: statusStyle.bg },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {perfLoading ? (
          <p className="text-muted" style={{ padding: '20px 0' }}>Loading performance...</p>
        ) : performance ? (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📈 Campaign Performance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Points Distributed', value: performance.pointsDistributed?.toLocaleString(), color: '#2563eb', bg: '#eff6ff' },
                { label: 'Earn Transactions', value: performance.earnedTransactions?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'New Members', value: performance.membersEnrolled?.toLocaleString(), color: '#16a34a', bg: '#f0fdf4' },
                { label: 'Vouchers Redeemed', value: performance.vouchersRedeemed?.toLocaleString(), color: '#d97706', bg: '#fffbeb' },
                { label: 'Days Running', value: `${performance.daysRunning}d`, color: '#dc2626', bg: '#fef2f2' },
              ].map((stat, i) => (
                <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Campaign Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: campaign.id },
                { label: 'Name', value: campaign.name },
                { label: 'Description', value: campaign.description || 'N/A' },
                { label: 'Status', value: campaign.status },
                { label: 'Budget', value: campaign.budget != null ? `${Number(campaign.budget).toLocaleString()} VND` : 'N/A' },
                { label: 'Start Date', value: new Date(campaign.startDate).toLocaleString('vi-VN') },
                { label: 'End Date', value: new Date(campaign.endDate).toLocaleString('vi-VN') },
                { label: 'Created At', value: new Date(campaign.createdAt).toLocaleString('vi-VN') },
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
