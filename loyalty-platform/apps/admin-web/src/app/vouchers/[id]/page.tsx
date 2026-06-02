'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function VoucherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vouchers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setVoucher(data);
    } catch { showToast('Failed to load voucher', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const isExpired = voucher?.expiresAt ? new Date(voucher.expiresAt) < new Date() : false;
  const isFullyUsed = voucher?.maxUsage ? voucher.usedCount >= voucher.maxUsage : false;

  const getStatus = () => {
    if (isExpired) return { label: 'Expired', color: '#dc2626', bg: '#fef2f2' };
    if (isFullyUsed) return { label: 'Fully Used', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Active', color: '#16a34a', bg: '#f0fdf4' };
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!voucher) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Voucher not found</p></main></div>;

  const status = getStatus();

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace' }}>{voucher.code}</h1>
            <p style={{ color: '#64748b' }}>Voucher ID: {voucher.id}</p>
          </div>
          <span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Type', value: voucher.type, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Value', value: voucher.value?.toLocaleString(), color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Usage', value: `${voucher.usedCount ?? 0} / ${voucher.maxUsage ?? '∞'}`, color: '#d97706', bg: '#fffbeb' },
            { label: 'Expires', value: voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString() : 'Never', color: isExpired ? '#dc2626' : '#475569', bg: isExpired ? '#fef2f2' : '#f8fafc' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: voucher.id },
                { label: 'Code', value: voucher.code },
                { label: 'Type', value: voucher.type },
                { label: 'Value', value: voucher.value?.toLocaleString() },
                { label: 'Max Usage', value: voucher.maxUsage ?? 'Unlimited' },
                { label: 'Used Count', value: voucher.usedCount ?? 0 },
                { label: 'Expires At', value: voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleString() : 'Never' },
                { label: 'Tenant ID', value: voucher.tenantId },
                { label: 'Created At', value: new Date(voucher.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(voucher.updatedAt).toLocaleString() },
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
