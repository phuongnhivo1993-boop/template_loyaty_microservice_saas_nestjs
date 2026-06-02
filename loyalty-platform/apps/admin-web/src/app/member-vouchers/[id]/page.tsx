'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function MemberVoucherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [mv, setMv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member-vouchers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setMv(data);
    } catch { showToast('Failed to load member voucher', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!mv) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Member voucher not found</p></main></div>;

  const isRedeemed = mv.redeemed;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
          {mv.voucher?.code || 'Member Voucher'}
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Assignment ID: {mv.id}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Status', value: isRedeemed ? 'Redeemed' : 'Active', color: isRedeemed ? '#16a34a' : '#2563eb', bg: isRedeemed ? '#dcfce7' : '#eff6ff' },
            { label: 'Voucher Code', value: mv.voucher?.code || '-', color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Member', value: mv.member?.fullName || mv.memberId?.slice(0, 12) || '-', color: '#d97706', bg: '#fffbeb' },
            { label: 'Assigned', value: mv.createdAt ? new Date(mv.createdAt).toLocaleDateString() : '-', color: '#475569', bg: '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'Assignment ID', value: mv.id },
                { label: 'Member ID', value: mv.memberId },
                { label: 'Member Name', value: mv.member?.fullName || '-' },
                { label: 'Member Email', value: mv.member?.email || '-' },
                { label: 'Voucher ID', value: mv.voucherId },
                { label: 'Voucher Code', value: mv.voucher?.code || '-' },
                { label: 'Voucher Type', value: mv.voucher?.type || '-' },
                { label: 'Voucher Value', value: mv.voucher?.value?.toLocaleString() || '-' },
                { label: 'Redeemed', value: isRedeemed ? 'Yes' : 'No' },
                { label: 'Redeemed At', value: mv.redeemedAt ? new Date(mv.redeemedAt).toLocaleString() : '-' },
                { label: 'Created At', value: new Date(mv.createdAt).toLocaleString() },
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
