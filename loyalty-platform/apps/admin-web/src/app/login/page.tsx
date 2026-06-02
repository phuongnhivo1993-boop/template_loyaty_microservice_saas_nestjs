'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('host@loyalty.vn');
  const [password, setPassword] = useState('Host@123456');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/host/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Login failed. Please check your credentials.');
        return;
      }

      const result = await res.json();
      const data = result.data ?? result;
      localStorage.setItem('token', data.accessToken);
      router.push('/dashboard');
    } catch {
      setError('Cannot connect to server. Make sure the API Gateway is running.');
    }
  };

  return (
    <div>
      <div className="card" style={{ padding: '40px', maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="card-title" style={{ textAlign: 'center', fontSize: '28px' }}>
            Loyalty Platform
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Admin Dashboard</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
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
              />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
              Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="search-input"
                style={{ maxWidth: 'none', padding: '12px 16px', fontSize: '15px' }}
              />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
