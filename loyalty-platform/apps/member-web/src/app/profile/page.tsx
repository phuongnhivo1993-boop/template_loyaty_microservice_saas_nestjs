'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '../member-layout';
import { getProfile, updateProfile, changePassword } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setError('');
    getProfile().then((p: any) => {
      setProfile(p);
      setForm({ fullName: p.fullName || '', phone: p.phone || '' });
    }).catch((e) => setError(e?.message || 'Failed to load data')).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) { router.push('/login'); return; }
    loadData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      setMessage('Profile updated!');
    } catch (err: any) { setMessage(err.message); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(pwForm.oldPassword, pwForm.newPassword);
      setPwMessage('Password changed!');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err: any) { setPwMessage(err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <MemberLayout><div className="card" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></MemberLayout>;
  }

  return (
    <MemberLayout>
      {error && (
        <div className="card" style={{ background: 'var(--error-bg, #fef2f2)', color: 'var(--error, #dc2626)', border: '1px solid var(--error-border, #fecaca)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          ⚠️ {error}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: '12px' }} onClick={loadData}>Retry</button>
        </div>
      )}
      <div className="header">
        <div>
          <div className="header-title">👤 Profile</div>
          <div className="header-subtitle">{profile?.email}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{profile?.avatar ? '🖼️' : '👤'}</div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{profile?.fullName}</div>
          <div className="badge" style={{ background: 'var(--badge-bg, #f5f3ff)', color: 'var(--badge-color, #7c3aed)', marginTop: '4px' }}>{profile?.tier?.name || 'Member'}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>🪙 {profile?.availablePoints?.toLocaleString()} points</div>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Update Profile</div>
          <div className="field" style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          {message && <div style={{ fontSize: '14px', color: message.includes('Error') ? 'var(--error)' : 'var(--success)', marginBottom: '8px' }}>{message}</div>}
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>

      <form onSubmit={handleChangePassword}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>Change Password</div>
          <div className="field" style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Current Password</label>
            <input type="password" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          {pwMessage && <div style={{ fontSize: '14px', color: pwMessage.includes('Error') ? 'var(--error)' : 'var(--success)', marginBottom: '8px' }}>{pwMessage}</div>}
          <button type="submit" className="btn btn-outline">Change Password</button>
        </div>
      </form>

      <button className="btn btn-outline" onClick={() => router.push('/tier-progress')} style={{ marginTop: '12px' }}>
        🏆 View Tier Progress
      </button>

      <button className="btn btn-outline" onClick={handleLogout} style={{ marginTop: '12px', borderColor: 'var(--error)', color: 'var(--error)' }}>
        🚪 Sign Out
      </button>
    </MemberLayout>
  );
}
