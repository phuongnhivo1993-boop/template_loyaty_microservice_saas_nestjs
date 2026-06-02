'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function ReferralDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [referral, setReferral] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/referrals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setReferral(data);
    } catch { showToast('Failed to load referral', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const statusColors: Record<string, { color: string; bg: string }> = {
    PENDING: { color: '#a16207', bg: '#fef9c3' },
    CONVERTED: { color: '#16a34a', bg: '#dcfce7' },
    REWARDED: { color: '#2563eb', bg: '#eff6ff' },
  };
  const s = statusColors[referral?.status] || { color: '#64748b', bg: '#f1f5f9' };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;
  if (!referral) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Referral not found</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.back()} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{referral.code}</h1>
            <p style={{ color: '#64748b' }}>Referral Code</p>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: s.bg, color: s.color }}>{referral.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Status', value: referral.status, color: s.color, bg: s.bg },
            { label: 'Reward Given', value: referral.rewardGiven ? 'Yes' : 'No', color: referral.rewardGiven ? '#16a34a' : '#d97706', bg: referral.rewardGiven ? '#f0fdf4' : '#fffbeb' },
            { label: 'Created', value: new Date(referral.createdAt).toLocaleDateString(), color: '#64748b', bg: '#f1f5f9' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {referral.referrer && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Referrer</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { label: 'ID', value: referral.referrer.id },
                    { label: 'Name', value: referral.referrer.fullName },
                    { label: 'Email', value: referral.referrer.email },
                    { label: 'Phone', value: referral.referrer.phone || '-' },
                    { label: 'Status', value: referral.referrer.status },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '100px' }}>{row.label}</td>
                      <td style={{ padding: '8px 12px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {referral.referee && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Referee</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { label: 'ID', value: referral.referee.id },
                    { label: 'Name', value: referral.referee.fullName },
                    { label: 'Email', value: referral.referee.email },
                    { label: 'Phone', value: referral.referee.phone || '-' },
                    { label: 'Status', value: referral.referee.status },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '100px' }}>{row.label}</td>
                      <td style={{ padding: '8px 12px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(!referral.referrer || !referral.referee) && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  { label: 'ID', value: referral.id },
                  { label: 'Code', value: referral.code },
                  { label: 'Referrer ID', value: referral.referrerId },
                  { label: 'Referee ID', value: referral.refereeId || '-' },
                  { label: 'Status', value: referral.status },
                  { label: 'Reward Given', value: referral.rewardGiven ? 'Yes' : 'No' },
                  { label: 'Tenant ID', value: referral.tenantId },
                  { label: 'Created At', value: new Date(referral.createdAt).toLocaleString() },
                  { label: 'Updated At', value: new Date(referral.updatedAt).toLocaleString() },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b', width: '200px' }}>{row.label}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
