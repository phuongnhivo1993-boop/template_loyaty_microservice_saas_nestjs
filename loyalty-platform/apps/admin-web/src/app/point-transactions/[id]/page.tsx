'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';

export default function PointTransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [txn, setTxn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/points/transactions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      const data = result.data ?? result;
      setTxn(data);
    } catch { showToast('Failed to load transaction', 'error'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    load();
  }, [id]);

  const typeColors: Record<string, { bg: string; color: string }> = {
    EARN: { bg: '#dcfce7', color: '#16a34a' },
    BURN: { bg: '#fef2f2', color: '#dc2626' },
    ADJUST: { bg: '#e0e7ff', color: '#4f46e5' },
    EXPIRE: { bg: '#fef9c3', color: '#a16207' },
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (!txn) return <div className="page-layout"><Sidebar /><main className="main-content"><p>Transaction not found</p></main></div>;

  const tc = typeColors[txn.type] || { bg: '#f1f5f9', color: '#64748b' };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
          <span style={{ color: tc.color }}>{txn.type}</span> Transaction
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Transaction ID: {txn.id}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Type', value: txn.type, color: tc.color, bg: tc.bg },
            { label: 'Amount', value: `${txn.amount > 0 ? '+' : ''}${txn.amount?.toLocaleString() || 0}`, color: txn.amount > 0 ? '#16a34a' : '#dc2626', bg: '#f8fafc' },
            { label: 'Balance After', value: txn.balance?.toLocaleString() || '-', color: '#475569', bg: '#f8fafc' },
            { label: 'Date', value: txn.createdAt ? new Date(txn.createdAt).toLocaleString() : '-', color: '#475569', bg: '#f8fafc' },
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
                { label: 'ID', value: txn.id },
                { label: 'Member ID', value: txn.memberId },
                { label: 'Member Name', value: txn.member?.fullName || '-' },
                { label: 'Member Email', value: txn.member?.email || '-' },
                { label: 'Type', value: txn.type },
                { label: 'Amount', value: txn.amount?.toLocaleString() },
                { label: 'Balance', value: txn.balance?.toLocaleString() },
                { label: 'Reason', value: txn.reason || '-' },
                { label: 'Reference', value: txn.reference || '-' },
                { label: 'Created At', value: new Date(txn.createdAt).toLocaleString() },
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
