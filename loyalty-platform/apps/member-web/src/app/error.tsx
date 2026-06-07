'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2>Something went wrong</h2>
        <p style={{ color: '#64748b', margin: '8px 0 24px' }}>{error.message}</p>
        <button className="btn btn-primary" onClick={reset}>Try Again</button>
      </div>
    </div>
  );
}
