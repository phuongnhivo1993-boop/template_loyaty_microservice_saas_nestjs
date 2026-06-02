'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/Toast';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { FormInput, FormActions } from '@/components/FormField';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id?: string; email?: string; role?: string; fullName?: string }>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ fullName: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.sub, email: payload.email, role: payload.role, fullName: payload.fullName || payload.name || '' });
      setProfileForm({ fullName: payload.fullName || payload.name || '' });
    } catch {}
    setLoading(false);
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST', headers,
        body: JSON.stringify({ oldPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      if (!res.ok) { showToast('Failed to change password', 'error'); return; }
      showToast('Password changed successfully', 'success');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { showToast('Network error', 'error'); }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) { showToast('User ID not found', 'error'); return; }
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ fullName: profileForm.fullName }),
      });
      if (!res.ok) { showToast('Failed to update profile', 'error'); return; }
      showToast('Profile updated successfully', 'success');
      setShowProfileModal(false);
      setUser(prev => ({ ...prev, fullName: profileForm.fullName }));
    } catch { showToast('Network error', 'error'); }
  };

  if (loading) return <div className="page-layout"><Sidebar /><main className="main-content"><TableSkeleton rows={5} cols={5} /></main></div>;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <PageHeader title="Settings" subtitle="Platform configuration and profile" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Profile</h2>
              <button onClick={() => setShowProfileModal(true)}
                style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>{user.email || '-'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Full Name</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>{user.fullName || '-'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Role</label>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>{user.role || '-'}</div>
            </div>
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Security</h2>
              <button onClick={() => setShowPasswordModal(true)} className="btn-primary">Change Password</button>
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
        </div>

        <Modal open={showPasswordModal} title="Change Password" onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={handlePasswordChange}>
            <FormInput label="Current Password" type="password" value={passwordForm.currentPassword} onChange={v => setPasswordForm({ ...passwordForm, currentPassword: v })} required />
            <FormInput label="New Password" type="password" value={passwordForm.newPassword} onChange={v => setPasswordForm({ ...passwordForm, newPassword: v })} required minLength={6} />
            <FormInput label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={v => setPasswordForm({ ...passwordForm, confirmPassword: v })} required />
            <FormActions onCancel={() => setShowPasswordModal(false)} loading={false} submitLabel="Update Password" />
          </form>
        </Modal>

        <Modal open={showProfileModal} title="Edit Profile" onClose={() => setShowProfileModal(false)}>
          <form onSubmit={handleProfileUpdate}>
            <FormInput label="Full Name" value={profileForm.fullName} onChange={v => setProfileForm({ ...profileForm, fullName: v })} required />
            <FormActions onCancel={() => setShowProfileModal(false)} loading={false} submitLabel="Save" />
          </form>
        </Modal>
      </main>
    </div>
  );
}
