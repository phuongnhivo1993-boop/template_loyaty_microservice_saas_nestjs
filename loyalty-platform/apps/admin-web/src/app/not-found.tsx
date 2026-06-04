'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-layout">
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', marginLeft: 0 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>404</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Page Not Found</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </div>
          <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
