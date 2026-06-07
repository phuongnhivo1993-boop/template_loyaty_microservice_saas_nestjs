'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setMessage('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired token');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-logo">🔐</div>
      <div className="login-title">Reset Password</div>
      <div className="login-subtitle">Enter your new password</div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="field">
          <label>Reset Token</label>
          <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste reset token from email" required />
        </div>
        <div className="field">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" required />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" required />
        </div>
        {message && <div style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '8px' }}>{message}</div>}
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <Link href="/login" className="login-link">Back to login</Link>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
