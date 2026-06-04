'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 400 }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>404</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Page Not Found</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </div>
        <Link
          href={isAuthenticated ? '/dashboard' : '/login'}
          className="btn btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 32px' }}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
        </Link>
      </div>
    </div>
  );
}
