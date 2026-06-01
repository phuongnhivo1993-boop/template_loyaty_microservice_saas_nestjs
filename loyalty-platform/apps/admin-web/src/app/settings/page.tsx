'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; role?: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.email, role: payload.role });
    } catch {}
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '260px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Platform configuration and profile</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Profile</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>{user.email || '-'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Role</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>{user.role || '-'}</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>System Info</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Version</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>1.0.0</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Environment</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>Development</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
