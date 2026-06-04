'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', fullName: '', phone: '', password: '', confirmPassword: '', tenantDomain: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.fullName || !form.password) {
      setError('Email, full name and password are required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/members/register', {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone || undefined,
        tenantDomain: form.tenantDomain || undefined,
        password: form.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-logo">🎉</div>
        <h1 className="login-title">Registration Successful!</h1>
        <p className="login-subtitle">Your account has been created. You can now log in.</p>
        <button className="btn btn-primary" onClick={() => router.push('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-logo">✨</div>
      <h1 className="login-title">Join Loyalty</h1>
      <p className="login-subtitle">Create your account to start earning rewards</p>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Nguyen Van A"
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
            required
          />
        </div>

        <div className="field">
          <label>Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+84 123 456 789"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Min 6 characters"
            minLength={6}
            required
          />
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Repeat your password"
            minLength={6}
            required
          />
        </div>

        <div className="field">
          <label>Tenant Domain (optional)</label>
          <input
            type="text"
            value={form.tenantDomain}
            onChange={(e) => setForm({ ...form, tenantDomain: e.target.value })}
            placeholder="your-tenant-domain"
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <Link href="/login" className="login-link">
        Already have an account? Sign in
      </Link>
    </div>
  );
}
