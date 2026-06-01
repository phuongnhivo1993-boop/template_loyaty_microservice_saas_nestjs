'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch(`/api/tenants/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setTenant(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <div style={{ display: 'flex', minHeight: '100vh' }}><Sidebar /><main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>Loading...</main></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <button onClick={() => router.push('/tenants')} style={{
          background: 'none', border: 'none', color: '#2563eb',
          cursor: 'pointer', fontSize: '14px', marginBottom: '16px',
        }}>← Back to Tenants</button>

        {tenant ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{tenant.name}</h1>
                <p style={{ color: '#64748b', marginTop: '4px' }}>{tenant.domain}</p>
              </div>
              <span style={{
                padding: '6px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                background: tenant.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2',
                color: tenant.status === 'ACTIVE' ? '#16a34a' : '#dc2626',
              }}>{tenant.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Details</h2>
                <div style={{ marginBottom: '12px' }}><strong>Email:</strong> {tenant.email}</div>
                <div style={{ marginBottom: '12px' }}><strong>Phone:</strong> {tenant.phone || '-'}</div>
                <div style={{ marginBottom: '12px' }}><strong>Address:</strong> {tenant.address || '-'}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Stats</h2>
                <div style={{ marginBottom: '12px' }}><strong>Users:</strong> {tenant._count?.users || 0}</div>
                <div style={{ marginBottom: '12px' }}><strong>Members:</strong> {tenant._count?.members || 0}</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#dc2626' }}>Tenant not found</p>
        )}
      </main>
    </div>
  );
}
