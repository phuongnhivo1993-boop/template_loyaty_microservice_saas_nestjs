export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '12px',
      color: 'var(--text-secondary, #64748b)',
    }}>
      <div style={{
        width: '32px', height: '32px',
        border: '3px solid var(--border, #e2e8f0)',
        borderTopColor: 'var(--primary, #3b82f6)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '14px' }}>{text}</span>
    </div>
  );
}
