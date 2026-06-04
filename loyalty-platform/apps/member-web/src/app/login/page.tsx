'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { memberLogin } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await memberLogin(email, password);
      const token = res.accessToken || res.token || (typeof res === 'string' ? res : null);
      if (token) {
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-logo">🪙</div>
      <div className="login-title">Member Portal</div>
      <div className="login-subtitle">Sign in to your loyalty account</div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <Link href="/forgot-password" className="login-link">Forgot password?</Link>
        <Link href="/register" className="login-link" style={{ marginTop: '8px' }}>Don't have an account? Register</Link>
      </form>
    </div>
  );
}
