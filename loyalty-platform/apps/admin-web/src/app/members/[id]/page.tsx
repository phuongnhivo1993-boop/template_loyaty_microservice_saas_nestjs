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
  const [activeTab, setActiveTab] = useState('overview');
  const [activity, setActivity] = useState<any>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [tierSuggestion, setTierSuggestion] = useState<any>(null);

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

  const loadTierSuggestion = async () => {
    try {
      const res = await fetch(`/api/members/${id}/tier-suggestion`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setTierSuggestion(result.data ?? result);
    } catch {}
  };

  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await fetch(`/api/members/${id}/activity`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      setActivity(result.data ?? result);
    } catch { showToast('Failed to load activity', 'error'); }
    setActivityLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
    loadTierSuggestion();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'activity') loadActivity();
  }, [activeTab]);

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

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!member) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Member not found</p></main></div>;

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '-';
  const daysUntilBirthday = (bd: string) => {
    if (!bd) return null;
    const today = new Date();
    const bday = new Date(bd);
    const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (next < today) next.setFullYear(next.getFullYear() + 1);
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{member.fullName}</h1>
            <p style={{ color: '#64748b' }}>{member.email}</p>
            {member.birthday && (
              <p style={{ color: '#d97706', fontSize: '14px', marginTop: '4px' }}>
                🎂 {formatDate(member.birthday)} {daysUntilBirthday(member.birthday) === 0 ? '(Hôm nay!)' : `(Còn ${daysUntilBirthday(member.birthday)} ngày)`}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleToggleStatus} className="btn-secondary" style={{
              color: member.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
            }}>{member.status === 'ACTIVE' ? '🔒 Lock' : '🔓 Unlock'}</button>
            {!member.kycVerified && (
              <button onClick={handleKyc} className="btn-primary">✅ Verify KYC</button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Available Points', value: member.availablePoints?.toLocaleString(), color: '#2563eb', bg: '#eff6ff' },
            { label: 'Total Points', value: member.totalPoints?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Tier', value: member.tier?.name || 'N/A', color: '#d97706', bg: '#fffbeb' },
            { label: 'Status', value: member.status, color: member.status === 'ACTIVE' ? '#16a34a' : '#dc2626', bg: member.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2' },
            { label: 'KYC', value: member.kycVerified ? 'Verified' : 'Pending', color: member.kycVerified ? '#16a34a' : '#dc2626', bg: member.kycVerified ? '#f0fdf4' : '#fef2f2' },
            { label: 'Phone', value: member.phone || 'N/A', color: '#475569', bg: '#f8fafc' },
            { label: 'Birthday', value: member.birthday ? formatDate(member.birthday) : 'N/A', color: '#d97706', bg: '#fffbeb' },
            { label: 'Member Since', value: formatDate(member.createdAt), color: '#475569', bg: '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', borderBottom: '2px solid #f1f5f9' }}>
          {['overview', 'activity'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', fontSize: '14px', fontWeight: 600,
              color: activeTab === tab ? '#2563eb' : '#64748b',
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
            }}>{tab === 'overview' ? '📋 Transaction History' : '🕐 Activity Timeline'}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="card">
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
                {member.pointTransactions?.length > 0 ? member.pointTransactions.map((tx: any) => (
                  <tr key={tx.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="status-badge" style={{
                        background: tx.type === 'EARN' ? '#dcfce7' : tx.type === 'BURN' ? '#fef2f2' : tx.type === 'EXPIRE' ? '#fef3c7' : '#eff6ff',
                        color: tx.type === 'EARN' ? '#16a34a' : tx.type === 'BURN' ? '#dc2626' : tx.type === 'EXPIRE' ? '#d97706' : '#2563eb',
                      }}>{tx.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: tx.amount > 0 ? '#16a34a' : '#dc2626' }}>{tx.amount > 0 ? '+' : ''}{tx.amount?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{tx.balance?.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>{tx.reason || '-'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            {activityLoading ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading activity...</p>
            ) : activity ? (
              <>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#2563eb' }}>🔄 Recent Transactions</h3>
                <div className="card" style={{ marginBottom: '16px' }}>
                  {activity.transactions?.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Date</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Type</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Amt</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.transactions.map((tx: any) => (
                          <tr key={tx.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span className="status-badge" style={{
                                background: tx.type === 'EARN' ? '#dcfce7' : tx.type === 'BURN' ? '#fef2f2' : tx.type === 'EXPIRE' ? '#fef3c7' : '#eff6ff',
                                color: tx.type === 'EARN' ? '#16a34a' : tx.type === 'BURN' ? '#dc2626' : tx.type === 'EXPIRE' ? '#d97706' : '#2563eb',
                                padding: '2px 8px', fontSize: '11px',
                              }}>{tx.type}</span>
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: tx.amount > 0 ? '#16a34a' : '#dc2626' }}>{tx.amount > 0 ? '+' : ''}{tx.amount}</td>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{tx.reason || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '12px' }}>No recent transactions</p>}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#7c3aed' }}>🎟️ Voucher Redemptions</h3>
                <div className="card" style={{ marginBottom: '16px' }}>
                  {activity.vouchers?.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Date</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Voucher</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Status</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Redeemed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.vouchers.map((mv: any) => (
                          <tr key={mv.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{new Date(mv.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{mv.voucher?.code || '-'}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span className="status-badge" style={{
                                background: mv.redeemed ? '#dcfce7' : '#fef3c7',
                                color: mv.redeemed ? '#16a34a' : '#d97706',
                                padding: '2px 8px', fontSize: '11px',
                              }}>{mv.redeemed ? 'Redeemed' : 'Pending'}</span>
                            </td>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{mv.redeemedAt ? new Date(mv.redeemedAt).toLocaleDateString('vi-VN') : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '12px' }}>No voucher redemptions</p>}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#059669' }}>👥 Referral Activity</h3>
                <div className="card" style={{ marginBottom: '16px' }}>
                  {activity.referrals?.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Date</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Code</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Referee</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.referrals.map((ref: any) => (
                          <tr key={ref.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{new Date(ref.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '13px' }}>{ref.code}</td>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>{ref.referee?.fullName || ref.referee?.email || 'Pending'}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span className="status-badge" style={{
                                background: ref.status === 'REWARDED' ? '#dcfce7' : ref.status === 'CONVERTED' ? '#eff6ff' : '#fef3c7',
                                color: ref.status === 'REWARDED' ? '#16a34a' : ref.status === 'CONVERTED' ? '#2563eb' : '#d97706',
                                padding: '2px 8px', fontSize: '11px',
                              }}>{ref.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '12px' }}>No referral activity</p>}
                </div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
