'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setMember(result.data ?? result);
    } catch { showToast('Failed to load member', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      const res = await fetch(`/api/members/${id}/toggle-status`, { method: 'POST', headers });
      if (!res.ok) { showToast('Failed to toggle status', 'error'); return; }
      showToast('Status updated', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  const handleKyc = async () => {
    try {
      const res = await fetch(`/api/members/${id}/kyc`, { method: 'POST', headers });
      if (!res.ok) { showToast('KYC verification failed', 'error'); return; }
      showToast('KYC verified successfully', 'success');
      load();
    } catch { showToast('Network error', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;
  if (!member) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Member not found</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.back()} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{member.fullName}</h1>
            <p style={{ color: '#64748b' }}>{member.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleToggleStatus} style={{
              padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500,
              color: member.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
            }}>{member.status === 'ACTIVE' ? '🔒 Lock' : '🔓 Unlock'}</button>
            {!member.kycVerified && (
              <button onClick={handleKyc} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>✅ Verify KYC</button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Available Points', value: member.availablePoints?.toLocaleString(), color: '#2563eb', bg: '#eff6ff' },
            { label: 'Total Points', value: member.totalPoints?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Tier', value: member.tier?.name || 'N/A', color: '#d97706', bg: '#fffbeb' },
            { label: 'Status', value: member.status, color: member.status === 'ACTIVE' ? '#16a34a' : '#dc2626', bg: member.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2' },
            { label: 'KYC', value: member.kycVerified ? 'Verified' : 'Pending', color: member.kycVerified ? '#16a34a' : '#dc2626', bg: member.kycVerified ? '#f0fdf4' : '#fef2f2' },
            { label: 'Phone', value: member.phone || 'N/A', color: '#475569', bg: '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Transaction History</h2>
          {member.pointTransactions?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Balance</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#64748b' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {member.pointTransactions.map((tx: any) => (
                  <tr key={tx.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        background: tx.type === 'EARN' ? '#dcfce7' : tx.type === 'BURN' ? '#fef2f2' : '#eff6ff',
                        color: tx.type === 'EARN' ? '#16a34a' : tx.type === 'BURN' ? '#dc2626' : '#2563eb',
                      }}>{tx.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: tx.amount > 0 ? '#16a34a' : '#dc2626' }}>{tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{tx.balance?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>{tx.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No transactions yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
