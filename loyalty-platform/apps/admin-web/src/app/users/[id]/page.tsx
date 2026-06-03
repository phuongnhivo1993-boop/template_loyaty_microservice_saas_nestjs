'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { useToast } from '@/components/Toast';
import { getUser } from '@/lib/api';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    setLoading(true);
    getUser(id as string).then(setUser).catch(() => showToast('Failed to load user', 'error')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><DetailSkeleton /></main></div>;
  if (!user) return <div className="page-layout"><Sidebar /><main className="main-content"><p>User not found</p></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{user.fullName}</h1>
            <p style={{ color: '#64748b' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Role', value: user.role, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Tenant ID', value: user.tenantId, color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Phone', value: user.phone || 'N/A', color: '#475569', bg: '#f8fafc' },
            { label: 'Created', value: new Date(user.createdAt).toLocaleDateString(), color: '#d97706', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{ background: stat.bg, borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>User Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'ID', value: user.id },
                { label: 'Email', value: user.email },
                { label: 'Full Name', value: user.fullName },
                { label: 'Phone', value: user.phone || 'N/A' },
                { label: 'Role', value: user.role },
                { label: 'Tenant ID', value: user.tenantId },
                { label: 'Created At', value: new Date(user.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(user.updatedAt).toLocaleString() },
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
