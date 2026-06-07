'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      background: 'var(--bg-primary, #f8fafc)',
    }}>
      <div style={{
        background: 'var(--bg-card, white)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '480px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>!</div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary, #1e293b)', marginBottom: '12px' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: '24px', fontSize: '14px' }}>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="btn-primary"
          style={{ padding: '12px 24px', cursor: 'pointer' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
