'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await forgotPassword(email);
      const token = res?.resetToken || (typeof res === 'object' ? null : res);
      if (token) {
        setMessage(`Reset link sent! For development, use token: ${token}`);
      } else {
        setMessage('If the email exists, a reset link has been sent.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-logo">🔑</div>
      <div className="login-title">Forgot Password</div>
      <div className="login-subtitle">Enter your email to receive a reset link</div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
        </div>
        {message && <div style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '8px', wordBreak: 'break-all' }}>{message}</div>}
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <Link href="/login" className="login-link">Back to login</Link>
      </form>
    </div>
  );
}
