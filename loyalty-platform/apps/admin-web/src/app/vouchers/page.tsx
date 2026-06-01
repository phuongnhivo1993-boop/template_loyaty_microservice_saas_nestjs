'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function VouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('/api/vouchers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(res => setVouchers(Array.isArray(res) ? res : res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Vouchers</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Manage discount and gift vouchers</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Code</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Type</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Value</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Used</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>Expires</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No vouchers found</td></tr>
              ) : vouchers.map((v: any) => (
                <tr key={v.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontFamily: 'monospace' }}>{v.code}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: '#f1f5f9', color: '#475569',
                    }}>{v.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{v.value.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {v.usedCount > 0 ? (
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>{v.usedCount}/{v.maxUsage || '∞'}</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>0/{v.maxUsage || '∞'}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString() : 'No expiry'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
