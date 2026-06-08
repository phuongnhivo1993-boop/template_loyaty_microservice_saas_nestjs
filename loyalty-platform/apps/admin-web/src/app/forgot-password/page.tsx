'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to send reset link' }));
        throw new Error(err.message || err.error || 'Failed to send reset link');
      }
      const result = await res.json();
      const token = result?.data?.resetToken || result?.resetToken;
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary, #f1f5f9)', padding: '20px' }}>
      <div className="card" style={{ padding: '40px', maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔑</div>
          <h1 className="card-title" style={{ textAlign: 'center', fontSize: '24px' }}>
            Forgot Password
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            border: '1px solid #fecaca',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            background: '#f0fdf4',
            color: '#16a34a',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            border: '1px solid #bbf7d0',
            wordBreak: 'break-all',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px', color: '#1e293b' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="search-input"
              style={{ maxWidth: 'none', padding: '12px 16px', fontSize: '15px' }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/login" style={{ color: 'var(--primary, #2563eb)', textDecoration: 'none', fontSize: '14px' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
